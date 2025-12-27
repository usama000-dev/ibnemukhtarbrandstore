import React from "react";
import { SlSocialInstagram } from "react-icons/sl";
import HeadingStyle from "../atom/HeadingStyle";
import Image from "next/image";

function FollowUs() {
  return (
    <div className="flex flex-col items-center justify-center px-6 gap-6 py-8 ">
      <HeadingStyle tag="h2" level="2">
        FOLLOW US
      </HeadingStyle>
      <SlSocialInstagram className="text-[30px] font-[100]" />
     <div className="grid grid-cols-2 gap-4">
     <div className="relative">
        <Image
          src={"/assets/images/Rectangle 332.png"}
          width={400}
          height={400}
          alt="image from footer"
        />
        <span className="absolute bottom-2 left-4">
          <HeadingStyle level="16" tag="span" text={"white"}>
            {" "}
            @_jihyn
          </HeadingStyle>
        </span>
      </div>
      <div className="relative">
        <Image
          src={"/assets/images/Rectangle 332.png"}
          width={400}
          height={400}
          alt="image from footer"
        />
        <span className="absolute bottom-2 left-4">
          <HeadingStyle level="16" tag="span" text={"white"}>
            {" "}
            @_jihyn
          </HeadingStyle>
        </span>
      </div>
      <div className="relative">
        <Image
          src={"/assets/images/Rectangle 332.png"}
          width={400}
          height={400}
          alt="image from footer"
        />
        <span className="absolute bottom-2 left-4">
          <HeadingStyle level="16" tag="span" text={"white"}>
            {" "}
            @_jihyn
          </HeadingStyle>
        </span>
      </div>
      <div className="relative">
        <Image
          src={"/assets/images/Rectangle 332.png"}
          width={400}
          height={400}
          alt="image from footer"
        />
        <span className="absolute bottom-2 left-4">
          <HeadingStyle level="16" tag="span" text={"white"}>
            {" "}
            @_jihyn
          </HeadingStyle>
        </span>
      </div>
     </div>
    </div>
  );
}

export default FollowUs;
