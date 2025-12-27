import BannerCard from "./BannerCard";

const DesktopBannerCard = ({ src, alt, text, onClick, className = "", ...props }) => (
  <BannerCard
    src={src}
    alt={alt}
    text={text}
    onClick={onClick}
    className={`w-full h-[250px] hidden md:block ${className}`}
    {...props}
  />
);

export default DesktopBannerCard; 