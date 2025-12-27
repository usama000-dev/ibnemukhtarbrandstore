import { BsTree } from "react-icons/bs";
import { FaPen, FaShippingFast, FaFistRaised } from "react-icons/fa";
import BorderSection from "../atom/BorderSection";
import HeadingStyle from "../atom/HeadingStyle";
import Logo from "../atom/Logo";

function OverviewSection() {
  return (
    <div className=" py-[50px] gap-4 flex flex-col items-center justify-center text-center">
      <Logo
        width={150}
        height={70}
        showLink={true}

      />
      <div className="w-[70%]">
        <HeadingStyle tag="p" level="3">
          Empowering martial artists with premium uniforms and gear that inspire
          discipline, strength, and excellence in every training session and competition.
        </HeadingStyle>
      </div>

      <BorderSection />
      <div className="grid grid-cols-2 md:grid-cols-4 md:pt-8 px-6">
        <div className="flex flex-col items-center justify-center text-center gap-4">
          <FaFistRaised className="text-[50px] text-black" />
          <HeadingStyle tag="h2" level="3">
            Premium winter jackets for every style
          </HeadingStyle>
        </div>
        <div className="flex flex-col items-center justify-center text-center gap-4">
          <BsTree className="text-[50px] text-black" />
          <HeadingStyle tag="h2" level="3">
            Quality shoes that last longer
          </HeadingStyle>
        </div>
        <div className="flex flex-col items-center justify-center text-center gap-4">
          <FaShippingFast className="text-[50px] text-black" />
          <HeadingStyle tag="h2" level="3">
            Affordable prices for everyone
          </HeadingStyle>
        </div>
        <div className="flex flex-col items-center justify-center text-center gap-4">
          <FaPen className="text-[50px] text-black" />
          <HeadingStyle tag="h2" level="3">
            Fast delivery across Pakistan
          </HeadingStyle>
        </div>
      </div>
    </div>
  );
}

export default OverviewSection;
