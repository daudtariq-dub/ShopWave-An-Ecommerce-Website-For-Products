import { STOCK_THRESHOLDS } from './constants';

export function getStockStatus(qty) {
  if (qty === null || qty === undefined) {
    return { label: 'In Stock', color: 'green', canAdd: true, isUnknown: true };
  }
  if (qty <= STOCK_THRESHOLDS.OUT) {
    return { label: 'Out of Stock', color: 'red', canAdd: false, isUnknown: false };
  }
  if (qty <= STOCK_THRESHOLDS.LOW) {
    return { label: `Only ${qty} left`, color: 'amber', canAdd: true, isUnknown: false };
  }
  return { label: 'In Stock', color: 'green', canAdd: true, isUnknown: false };
}

export function clampQty(requested, available) {
  if (available === null || available === undefined) return requested;
  return Math.min(requested, available);
}

export function hasStockIssues(cartItems) {
  return cartItems.some(
    (item) => item.stock !== null && item.stock !== undefined && item.quantity > item.stock
  );
}
