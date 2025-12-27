import BannerCard from "./BannerCard";

const MobileBannerCard = ({ src, alt, text, textPosition,  onClick, className = "", ...props }) => (
  <BannerCard
    src={src}
    alt={alt}
    text={text}
    onClick={onClick}
    className={`w-full h-[180px] md:hidden ${className}`}
    textPosition={textPosition}
    {...props}
  />
);

export default MobileBannerCard; 