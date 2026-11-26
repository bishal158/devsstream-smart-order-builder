/**
 * Core Domain Types for Smart Order Builder
 * Matches Appendix A and B data specifications
 */

export type Currency = 'BDT';

// Selected options configuration: mapping optionId -> quantity
export type SelectedOptions = Record<string, number>;

export interface IngredientUsage {
  [ingredientId: string]: number;
}

export interface OptionItem {
  id: string;
  name: string;
  price: number; // in BDT
  ingredients: IngredientUsage;
}

export interface GroupLimits {
  min?: number;
  max?: number;
  step?: number;
  maxDistinct?: number;
  maxPerOption?: number;
}

export interface MenuGroup {
  id: string;
  name: string;
  limits: GroupLimits;
  options: OptionItem[];
}

export type CrossGroupRuleType = 'requires' | 'excludes' | 'overrideLimit';

export interface BaseCrossGroupRule {
  id: string;
  type: CrossGroupRuleType;
  description: string;
}

export interface RequiresRule extends BaseCrossGroupRule {
  type: 'requires';
  targetOptionId: string;
  requiredOneOf: string[];
}

export interface ExcludesRule extends BaseCrossGroupRule {
  type: 'excludes';
  targetOptionId: string;
  excludedOptions: string[];
}

export interface OverrideLimitRule extends BaseCrossGroupRule {
  type: 'overrideLimit';
  targetOptionId: string;
  targetGroupId: string;
  overrideLimits: Partial<GroupLimits>;
}

export type CrossGroupRule = RequiresRule | ExcludesRule | OverrideLimitRule;

export interface StockInventory {
  [ingredientId: string]: number;
}

export interface MenuFixture {
  productName: string;
  currency: Currency;
  basePrice: number; // in BDT
  groups: MenuGroup[];
  rules: CrossGroupRule[];
  initialStock: StockInventory;
}

export interface RuleViolation {
  id: string;
  groupId?: string;
  optionId?: string;
  message: string;
}

// Pricing calculation models (All money in integer poisha: 1 BDT = 100 poisha)
export interface UnitPriceBreakdown {
  basePricePoisha: number;
  optionsPricePoisha: number;
  grossUnitPoisha: number;
  p2ExtrasDiscountPoisha: number;
  afterP2Poisha: number;
  p1ComboDiscountPoisha: number;
  finalUnitPoisha: number;
}

export interface CartLinePricing {
  lineId: string;
  qty: number;
  options: SelectedOptions;
  unitPricing: UnitPriceBreakdown;
  lineTotalPoisha: number;
}

export interface CartPricingBreakdown {
  cartSubtotalPoisha: number;
  appliedCartDiscountType: 'C1' | 'C2' | null;
  cartDiscountPoisha: number;
  discountedSubtotalPoisha: number;
  vatPoisha: number;
  payablePoisha: number;
  payableBDT: number; // Rounded half-up to whole BDT
  lines: CartLinePricing[];
  couponStatus?: {
    enteredCode: string | null;
    applied: boolean;
    reason?: string;
  };
}

// Stored Order shape (survives refresh, D6)
export interface StoredOrderLine {
  qty: number;
  options: SelectedOptions;
  unitPriceBDT: number;
  lineTotalBDT: number;
}

export interface StoredOrder {
  id: string;
  createdAt: string; // ISO 8601 string
  paymentMethod: 'card' | 'bkash' | 'cash';
  couponCode: string | null;
  couponApplied: boolean;
  couponDiscountBDT: number;
  subtotalBDT: number;
  vatBDT: number;
  payableBDT: number;
  lines: StoredOrderLine[];
}
