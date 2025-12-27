const deliveryRates = [
  { weight: 1, price: 195 },
  { weight: 2, price: 245 },
  { weight: 3, price: 295 },
  { weight: 5, price: 395 },
  { weight: 10, price: 695 },
  { weight: 15, price: 895 },
  { weight: 20, price: 1095 },
  { weight: 25, price: 1195 },
  { weight: 30, price: 1395 },
];

const methodChargesMap = {
  store: () => 0,

  "post-office": (totalWeight) => {
    let selectedRate = deliveryRates.find(rate => rate.weight >= totalWeight);
    if (!selectedRate) {
      const extraKg = Math.ceil(totalWeight - 30);
      selectedRate = { price: 1395 + extraKg * 100 };
    }
    return selectedRate.price + 100; // + hidden packing charges
  },

  express: (totalWeight) => {
    const base = 500;
    const perKg = 150;
    return base + Math.ceil(totalWeight) * perKg;
  },
};

const calculateTotalWeight = (cart) => {
  let totalWeight = 0;
  for (let key in cart) {
    const item = cart[key];
    const qty = item.qty || 1;
    const weightPerUnit = item.weight || 0.8; // Default 0.8 KG
    totalWeight += qty * weightPerUnit;
  }
  return totalWeight;
};

const calculateDeliveryCharges = (cart, method = "post-office") => {
  const methodFunc = methodChargesMap[method];

  if (!methodFunc) {
    console.warn(`Delivery method "${method}" not found. Using post-office as default.`);
    return methodChargesMap["post-office"](calculateTotalWeight(cart));
  }

  const totalWeight = calculateTotalWeight(cart);
  return methodFunc(totalWeight);
};

export default calculateDeliveryCharges;
