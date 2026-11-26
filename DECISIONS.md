# Architectural Decisions & Checkpoints (`DECISIONS.md`)

This document records architectural choices and engineering trade-offs made for the **Smart Order Builder** frontend assessment for DevsStream Limited.

---

## Checkpoints (Pre-implementation)

### Checkpoint C1: Floating Point Risks & Hand Calculation of TC-06 VAT

#### 1. Why storing `679.50` as a JavaScript float is risky:
JavaScript represents all numbers using IEEE 754 double-precision floating-point format (64-bit binary). In binary floating-point representation, fractional numbers that cannot be represented as finite powers of 2 (such as tenths and hundredths) become repeating decimals. Performing repeated arithmetic operations (`+`, `-`, `*`) on floats leads to cumulative rounding errors (classic example: `0.1 + 0.2 === 0.30000000000000004`).
In financial calculations like cart totals, discounts, and tiered taxations, even a single-bit rounding discrepancy cascades into mismatched line totals, failed reconciliation, and non-deterministic currency figures. To eliminate rounding drift entirely, our system treats currency as **integers in the smallest unit (poisha)**, where `1 BDT = 100 poisha` (e.g., `679.50 BDT` is stored strictly as `67950 poisha`).

#### 2. Hand Calculation of TC-06 VAT:
- **Cart setup:** `Cart B x1 + C x2`, Server time: `10:59:59` (Strictly before 11:00:00).
- **Unit prices:**
  - Item B = `679.50 BDT` = `67,950 poisha`
  - Item C = `490.00 BDT` = `49,000 poisha`
- **Subtotal:**
  $$\text{Subtotal} = (67,950 \times 1) + (49,000 \times 2) = 67,950 + 98,000 = 165,950 \text{ poisha} \quad (1,659.50 \text{ BDT})$$
- **Discounts evaluation:**
  - $C_1$: Threshold $\ge 120,000$ poisha ($1,200$ BDT) met $\to$ Flat $10,000$ poisha ($100$ BDT) off.
  - $C_2$ (Coupon `MORNING15`): Valid as server time is before 11:00:00.
    $$15\% \text{ of } 165,950 \text{ poisha} = 24,892.5 \text{ poisha}$$
    Rounding half-up gives $24,893$ poisha ($248.93$ BDT).
    However, $C_2$ has a cap of $150$ BDT ($15,000$ poisha).
    Therefore, $C_2 = 15,000$ poisha.
  - **Winning discount:** $\max(C_1, C_2) = \max(10,000, 15,000) = 15,000 \text{ poisha}$ ($C_2$ wins).
- **Discounted Subtotal:**
  $$165,950 - 15,000 = 150,950 \text{ poisha} \quad (1,509.50 \text{ BDT})$$
- **VAT Calculation (5% on discounted subtotal):**
  $$\text{Exact VAT} = 150,950 \times 0.05 = 7,547.5 \text{ poisha}$$
  Using the rule: *"every percentage step rounds half-up to the nearest poisha"*:
  $$7,547.5 \text{ poisha} \xrightarrow{\text{round half-up}} 7,548 \text{ poisha} \quad (75.48 \text{ BDT})$$
- **Final Payable:**
  $$\text{Payable} = 150,950 + 7,548 = 158,498 \text{ poisha} \quad (1,584.98 \text{ BDT})$$
  Final payable rounded half-up to whole BDT:
  $$1,584.98 \text{ BDT} \xrightarrow{\text{round half-up}} \mathbf{1,585 \text{ BDT}}$$
  *(Matches Section 9 TC-06 expected result perfectly: Subtotal 1,659.50; C2 = 150.00; VAT 75.48; Payable 1,585).*

---

### Checkpoint C2: Gemini Sales Assistant Tool Contract

Before connecting the Gemini API, we define the deterministic query tools. The LLM only chooses the tool and translates the structured result into human conversation. It never performs arithmetic on the raw dataset.

1. `getTotalOrdersCount(filterDate?: string)`
   - **Input:** Optional ISO date string `YYYY-MM-DD`.
   - **Output:** `{ count: number }`
2. `getTotalRevenue(filterDate?: string)`
   - **Input:** Optional ISO date string `YYYY-MM-DD`.
   - **Output:** `{ totalRevenueBDT: number, formatted: string }`
3. `getAverageOrderValue()`
   - **Input:** None.
   - **Output:** `{ averageOrderValueBDT: number }`
4. `getBestSellingOption()`
   - **Input:** None.
   - **Output:** `{ optionId: string, optionName: string, totalUnitsSold: number }`
5. `getRevenueByPaymentMethod()`
   - **Input:** None.
   - **Output:** `{ breakdown: Record<'card' | 'bkash' | 'cash', number> }`
6. `getOrdersWithCouponCount(couponCode: string)`
   - **Input:** `couponCode` (e.g., `'MORNING15'`).
   - **Output:** `{ totalOrdersWithCode: number, totalOrdersDiscountApplied: number }`

---

## Decision Points (D1 - D6)

### Decision Point D1: Concurrent Edits and Last Egg Conflict
**Scenario:** Tab A is editing an item when Tab B consumes the last eggs. What happens when Tab A saves?
**Decision & Implementation:**
When Tab A submits its edit, the server validates the atomic net-difference against the current live inventory. Since Tab B consumed the available eggs, Tab A's transaction is rejected with an HTTP 409 Conflict error specifying the shortage (`Short: X egg`). Crucially, Tab A's draft configuration remains intact in the editor UI; no user input is wiped out. The user is presented with a non-intrusive alert explaining that another session claimed the stock and allows them to adjust their egg count or retry.

### Decision Point D2: Promotion Price Locking Policy
**Scenario:** Promotions change while an item is in the cart (e.g., `MORNING15` cutoff at 11:00 AM). When is the price locked?
**Decision & Implementation:**
The price is evaluated dynamically against current server time and finalized strictly at **Checkout/Pay confirmation**, not when added to the cart. If a cart is assembled at 10:59:59 (TC-06) and checkout occurs after 11:00:00 (TC-07), the cart discount re-evaluates and switches from $C_2$ (expired coupon) to $C_1$ ($100$ BDT off), showing the updated payable and an informative notification before payment. Once payment is recorded, the order record permanently freezes the calculated breakdown at `order.createdAt`.

### Decision Point D3: Reservation Expiry During Active Editing
**Scenario:** A 5-minute reservation expires while the user is actively customizing the item.
**Decision & Implementation:**
The server automatically releases the held stock back to the shared pool, and the cart item transitions to `expired` (read-only). On the active editing screen, the user is warned via an alert badge that their reservation timed out. However, their custom selections are preserved in the editor so they do not lose their choices. They can click "Re-reserve & Update", which checks whether the ingredients are still available in the shared pool to create a fresh reservation.

### Decision Point D4: Order ID and Timestamp Authority & Double-Click Mitigation
**Scenario:** Who creates order ID and timestamp, and how is double-click on Pay prevented?
**Decision & Implementation:**
The server creates the authoritative order ID (`ORD-XXXX`) and the server-side timestamp (`createdAt`) to prevent client clock manipulation. To prevent duplicate orders from rapid multi-clicks, the client generates a unique `idempotencyKey` (UUIDv4) upon the initial Pay click and disables the button with a loading indicator. The mock server enforces idempotency: repeated submissions with the identical key return the existing order without creating duplicate orders or double-deducting stock.

### Decision Point D5: Hallucination Prevention ("Who is our best customer?")
**Scenario:** Staff asks about the best customer, but orders do not store customer identity.
**Decision & Implementation:**
The sales assistant is governed by strict system prompts and Gemini Function Calling boundaries. The schema exposed to Gemini clearly specifies the domain boundaries. The system prompt explicitly commands: *"If a question inquires about entities or attributes not present in the order data (e.g., customer names, addresses, ratings), state clearly that customer information is not collected in this system; never fabricate an identity."*

### Decision Point D6: Stored Order JSON Schema
**Decision & Implementation:**
Orders are stored in a schema that records both poisha and consumer-friendly BDT values. If a coupon was entered but rejected (e.g., due to the 11:00 AM time boundary), it is explicitly recorded with `couponApplied: false` and a `couponRejectionReason` string.

```json
{
  "id": "ORD-1007",
  "createdAt": "2026-11-26T11:05:00+06:00",
  "paymentMethod": "bkash",
  "coupon": {
    "code": "MORNING15",
    "applied": false,
    "discountBDT": 0,
    "rejectionReason": "Expired strictly at 11:00:00 Asia/Dhaka"
  },
  "pricing": {
    "subtotalPoisha": 165950,
    "subtotalBDT": 1659.50,
    "cartDiscountType": "C1",
    "cartDiscountPoisha": 10000,
    "cartDiscountBDT": 100.00,
    "vatPoisha": 7798,
    "vatBDT": 77.98,
    "payablePoisha": 163748,
    "payableBDT": 1637
  },
  "lines": [
    {
      "qty": 1,
      "options": { "croissant": 1, "omelette": 2, "fried": 2, "sausage": 1, "bacon": 1, "hashbrown": 1, "mushroom": 1, "hollandaise": 1 },
      "unitPriceBDT": 679.50,
      "lineTotalBDT": 679.50
    }
  ]
}
```
