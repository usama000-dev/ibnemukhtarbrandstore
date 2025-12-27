import Image from "next/image";
import Link from "next/link";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const slides = [
  {
    image: "https://res.cloudinary.com/dwqchugmp/image/upload/v1766728182/srikanta-h-u-v0U6fwD00ns-unsplash_in4d5j.jpg",
    alt: "best image ",
    heading: "Premium Martial Arts Gear – High-Quality Uniforms & Equipment",
  },
  {
    image: "https://res.cloudinary.com/dwqchugmp/image/upload/v1766728170/QuillBot-generated-image-2_qxgwka.png",
    alt: "best image ",
    heading: "BJJ & Grappling Shirts – Lightweight & Breathable for Fighters",
  },
  {
    image: "https://res.cloudinary.com/dwqchugmp/image/upload/v1766686449/download_r6qimr.jpg",
    alt: "best image ",
    heading: "Premium Martial Arts Gear – High-Quality Uniforms & Equipment",
  },
  {
    image: "https://res.cloudinary.com/dwqchugmp/image/upload/v1766686480/Frosty_Family_Fun_x21s1g.jpg",
    alt: "best image ",
    heading: "Motivational Martial Arts Apparel – Train Hard, Fight Strong",
  },
  {
    image: "https://res.cloudinary.com/dwqchugmp/image/upload/v1766728166/LYL___Wecools_We_Choose_%E5%86%AC%E6%96%B0%E4%BD%9C%E7%B6%9A%E3%80%85%E5%85%A5%E8%8D%B7%E4%B8%AD_aojvpw.jpg",
    alt: "best image ",
    heading: "MMA & Karate Mugs – Perfect Gift for Martial Artists",
  },
  {
    image: "https://res.cloudinary.com/dwqchugmp/image/upload/v1766743347/download_cwl1zg.jpg",
    alt: "best image ",
    heading: "MMA & Karate Mugs – Perfect Gift for Martial Artists",
  },
];

const MobileBanner = () => {
  return (
    <div>
      {" "}
      {/* Mobile Banner */}
      <div className="block md:hidden w-full overflow-hidden pt-14">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={10}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 4000 }}
          // pagination={{ clickable: true }}
          className="w-full h-64"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div
                className="relative w-full"
                style={{ paddingBottom: `${(300 / 600) * 100}%` }}
              >
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority={index === 0}
                  quality={85}
                  unoptimized={false} // Let Next.js optimize these large banners
                />
                {/* <div className="absolute left-2 bottom-12 ">
                  <h1 className="text-white font-semibold mb-3 text-xl w-1/2">
                    {slide.heading}
                  </h1>
                  <Link href={"#"} className="text-white font-[100] bg-black py-2 px-4">
                    COLLECTION
                  </Link>
                </div> */}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default MobileBanner;
