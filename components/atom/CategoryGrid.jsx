import { useCategory } from "@/hooks/useCategory";
import { getOptimizedCloudinaryUrl } from "@/services/api";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CategoryGrid() {
  const { allCategory } = useCategory();
  const router = useRouter();

  const handleCategoryClick = (category) => {
    router.push(`/products?category=${encodeURIComponent(category.name)}`);
  };

  return (
    <section className="bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-2xl shadow-lg p-6 my-6">
      <h2 className="text-2xl font-extrabold mb-6 text-gray-800 text-center tracking-tight drop-shadow-sm">
        Shop by Category
      </h2>

      {/* Mobile: Horizontal scroll */}
      <div
        className="flex sm:hidden gap-4 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide scroll-smooth"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {allCategory.map((category, index) => (
          <div
            key={index}
            className="group relative flex-shrink-0 flex flex-col items-center cursor-pointer rounded-xl bg-white shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-400 p-4 overflow-hidden min-h-[140px] w-32"
            onClick={() => handleCategoryClick(category)}
          >
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-gray-100 to-gray-200 flex items-center justify-center text-2xl overflow-hidden border-2 border-gray-200 group-hover:border-blue-400 transition-all shadow-sm">
              {category.image ? (
                <Image
                  src={getOptimizedCloudinaryUrl(category.image)}
                  alt={category.name}
                  width={56}
                  height={56}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <span className="text-lg text-gray-500 font-bold">
                  {category.name[0]}
                </span>
              )}
            </div>
            <span className="text-xs text-center mt-2 font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
              {category.name}
            </span>
          </div>
        ))}
      </div>

      {/* Desktop: Grid */}
      <div className="hidden sm:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {allCategory.map((category, index) => (
          <div
            key={index}
            className="group relative flex flex-col items-center cursor-pointer rounded-xl bg-white shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-400 p-4 overflow-hidden min-h-[160px]"
            onClick={() => handleCategoryClick(category)}
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-gray-100 to-gray-200 flex items-center justify-center text-2xl overflow-hidden border-2 border-gray-200 group-hover:border-blue-400 transition-all shadow-sm">
              {category.image ? (
                <Image
                  src={getOptimizedCloudinaryUrl(category.image)}
                  alt={category.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <span className="text-lg text-gray-500 font-bold">
                  {category.name[0]}
                </span>
              )}
            </div>
            <span className="text-sm text-center mt-3 font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
              {category.name}
            </span>
          </div>
        ))}
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-3 gap-3 mt-8 text-center w-full">
        <div className="bg-blue-100 rounded-xl p-4 sm:p-6 shadow flex flex-col items-center">
          <div className="text-xl sm:text-3xl font-extrabold text-blue-700 mb-1">1000+</div>
          <div className="text-xs sm:text-base text-gray-700 font-medium">Happy Customers</div>
        </div>
        <div className="bg-green-100 rounded-xl p-4 sm:p-6 shadow flex flex-col items-center">
          <div className="text-xl sm:text-3xl font-extrabold text-green-700 mb-1">4.9★</div>
          <div className="text-xs sm:text-base text-gray-700 font-medium">Average Rating</div>
        </div>
        <div className="bg-purple-100 rounded-xl p-4 sm:p-6 shadow flex flex-col items-center">
          <div className="text-xl sm:text-3xl font-extrabold text-purple-700 mb-1">10,000+</div>
          <div className="text-xs sm:text-base text-gray-700 font-medium">Products Sold</div>
        </div>
      </div>
    </section>
  );
}
