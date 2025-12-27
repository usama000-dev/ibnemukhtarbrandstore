"use client";

export default function WhyChooseUs() {
    const features = [
        {
            icon: "✅",
            title: "Quality Guaranteed",
            description: "Every product quality checked before delivery"
        },
        {
            icon: "💰",
            title: "Best Prices",
            description: "Affordable prices without compromising quality"
        },
        {
            icon: "🚚",
            title: "Fast Delivery",
            description: "Quick delivery across Pakistan"
        },
        {
            icon: "🔄",
            title: "Easy Returns",
            description: "7 days hassle-free return policy"
        }
    ];

    return (
        <section className="py-8 md:py-12 bg-gray-50 px-4">
            <div className="container mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-gray-800">
                    Why Choose Ibnemukhtar?
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="text-center bg-white p-4 md:p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="text-3xl md:text-5xl mb-2 md:mb-4">
                                {feature.icon}
                            </div>
                            <h3 className="font-bold mb-1 md:mb-2 text-sm md:text-base text-gray-800">
                                {feature.title}
                            </h3>
                            <p className="text-xs md:text-sm text-gray-600">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
