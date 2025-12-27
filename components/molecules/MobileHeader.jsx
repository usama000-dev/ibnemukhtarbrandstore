"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CiLocationOn } from "react-icons/ci";
import { FaSquareXTwitter } from "react-icons/fa6";
import { GoPlus } from "react-icons/go";
import { HiOutlineMinusSmall, HiOutlinePhone } from "react-icons/hi2";
import { IoLogoYoutube } from "react-icons/io";
import { RiInstagramFill, RiMenu2Line } from "react-icons/ri";
import { RxCross1 } from "react-icons/rx";
import { SlHandbag } from "react-icons/sl";
import "../../app/globals.css";
import { useCart } from "../../context/CartProvider";
import { useAuth } from "../../hooks/useAuth";
import BorderSection from "../atom/BorderSection";
import HeadingStyle from "../atom/HeadingStyle";
import Logo from "../atom/Logo";
import { motion } from "framer-motion";

const Header = () => {
  const { cart, addToCart, removeFromCart, clearCart, subTotle } = useCart();
  const { localToken } = useAuth();
  const [cartProduct, setCartProduct] = useState([]);
  const [open, setOpen] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const togleSideBar = () => {
    setOpen(!open);
  };
  const togleCart = () => {
    setOpenCart(!openCart);
  };
  const handleClick = () => {
    console.log("button is clicked");
  };

  return (
    <>
      {/* Mobile Menu Sidebar */}
      <div
        className={` menue  ${
          open
            ? "w-full h-full block fixed top-0 z-50 mt-[-20px]"
            : "w-0 h-0 hidden"
        }  bg-white transition-all duration-300`}
      >
        <button
          suppressHydrationWarning={true}
          className="font-[100] text-[30px] pt-8 pl-4 text-gray-700 hover:text-[#DD8560] transition-colors"
          onClick={togleSideBar}
        >
          <RxCross1 />
        </button>
        <div>
          {/* Menu items */}
          <ul className="text-gray-700 text-xl flex flex-col gap-4 ml-[50px] mt-[20px]">
            <Link href={"/"}>
              <li className="hover:text-[#DD8560] transition-colors cursor-pointer">
                Home
              </li>
            </Link>
            <Link href={"/uniforms"}>
              <li className="hover:text-[#DD8560] transition-colors cursor-pointer">
                Uniforms
              </li>
            </Link>
            <Link href={"/tshirts"}>
              <li className="hover:text-[#DD8560] transition-colors cursor-pointer">
                T-Shirts
              </li>
            </Link>
            <Link href={"/products"}>
              <li className="hover:text-[#DD8560] transition-colors cursor-pointer">
                Products
              </li>
            </Link>
            <Link href={"/hoodies"}>
              <li className="hover:text-[#DD8560] transition-colors cursor-pointer">
                Hoodies
              </li>
            </Link>
            <Link href={"/mugs"}>
              <li className="hover:text-[#DD8560] transition-colors cursor-pointer">
                Mugs
              </li>
            </Link>
            <Link href={"/stickers"}>
              <li className="hover:text-[#DD8560] transition-colors cursor-pointer">
                Stickers
              </li>
            </Link>
            <Link href={"/contact-us"}>
              <li className="hover:text-[#DD8560] transition-colors cursor-pointer">
                Contact us
              </li>
            </Link>
            <li className="flex items-center space-x-2 text-gray-600">
              <HiOutlinePhone className="text-[#DD8560]" />
              <HeadingStyle tag="p" level="3">
                (+92) 316-4288921
              </HeadingStyle>
            </li>
            <li className="flex items-center space-x-2 text-gray-600">
              <CiLocationOn className="text-[#DD8560]" />
              <HeadingStyle tag="p" level="3">
                Chiniot, Punjab, Pakistan
              </HeadingStyle>
            </li>
          </ul>
        </div>

        <div className="flex flex-col items-center justify-center space-y-2 pt-30px">
          <BorderSection className="py-1" />
          <ul className="flex items-center justify-center space-x-8 text-[30px]">
            <li className="text-gray-700 hover:text-[#DD8560] transition-colors cursor-pointer">
              <FaSquareXTwitter />
            </li>
            <li className="text-gray-700 hover:text-[#DD8560] transition-colors cursor-pointer">
              <RiInstagramFill />
            </li>
            <li className="text-gray-700 hover:text-[#DD8560] transition-colors cursor-pointer">
              <IoLogoYoutube />
            </li>
          </ul>
        </div>
      </div>

      {/* Mobile Header */}
      <header
        className={`z-50 header block md:hidden fixed top-0 w-full bg-white flex justify-between items-center px-6 py-3 shadow-md border-b border-gray-200 ${
          open || openCart ? "hidden" : "block"
        }`}
      >
        {/* Left: Menu Icon */}
        <button
          suppressHydrationWarning={true}
          aria-label="Menu"
          className="text-2xl text-gray-700 hover:text-[#DD8560] transition-colors"
          onClick={togleSideBar}
        >
          <RiMenu2Line style={{ fontWeight: "lighter" }} />
        </button>

        {/* Center: Logo */}
        <Logo width={100} height={50} showLink={true} />

        {/* Right: Cart Icon */}
        <div className="flex space-x-4">
          <button
            suppressHydrationWarning={true}
            aria-label="Cart"
            className="relative text-2xl text-gray-700 hover:text-[#DD8560] transition-colors"
            onClick={togleCart}
          >
            <SlHandbag style={{ fontWeight: "lighter" }} />
            {Object.keys(cart).length > 0 && (
              <span className="absolute top-[-15px] right-[-7px] bg-[#DD8560] text-white text-[12px] h-[20px] w-[20px] flex items-center justify-center rounded-full">
                {Object.keys(cart).length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Cart Sidebar */}
      <div
        className={`cart ${
          openCart
            ? "w-full h-[95dvh] block fixed  top-0 z-50 mt-[-20px]"
            : "w-0 h-0 hidden"
        }  bg-white transition-all duration-300`}
      >
        <button
          suppressHydrationWarning={true}
          className="font-[100] text-[30px] pt-8 pl-4 text-gray-700 hover:text-[#DD8560] transition-colors"
          onClick={togleCart}
        >
          <RxCross1 />
        </button>
        <div className="overflow-y-auto h-[calc(95vh-250px)] px-4 pb-20">
          <h2 className="tracking-[5px] text-xl mt-2 ml-2 text-gray-900 font-semibold">
            CART
          </h2>
          {Object.keys(cart).length > 0 ? (
            Object.keys(cart).map((k) => {
              const item = cart[k]; // ✅ Get item from cart using key
              return (
                <li key={k} className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="item flex">
                    <div className="w-1/3 overflow-hidden rounded-lg">
                      <Image
                        src={`${item.imgUrl}`}
                        alt="cart image"
                        width={100}
                        height={100}
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col items-center justify-center space-y-2 ml-2">
                      <div className="w-full text-center">
                        {item.name.length <= 4 && (
                          <span className="text-gray-900 font-medium">
                            {item.name.toUpperCase()} UNIFORMS
                          </span>
                        )}
                        {!item.name.length <= 4 && (
                          <span className="text-gray-900 font-medium">
                            {item.name.toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="w-full flex items-center justify-center ml-[-20px] space-x-3">
                        <button
                          suppressHydrationWarning={true}
                          disabled={item.qty === 0 ? true : false}
                          onClick={() => {
                            removeFromCart(
                              k,
                              1,
                              item.price,
                              item.name,
                              item.variant,
                              item.size
                            );
                          }}
                          className="disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <HiOutlineMinusSmall className="p-1 text-3xl border border-gray-300 rounded-full cursor-pointer hover:border-[#DD8560] hover:text-[#DD8560] transition-colors" />
                        </button>
                        <span className="text-xl font-semibold text-gray-900">
                          {item.qty}
                        </span>
                        <button
                          suppressHydrationWarning={true}
                          disabled={item.disabled === 1 ? true : false}
                          onClick={() => {
                            addToCart(
                              k,
                              1,
                              item.price,
                              item.name,
                              item.variant,
                              item.size
                            );
                          }}
                          className="disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <GoPlus className="p-1 text-3xl border border-gray-300 rounded-full cursor-pointer hover:border-[#DD8560] hover:text-[#DD8560] transition-colors" />
                        </button>
                      </div>
                      <HeadingStyle
                        level="7"
                        tag="span"
                        className="text-[#DD8560] font-bold"
                      >
                        {" "}
                        Rs.{item.price}/_
                      </HeadingStyle>
                    </div>
                  </div>
                </li>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 mt-[25%] opacity-50">
              <BorderSection />
              <HeadingStyle tag="p" level="5" className="text-gray-600">
                You have no item in your Shopping Bag.
              </HeadingStyle>
              <BorderSection />
            </div>
          )}
        </div>
        {Object.keys(cart).length > 0 && (
          <div className="absolute bottom-12  w-[95%] pt-6 pb-10 border-gray-200 border-t-[1px] ml-2 bg-white">
            <span className="w-full flex items-center justify-between">
              <HeadingStyle level="5" tag="h2" className="text-gray-900">
                Total
              </HeadingStyle>
              <HeadingStyle
                level="7"
                tag="span"
                className="text-[#DD8560] font-bold"
              >
                {" "}
                Rs.{subTotle}/_
              </HeadingStyle>
            </span>
            <p className="pt-6 text-gray-500 text-sm">
              {" "}
              *shipping charges, taxes and discount codes are calculated at the
              time of accounting.
            </p>
          </div>
        )}
        <Link href={Object.keys(cart).length > 0 ? "/checkout" : "/products"}>
          <motion.button
            suppressHydrationWarning={true}
            onClick={() => setOpenCart(false)}
            className="shoping-btn bg-[#DD8560] hover:bg-[#c9734f] h-[56px] cursor-pointer 
    flex items-center justify-center absolute bottom-0 text-center w-full 
    text-[15px] font-medium text-white transition-colors duration-200 overflow-hidden"
            animate={{
              scale: [1, 1.05, 1],
              rotate: [-1, 1, -1, 1, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Waves Behind Button */}
            <span className="absolute inset-0 rounded-none pointer-events-none">
              <motion.span
                className="absolute inset-0 bg-white/20"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </span>

            <span className="flex items-center gap-4 relative z-10">
              <SlHandbag />
              {Object.keys(cart).length > 0 ? "BUY NOW" : "CONTINUE SHOPPING"}
            </span>
          </motion.button>
        </Link>
      </div>
    </>
  );
};

export default Header;