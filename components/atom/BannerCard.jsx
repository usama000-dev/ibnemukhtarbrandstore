import Image from "next/image";

const BannerCard = ({
  src,
  alt,
  onClick,
  text,
  className = "",
  textClassName = "",
  textPosition = "left-2 bottom-4 md:bottom-16",
  ...props
}) => (
  <div
    className={`relative shadow-md ${className}`}
    onClick={onClick}
    {...props}
  >
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover"
      sizes="100vw"
      priority
    />
    {text && (
      <div className={`absolute  ${textPosition}`}>
        <h1 className={`text-white text-xl md:text-3xl font-semibold mb-3 ${textClassName}`}>
          {text}
        </h1>
      </div>
    )}
  </div>
);

export default BannerCard; 