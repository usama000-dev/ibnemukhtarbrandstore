"use client";
import Image from "next/image";

export default function QualityPromise() {
    return (
        <section className="py-8 md:py-16 bg-white px-4">
            <div className="container mx-auto">
                <div className="grid md:grid-cols-2 gap-6 md:gap-12 items-center">
                    {/* Image - Left on desktop, Top on mobile */}
                    <div className="order-1 md:order-1">
                        <div className="relative h-64 md:h-96 rounded-lg overflow-hidden shadow-lg">
                            <Image
                                src="https://res.cloudinary.com/dwqchugmp/image/upload/v1766728168/Gemini_Generated_Image_flew6rflew6rflew_nxacfn.png"
                                alt="Quality Winter Jackets"
                                fill
                                className="object-cover"
                                onError={(e) => {
                                    e.currentTarget.src = "/images/placeholder-jacket.jpg";
                                }}
                            />
                        </div>
                    </div>

                    {/* Content - Right on desktop, Bottom on mobile */}
                    <div className="order-2 md:order-2">
                        <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 text-gray-800">
                            Quality You Can Trust
                        </h2>
                        <p className="text-sm md:text-lg text-gray-600 mb-4 md:mb-6 leading-relaxed">
                            Every jacket and shoe in our collection is carefully selected and quality-checked
                            before reaching you. We believe in providing products that last, keeping you warm
                            and stylish season after season.
                        </p>
                        <ul className="space-y-3 md:space-y-4">
                            <li className="flex items-start">
                                <span className="text-green-600 mr-3 text-xl md:text-2xl">✓</span>
                                <span className="text-sm md:text-base text-gray-700">Premium materials for durability</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-600 mr-3 text-xl md:text-2xl">✓</span>
                                <span className="text-sm md:text-base text-gray-700">Quality inspection before delivery</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-600 mr-3 text-xl md:text-2xl">✓</span>
                                <span className="text-sm md:text-base text-gray-700">Satisfaction guaranteed</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
