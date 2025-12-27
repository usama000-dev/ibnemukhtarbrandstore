import React from "react";
import { FaSquareXTwitter } from "react-icons/fa6";
import { RiInstagramFill } from "react-icons/ri";
import { IoLogoYoutube } from "react-icons/io";
import BorderSection from "../atom/BorderSection";
import HeadingStyle from "../atom/HeadingStyle";
import Link from "next/link";

function FooterSirProject() {
  return (
    <footer className="flex flex-col items-center justify-center mt-[50px] block md:hidden">
      <div className="flex items-center justify-center gap-[50px]">
        <a href="http://twiter.com" target="_blank" rel="noopener noreferrer">
          <FaSquareXTwitter className="text-[30px]" />
        </a>
        <a
          href="http://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <RiInstagramFill className="text-[30px]" />
        </a>
        <a href="http://youtube.com" target="_blank" rel="noopener noreferrer">
          <IoLogoYoutube className="text-[30px]" />
        </a>
      </div>

      <span className="w-[40%] py-[20px]">
        <BorderSection />
      </span>

      <div className="w-[50%] text-center flex flex-col items-center justify-center gap-2">
        <HeadingStyle tag="p" level="3">
          ibnemukhtarbrandstore@gmail.com
        </HeadingStyle>
        <HeadingStyle tag="p" level="3">
          +923164288921
        </HeadingStyle>
        <HeadingStyle tag="p" level="3">
          08:00 - 22:00 - Everyday
        </HeadingStyle>
      </div>
      <span className="w-[40%] py-[20px]">
        <BorderSection />
      </span>

      <div className="py-[10px]">
        <HeadingStyle tag="p" level="3">
          Copyright &copy; 2026 Ibn-e-mukhtar Brand Store&apos;S All rights reserved.
        </HeadingStyle>
      </div>
    </footer>
  );
}

export default FooterSirProject;
