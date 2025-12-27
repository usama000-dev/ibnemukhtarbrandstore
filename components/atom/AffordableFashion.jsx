"use client";
import Image from "next/image";

export default function AffordableFashion() {
    return (
        <section className="py-8 md:py-16 bg-gray-50 px-4">
            <div className="container mx-auto">
                <div className="grid md:grid-cols-2 gap-6 md:gap-12 items-center">
                    {/* Content - Left on desktop, Top on mobile */}
                    <div className="order-2 md:order-1">
                        <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 text-gray-800">
                            Style Meets Affordability
                        </h2>
                        <p className="text-sm md:text-lg text-gray-600 mb-4 md:mb-6 leading-relaxed">
                            Looking good doesn't have to be expensive. We bring you the latest winter fashion
                            trends at prices that won't break your budget. Quality winter wear for everyone
                            in the family.
                        </p>
                        <div className="grid grid-cols-2 gap-4 md:gap-6">
                            <div className="text-center p-3 md:p-4 bg-white rounded-lg shadow-sm">
                                <div className="text-xl md:text-3xl font-bold text-blue-600 mb-1 md:mb-2">50%</div>
                                <div className="text-xs md:text-sm text-gray-600">Less Than Market</div>
                            </div>
                            <div className="text-center p-3 md:p-4 bg-white rounded-lg shadow-sm">
                                <div className="text-xl md:text-3xl font-bold text-green-600 mb-1 md:mb-2">100%</div>
                                <div className="text-xs md:text-sm text-gray-600">Value for Money</div>
                            </div>
                        </div>
                    </div>

                    {/* Image - Right on desktop, Bottom on mobile */}
                    <div className="order-1 md:order-2">
                        <div className="relative h-64 md:h-96 rounded-lg overflow-hidden shadow-lg">
                            <Image
                                src="https://res.cloudinary.com/dwqchugmp/image/upload/v1766728169/Gemini_Generated_Image_o9l4mto9l4mto9l4_e1b7xe.png"
                                alt="Affordable Winter Fashion"
                                fill
                                className="object-cover"
                                onError={(e) => {
                                    e.currentTarget.src = "/images/placeholder-fashion.jpg";
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
