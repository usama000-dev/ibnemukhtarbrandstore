import Image from "next/image";
import Link from "next/link";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// const slides = [
//     {
//         image: "/images/mobile-images/mobile-home-fight (2).png",
//         alt: "best image ",
//         heading: "Premium Martial Arts Gear – High-Quality Uniforms & Equipment",
//     },
//     {
//         image: "/images/mobile-images/mobile-home-fight (3).png",
//         alt: "best image ",
//         heading: "BJJ & Grappling Shirts – Lightweight & Breathable for Fighters",
//     },
//     {
//         image: "/images/mobile-images/mobile-home-fight (4).png",
//         alt: "best image ",
//         heading: "Premium Martial Arts Gear – High-Quality Uniforms & Equipment",
//     },
//     {
//         image: "/images/mobile-images/mobile-home-fight.png",
//         alt: "best image ",
//         heading: "Motivational Martial Arts Apparel – Train Hard, Fight Strong",
//     },
//     {
//         image: "/images/mobile-images/mobile-home-mugs.png",
//         alt: "best image ",
//         heading: "MMA & Karate Mugs – Perfect Gift for Martial Artists",
//     },
//     {
//         image: "/images/mobile-images/mobile-home-shirts.png",
//         alt: "best image ",
//         heading: "Martial Arts T-Shirts – Bold Designs for Fighters & Fans",
//     },
//     {
//         image: "/images/mobile-images/mobile-home.png",
//         alt: "best image ",
//         heading: "Premium Martial Arts Gear – High-Quality Uniforms & Equipment",
//     },
//     {
//         image: "/images/mobile-images/mobile-hone-pomsa.png",
//         alt: "best image ",
//         heading: "Martial Arts Gift Bundle – Shirts, Mugs & Hoodies Combo",
//     },
//     {
//         image: "/images/mobile-images/mobile-hoodies (2).png",
//         alt: "best image ",
//         heading: "Taekwondo Hoodies – Comfortable & Stylish for Training & Casual Wear",
//     },
//     {
//         image: "/images/mobile-images/mobile-hoodies.png",
//         alt: "best image ",
//         heading: "Limited Edition Taekwondo Hoodies – Exclusive Designs for True Fans",
//     },
//     {
//         image: "/images/mobile-images/mobile-shirts (2).png",
//         alt: "best image ",
//         heading: "Custom Martial Arts Shirts – Personalized for Your Dojo or Team",
//     },
//     {
//         image: "/images/mobile-images/mobile-shirts (3).png",
//         alt: "best image ",
//         heading: "Premium Martial Arts Gear – High-Quality Uniforms & Equipment",
//     },
//     {
//         image: "/images/mobile-images/mobile-shirts.png",
//         alt: "best image ",
//         heading: "Kids Martial Arts Shirts – Fun & Durable for Young Fighters",
//     },
// ];

const DesktopPageBanner = ({ slides = [], textPosition = 'left-2 bottom-12' }) => {
    return (
        <div>
            {/* Desktop Banner */}
            <div className="hidden md:block w-full overflow-hidden mt-0">
                <Swiper
                    modules={[Autoplay, Pagination]}
                    spaceBetween={0}
                    slidesPerView={1}
                    loop={true}
                    autoplay={{ delay: 4000 }}
                    pagination={{ clickable: true }}
                    className="w-full h-[280px]"
                >
                    {slides.map((slide, index) => (
                        <SwiperSlide key={index}>
                            <div className="w-full h-[250px] flex items-center justify-center bg-white overflow-hidden">
                                <Image
                                    src={slide.image}
                                    alt={slide.alt}
                                    width={600}
                                    height={250}
                                    className="object-contain w-auto h-full"
                                    priority={index === 0}
                                    quality={85}
                                    unoptimized={false}
                                />
                                <div className={`absolute ${textPosition}`}>
                                    <h1 className="text-white font-semibold mb-3 text-xl w-1/2">
                                        {slide.heading}
                                    </h1>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default DesktopPageBanner;
