export default function PopularCategories() {
    const popularCategories = [
      { id: 1, name: "Smart Home", icon: "🏠", items: "1.2M+" },
      { id: 2, name: "Beauty", icon: "💄", items: "850K+" },
      { id: 3, name: "Toys", icon: "🧸", items: "2.3M+" },
      { id: 4, name: "Fashion", icon: "👗", items: "5.7M+" },
      { id: 5, name: "Garden", icon: "🌻", items: "620K+" },
      { id: 6, name: "Pet Supplies", icon: "🐕", items: "1.1M+" },
      { id: 7, name: "Kitchen", icon: "🍳", items: "3.4M+" },
      { id: 8, name: "Sports", icon: "⚽", items: "980K+" }
    ];
  
    return (
      <section className="bg-white p-4 my-2">
        <h2 className="text-lg font-bold mb-3">Popular Categories</h2>
        <div className="grid grid-cols-4 gap-4">
          {popularCategories.map(category => (
            <div key={category.id} className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-2xl mb-1">
                {category.icon}
              </div>
              <span className="text-xs text-center font-medium">{category.name}</span>
              <span className="text-xs text-gray-500">{category.items}</span>
            </div>
          ))}
        </div>
      </section>
    );
  }