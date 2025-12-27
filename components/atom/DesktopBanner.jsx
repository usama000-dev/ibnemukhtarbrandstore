import Image from "next/image";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const slides = [
  {
    image: "https://res.cloudinary.com/dwqchugmp/image/upload/v1766728182/srikanta-h-u-v0U6fwD00ns-unsplash_in4d5j.jpg",
    alt: "best fighting uniforms",
  },
  {
    image: "https://res.cloudinary.com/dwqchugmp/image/upload/v1766728170/QuillBot-generated-image-2_qxgwka.png",
    alt: "best fighting uniforms",
  },
  {
    image: "https://res.cloudinary.com/dwqchugmp/image/upload/v1766686449/download_r6qimr.jpg",
    alt: "best fighting uniforms",
  },
  {
    image: "https://res.cloudinary.com/dwqchugmp/image/upload/v1766686480/Frosty_Family_Fun_x21s1g.jpg",
    alt: "best fighting uniforms",
  },
  {
    image: "https://res.cloudinary.com/dwqchugmp/image/upload/v1766728166/LYL___Wecools_We_Choose_%E5%86%AC%E6%96%B0%E4%BD%9C%E7%B6%9A%E3%80%85%E5%85%A5%E8%8D%B7%E4%B8%AD_aojvpw.jpg",
    alt: "best fighting uniforms",
  },
];

const DesktopBanner = () => {
  return (
    <>
      {/* Desktop Banner */}
      <div className="hidden md:block w-full overflow-hidden mt-0">
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 4000 }}
          pagination={{ clickable: true }}
          className="w-full h-[250px]"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div
                className="relative w-full"
                style={{ paddingBottom: `${(207 / 1335) * 100}%` }}
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
                <div className="absolute left-2 bottom-16 ">
                  <h1 className="text-white text-3xl font-semibold mb-3 ">
                    Martial Arts Gift Bundle – Shirts, Mugs & Hoodies Combo
                  </h1>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
};

export default DesktopBanner;
