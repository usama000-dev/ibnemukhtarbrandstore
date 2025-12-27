
const priceMap = {
  Poomse: {
    standard: {
      "A+": 50,
      A: 30,
      B: 24,
      C: 18,
    },
    largeSize: { // For sizes > 150
      "A+": 60,
      A: 35,
      B: 29,
      C: 24,
    }
  },
  NonPoomse: {
    standard: {
      "A+": 30,
      A: 20,
      B: 16,
      C: 10,
    },
    largeSize: { // For sizes > 150
      "A+": 40,
      A: 27,
      B: 22,
      C: 16,
    }
  },
};

const CalculatePrice = (product) => {
  if (!product || !product.category || !product.size) return 0; // Validation

  const isPoomse = product.poomseOrNot === "poomse";
  const priceTier = Number(product.size) > 150 ? 'largeSize' : 'standard';
  const categoryPrices = isPoomse ? priceMap.Poomse[priceTier] : priceMap.NonPoomse[priceTier];
  
  const category = product.category.toUpperCase();
  return categoryPrices[category] 
    ? product.size * categoryPrices[category] 
    : 0; // Default case if category is invalid
};

export default CalculatePrice;