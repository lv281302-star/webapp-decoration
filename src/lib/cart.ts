import { Cart, CartItem, ShippingInfo } from './types';

const CART_STORAGE_KEY = 'decoration-room-cart';
const COUPON_STORAGE_KEY = 'decoration-room-coupon-used';

// Valid coupon code
export const FIRST_PURCHASE_COUPON = 'PRIMEIRA10';
export const COUPON_DISCOUNT = 0.10; // 10%

// Get cart from localStorage
export const getCart = (): Cart => {
  if (typeof window === 'undefined') return { items: [], couponApplied: false };
  
  const stored = localStorage.getItem(CART_STORAGE_KEY);
  if (!stored) return { items: [], couponApplied: false };
  
  try {
    return JSON.parse(stored);
  } catch {
    return { items: [], couponApplied: false };
  }
};

// Save cart to localStorage
export const saveCart = (cart: Cart): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
};

// Check if coupon was already used
export const wasCouponUsed = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(COUPON_STORAGE_KEY) === 'true';
};

// Mark coupon as used
export const markCouponAsUsed = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(COUPON_STORAGE_KEY, 'true');
};

// Calculate cart subtotal
export const calculateSubtotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
};

// Calculate discount
export const calculateDiscount = (subtotal: number, couponApplied: boolean): number => {
  return couponApplied ? subtotal * COUPON_DISCOUNT : 0;
};

// Calculate shipping based on CEP
export const calculateShipping = (cep: string): ShippingInfo | null => {
  // Remove non-numeric characters
  const cleanCep = cep.replace(/\D/g, '');
  
  if (cleanCep.length !== 8) return null;
  
  // Simulate shipping calculation based on CEP region
  const region = parseInt(cleanCep.substring(0, 2));
  
  let cost = 0;
  let estimatedDays = 0;
  
  // São Paulo region (01-19)
  if (region >= 1 && region <= 19) {
    cost = 29.90;
    estimatedDays = 3;
  }
  // Rio de Janeiro region (20-28)
  else if (region >= 20 && region <= 28) {
    cost = 35.90;
    estimatedDays = 5;
  }
  // South region (80-99)
  else if (region >= 80 && region <= 99) {
    cost = 45.90;
    estimatedDays = 7;
  }
  // Northeast region (40-65)
  else if (region >= 40 && region <= 65) {
    cost = 55.90;
    estimatedDays = 10;
  }
  // Other regions
  else {
    cost = 39.90;
    estimatedDays = 6;
  }
  
  return {
    cep: cleanCep,
    cost,
    estimatedDays,
  };
};

// Calculate total
export const calculateTotal = (
  subtotal: number,
  discount: number,
  shipping: number
): number => {
  return subtotal - discount + shipping;
};
