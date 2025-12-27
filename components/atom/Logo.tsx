import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
  linkTo?: string;
  showLink?: boolean;
}

const Logo = ({
  width = 100,
  height = 60,
  className = "object-center",
  linkTo = "/",
  showLink = true
}: LogoProps) => {
  const LogoImage = (
    <Image
      src="https://res.cloudinary.com/dwqchugmp/image/upload/v1766686346/Ibn_e_mukhtar_icon_1_ty5igm.png"
      alt="Ibnemukhtar Logo"
      width={width}
      height={height}
      className={className}
      priority
    />
  );

  if (showLink) {
    return (
      <Link href={linkTo} className="inline-block">
        {LogoImage}
      </Link>
    );
  }

  return LogoImage;
};

export default Logo; 