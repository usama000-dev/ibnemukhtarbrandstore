"use client";

export default function CustomerTestimonials() {
    const testimonials = [
        {
            name: "Ahmed Khan",
            location: "Lahore",
            rating: 5,
            text: "Best quality jackets at amazing prices! Highly recommended.",
            image: "👨"
        },
        {
            name: "Fatima Ali",
            location: "Karachi",
            rating: 5,
            text: "Fast delivery and excellent customer service. Very satisfied!",
            image: "👩"
        },
        {
            name: "Hassan Raza",
            location: "Islamabad",
            rating: 5,
            text: "Great collection of winter shoes. Will definitely order again!",
            image: "👨"
        }
    ];

    return (
        <section className="py-8 md:py-16 bg-gradient-to-b from-blue-50 to-white px-4">
            <div className="container mx-auto">
                <div className="text-center mb-6 md:mb-12">
                    <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4 text-gray-800">
                        What Our Customers Say
                    </h2>
                    <p className="text-sm md:text-lg text-gray-600">
                        Join thousands of happy customers across Pakistan
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-4 md:gap-6">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="bg-white p-4 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-center mb-3 md:mb-4">
                                <div className="text-3xl md:text-4xl mr-3 md:mr-4">
                                    {testimonial.image}
                                </div>
                                <div>
                                    <div className="font-semibold text-sm md:text-base text-gray-800">
                                        {testimonial.name}
                                    </div>
                                    <div className="text-xs md:text-sm text-gray-500">
                                        {testimonial.location}
                                    </div>
                                </div>
                            </div>
                            <div className="flex mb-2 md:mb-3">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <span key={i} className="text-yellow-400 text-sm md:text-base">⭐</span>
                                ))}
                            </div>
                            <p className="text-xs md:text-sm text-gray-600 italic">
                                "{testimonial.text}"
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
