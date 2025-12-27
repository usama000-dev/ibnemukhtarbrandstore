import { Coupon } from "@/models/Coupon";

export async function validateCoupon(couponCode, cartItems) {
  const coupon = await Coupon.findOne({
    code: couponCode.toUpperCase(),
    isActive: true,
    validFrom: { $lte: new Date() },
    validUntil: { $gte: new Date() }
  });

  if (!coupon) return { valid: false, message: 'Invalid coupon' };

  // Check if coupon applies to any cart item
  let applicableItems = [];

  if (coupon.applyTo === 'all') {
    applicableItems = cartItems;
  }
  else if (coupon.applyTo === 'products') {
    applicableItems = cartItems.filter(item =>
      coupon.products.includes(item.productId) && item.type === 'product'
    );
  }

  if (applicableItems.length === 0) {
    return { valid: false, message: 'Coupon not applicable to any cart items' };
  }

  // Calculate discount
  const subtotal = applicableItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (subtotal < coupon.minOrderAmount) {
    return {
      valid: false,
      message: `Minimum order amount of $${coupon.minOrderAmount} required`
    };
  }

  // Calculate discount amount
  let discountAmount = 0;

  if (coupon.discountType === 'percentage') {
    discountAmount = subtotal * (coupon.discountValue / 100);
  }
  else if (coupon.discountType === 'fixed') {
    discountAmount = Math.min(coupon.discountValue, subtotal);
  }
  else if (coupon.discountType === 'freeShipping') {
    // Handle free shipping logic
  }

  return {
    valid: true,
    discountAmount,
    couponType: coupon.discountType,
    applicableItems
  };
}