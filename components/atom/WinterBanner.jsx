"use client";

export default function WinterBanner() {
    return (
        <section
            className="relative bg-cover bg-center bg-no-repeat text-white py-12 md:py-20 px-4"
            style={{ backgroundImage: "url('https://res.cloudinary.com/dwqchugmp/image/upload/v1766728182/srikanta-h-u-v0U6fwD00ns-unsplash_in4d5j.jpg')" }}
        >
            <div className="absolute inset-0 bg-blue-900/50"></div>
            <div className="container mx-auto text-center relative z-10">
                <div className="text-4xl md:text-6xl mb-4">❄️</div>
                <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">
                    Winter Collection 2025
                </h2>
                <p className="text-lg md:text-xl mb-2 md:mb-3">
                    Stay Warm, Look Stylish!
                </p>
                <p className="text-sm md:text-base mb-6 md:mb-8 opacity-90">
                    Premium Jackets & Shoes for the Whole Family
                </p>
                <a
                    href="/products"
                    className="inline-block bg-white text-blue-900 px-6 md:px-8 py-2 md:py-3 rounded-full font-bold hover:bg-gray-100 transition-all shadow-lg text-sm md:text-base"
                >
                    Shop Now →
                </a>
            </div>
        </section>
    );
}
