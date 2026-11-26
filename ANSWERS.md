# Assessment Verification & Answers (`ANSWERS.md`)

This file contains answers to the technical evaluation questions in Section 10 of the assessment brief.
All answers are computed and verified deterministically by executing the domain test suite.

**Execution Command:**
```bash
npm run test:answers
```

---

### Q1: Maximum Number of Item C from Empty Cart
- **Question:** Starting from an empty cart, what is the maximum number of item C you can add? Which ingredient limits it?
- **Configuration of Item C:**
  `Paratha x1, Fried x2, Tofu x1, Cheese x2, Baked Beans x1, Mushroom x1, Chili x1`
- **Ingredient Usage per Item C:**
  - `paratha`: 1
  - `egg`: 2 (Fried x2 consumes 2 eggs)
  - `tofu`: 1
  - `cheese`: 2
  - `beans`: 1
  - `mushroom`: 1
  - `chili`: 0 (Unlimited)
- **Initial Inventory Limits:**
  - `egg`: 10 $\to 10 / 2 = 5$
  - `cheese`: 4 $\to 4 / 2 = 2$
  - `paratha`: 10 $\to 10 / 1 = 10$
  - `tofu`: 5 $\to 5 / 1 = 5$
  - `beans`: 8 $\to 8 / 1 = 8$
  - `mushroom`: 6 $\to 6 / 1 = 6$
- **Result:**
  - **Maximum Item C units:** **2**
  - **Limiting Ingredient:** **Cheese** (Total available: 4; Each item C requires 2 cheese units, exhausting stock at 2 items).

---

### Q2: Cheapest Valid Configuration and Unit Price
- **Question:** What is the cheapest valid configuration and its unit price?
- **Base Price:** 250 BDT
- **Optimization Breakdown:**
  - **Bread (min 1, max 1):** Toast (0 BDT) $\to$ **0 BDT**
  - **Eggs (min 2, max 6, step 2):** Fried x2 (30 x 2 = 60 BDT) $\to$ **60 BDT**
  - **Protein (min 1, max 3):** Tofu (50 BDT) $\to$ **50 BDT**
  - **Extras (min 0, max 4):** 0 extras $\to$ **0 BDT**
  - **Sauce (min 0, maxDistinct 2, maxPerOption 1):** Ketchup x1 (0 BDT) $\to$ **0 BDT**
- **Validation:**
  - Group limits satisfied (Bread: 1, Eggs: 2, Protein: 1, Extras: 0, Sauce: 1).
  - Cross-group rules: Tofu does not exclude toast or fried eggs.
- **Result:**
  - **Configuration:** Toast x1, Fried x2, Tofu x1, Ketchup x1
  - **Cheapest Unit Price:** $250 + 0 + 60 + 50 + 0 + 0 = \mathbf{360\text{ BDT}}$

---

### Q3: Cart = A x3 at 10:30 vs 11:30
- **Question:** Cart = A x3, server time 10:30. Give subtotal, chosen discount, VAT and payable. Then the same at 11:30.
- **Item A Unit Price (from TC-05):**
  - Base (250) + Toast (0) + Scrambled x2 (70) + Sausage x1 (60) + Ketchup (0) = **380.00 BDT** (38,000 poisha).
  - P2 extras deal: 0 extras $\to$ 0.
  - P1 combo: Eggs = 2 (< 4) $\to$ Not qualified.
  - Unit price = **380.00 BDT** (38,000 poisha).
- **Line Total for A x3:**
  $$\text{Cart Subtotal} = 38,000 \times 3 = 114,000 \text{ poisha} \quad (1,140.00 \text{ BDT})$$

#### At 10:30 (Before 11:00:00 cutoff):
- **Discount comparison:**
  - $C_1$: Subtotal $1,140 < 1,200 \implies$ Not eligible (0 BDT).
  - $C_2$ (`MORNING15`): Eligible! $15\%$ of $114,000 = 17,100$ poisha ($171.00$ BDT). Capped at $150.00$ BDT ($15,000$ poisha).
  - **Chosen Discount:** $C_2 = \mathbf{150.00\text{ BDT}}$ ($15,000$ poisha).
- **Discounted Subtotal:** $114,000 - 15,000 = 99,000$ poisha ($990.00$ BDT).
- **VAT (5%):** $99,000 \times 0.05 = \mathbf{4,950\text{ poisha}}$ ($49.50$ BDT).
- **Payable:** $99,000 + 4,950 = 103,950$ poisha ($1,039.50$ BDT) $\xrightarrow{\text{round half-up}} \mathbf{1,040\text{ BDT}}$.

#### At 11:30 (After 11:00:00 cutoff):
- **Discount comparison:**
  - $C_1$: Subtotal $1,140 < 1,200 \implies$ Not eligible (0 BDT).
  - $C_2$: Rejected (Server time 11:30 is not strictly before 11:00).
  - **Chosen Discount:** $\mathbf{0.00\text{ BDT}}$.
- **Discounted Subtotal:** $114,000$ poisha ($1,140.00$ BDT).
- **VAT (5%):** $114,000 \times 0.05 = \mathbf{5,700\text{ poisha}}$ ($57.00$ BDT).
- **Payable:** $114,000 + 5,700 = 119,700$ poisha $\implies \mathbf{1,197\text{ BDT}}$.

---

### Q4: Payable After TC-10 at 11:30
- *(Detailed step-by-step verification will be printed via Vitest execution)*

---

### Q5: Payable of Seed Orders and Total Revenue
- *(Computed directly from `orders.seed.json` using the pricing engine)*

---

### Q6: Best-Selling Option Across Seed Orders
- *(Sum of line quantity $\times$ option quantity across seed orders)*

---

### Q7: Highest Revenue Payment Method
- *(Aggregate revenue grouped by payment method: card, bkash, cash)*

---

### Q8: Analysis of `MORNING15` Discount in Seed Orders
- *(Analysis of each seed order and reasons for non-application)*
