"use client";
import Image from "next/image";

export default function FastDelivery() {
    return (
        <section className="py-8 md:py-16 bg-white px-4">
            <div className="container mx-auto">
                <div className="grid md:grid-cols-2 gap-6 md:gap-12 items-center">
                    {/* Image - Left on desktop, Top on mobile */}
                    <div className="order-1 md:order-1">
                        <div className="relative h-64 md:h-96 rounded-lg overflow-hidden shadow-lg">
                            <Image
                                src="https://res.cloudinary.com/dwqchugmp/image/upload/v1766743348/Gemini_Generated_Image_i8ycwli8ycwli8yc_brk1p9.png"
                                alt="Fast Delivery Service"
                                fill
                                className="object-cover"
                                onError={(e) => {
                                    e.currentTarget.src = "/images/placeholder-delivery.jpg";
                                }}
                            />
                        </div>
                    </div>

                    {/* Content - Right on desktop, Bottom on mobile */}
                    <div className="order-2 md:order-2">
                        <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 text-gray-800">
                            Delivered to Your Doorstep
                        </h2>
                        <p className="text-sm md:text-lg text-gray-600 mb-4 md:mb-6 leading-relaxed">
                            We understand you need your winter wear quickly. That's why we offer fast
                            and reliable delivery across Pakistan. Order today, wear tomorrow!
                        </p>
                        <div className="space-y-3 md:space-y-4">
                            <div className="flex items-center p-3 md:p-4 bg-blue-50 rounded-lg">
                                <div className="text-2xl md:text-3xl mr-3 md:mr-4">🚚</div>
                                <div>
                                    <div className="font-semibold text-sm md:text-base text-gray-800">Free Delivery</div>
                                    <div className="text-xs md:text-sm text-gray-600">On orders above Rs. 3000</div>
                                </div>
                            </div>
                            <div className="flex items-center p-3 md:p-4 bg-green-50 rounded-lg">
                                <div className="text-2xl md:text-3xl mr-3 md:mr-4">⚡</div>
                                <div>
                                    <div className="font-semibold text-sm md:text-base text-gray-800">Fast Shipping</div>
                                    <div className="text-xs md:text-sm text-gray-600">1-3 days in major cities</div>
                                </div>
                            </div>
                            <div className="flex items-center p-3 md:p-4 bg-orange-50 rounded-lg">
                                <div className="text-2xl md:text-3xl mr-3 md:mr-4">📦</div>
                                <div>
                                    <div className="font-semibold text-sm md:text-base text-gray-800">Track Your Order</div>
                                    <div className="text-xs md:text-sm text-gray-600">Real-time tracking available</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
