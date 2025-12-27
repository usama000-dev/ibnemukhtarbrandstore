import ProductCard from './ProductCard';

export default function UnderPriceDeals({ title = "Under $5 Deals", priceLimit = 5 }) {
  const underPriceProducts = [
    {
      id: 401,
      name: "Phone Stand Holder",
      price: 0.99,
      originalPrice: 4.99,
      sold: 125000,
      rating: 4.1,
      image: "phone-stand.jpg"
    },
    {
      id: 402,
      name: "Screen Protector (3-Pack)",
      price: 0.89,
      originalPrice: 5.99,
      sold: 89200,
      rating: 4.3,
      image: "screen-protector.jpg"
    },
    // Add more under-price products
  ].filter(product => product.price <= priceLimit);

  return (
    <section className="bg-white p-4 my-2">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold">{title}</h2>
        <button className="text-red-600 text-sm">See All →</button>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {underPriceProducts.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
            showPriceBadge={`Under $${priceLimit}`}
          />
        ))}
      </div>
    </section>
  );
}