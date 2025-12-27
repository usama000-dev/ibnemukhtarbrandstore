"use client";

export default function TrustBadges() {
    return (
        <section className="py-6 md:py-8 bg-white px-4">
            <div className="container mx-auto">
                <div className="grid grid-cols-3 gap-3 md:gap-6 text-center">
                    <div className="p-3 md:p-4">
                        <div className="text-2xl md:text-4xl font-bold text-blue-600 mb-1 md:mb-2">
                            500+
                        </div>
                        <div className="text-xs md:text-sm text-gray-600">
                            Winter Items
                        </div>
                    </div>
                    <div className="p-3 md:p-4">
                        <div className="text-2xl md:text-4xl font-bold text-green-600 mb-1 md:mb-2">
                            5K+
                        </div>
                        <div className="text-xs md:text-sm text-gray-600">
                            Happy Customers
                        </div>
                    </div>
                    <div className="p-3 md:p-4">
                        <div className="text-2xl md:text-4xl font-bold text-orange-600 mb-1 md:mb-2">
                            2K+
                        </div>
                        <div className="text-xs md:text-sm text-gray-600">
                            Products Sold
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
