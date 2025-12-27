"use client";
import Link from "next/link";
import { useRef } from "react";
import { BiSolidMinusCircle, BiSolidPlusCircle } from "react-icons/bi";
import { FaCartPlus } from "react-icons/fa6";
import { IoBagCheckOutline, IoCloseCircleSharp } from "react-icons/io5";
import { ToastContainer } from "react-toastify";
import "../../app/globals.css";
import { useCart } from "../../context/CartProvider";
import { useAuth } from "../../hooks/useAuth";
import DropdownMenu from "../molecules/DropDownMenue";
import Logo from "../atom/Logo";

const DesktopHeader = () => {
    const { cart, addToCart, removeFromCart, clearCart, subTotle } = useCart();
    const { localToken } = useAuth();

    const ref = useRef();
    const togleCart = () => {
        if (ref.current.classList.contains("translate-x-full")) {
            ref.current.classList.remove("translate-x-full");
            ref.current.classList.add("translate-x-0");
        } else if (ref.current.classList.contains("translate-x-0")) {
            ref.current.classList.remove("translate-x-0");
            ref.current.classList.add("translate-x-full");
        }
    };
    return (
        <div
            id="header"
            className="hidden  md:block header relative shadow-md w-full sticky top-0 z-50 bg-white"
            suppressHydrationWarning={true}
        >
            <ToastContainer
                position="bottom-left"
                autoClose={1000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={true}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />{" "}
            <header className="header text-gray-600 body-font ">
                <div className="containser mx-auto flex flex-wrap p-1 justify-between flex-row items-center">
                    <Logo width={100} height={50} showLink={true} />
                    <nav className="flex text-base text-gray-500 font-normal ">
                        <Link
                            href={"/uniforms"}
                            className="mr-5 hover:text-[#DD8560] text-black "
                        >
                            UNIFORMS
                        </Link>
                        <Link
                            href={"/hoodies"}
                            className="mr-5 hover:text-[#DD8560] text-black "
                        >
                            HODIES
                        </Link>
                        <Link
                            href={"/tshirts"}
                            className="mr-5 hover:text-[#DD8560] text-black "
                        >
                            T-SHIRTS
                        </Link>
                        <Link
                            href={"/mugs"}
                            className="mr-5 hover:text-[#DD8560] text-black "
                        >
                            MUGS
                        </Link>
                        <Link
                            href={"/stickers"}
                            className="mr-5 hover:text-[#DD8560] text-black "
                        >
                            Stickers
                        </Link>
                    </nav>
                    <div className="flex items-center jusitfy-center space-x-2 text-xl md:text-2xl cursor-pointer text-gray-500">
                        {localToken.value && <DropdownMenu />}
                        {!localToken.value && (
                            <Link href={"/login"}>
                                {" "}
                                <button
                                    suppressHydrationWarning={true}
                                    className="text-sm text-white bg-black hover:bg-[#DD8560] px-2 py-1 "
                                >
                                    log in
                                </button>{" "}
                            </Link>
                        )}

                        <div className="cart relative">
                            <FaCartPlus className="text-black" onClick={togleCart} />
                            {Object.keys(cart).length > 0 && (
                                <span className="absolute top-[-15px] right-[-7px] bg-[#DD8560] text-white text-[12px] h-[20px] w-[20px] flex items-center justify-center rounded-full">
                                    {Object.keys(cart).length}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </header>
            <div
                ref={ref}
                className="sidebar absolute w-[300px] h-[100vh] z-1 top-0 right-0 bg-white shadow-xl transition-transform translate-x-full p-10"
            >
                <h2 className="font-bold text-xl">Shooping Cart</h2>
                <span
                    onClick={togleCart}
                    className="text-gray-500 font-bold text-3xl absolute top-5 right-2 hover:rotate-[360deg] transition ease-in-all duration-[1s] cursor-pointer"
                >
                    {" "}
                    <IoCloseCircleSharp />{" "}
                </span>
                <ol className="list-decimal font-semibold">
                    {Object.keys(cart).length === 0 && (
                        <div className="my-4 text-[#333] text-center">
                            Your cart is empty!
                        </div>
                    )}

                    {Object.keys(cart).length !== 0 &&
                        Object.keys(cart).map((k) => {
                            const item = cart[k]; // ✅ Get item from cart using key
                            return (
                                <li key={k}>
                                    <div className="item flex">
                                        <div className="w-2/3">{item.name}</div>
                                        <div className="w-1/3 flex items-center justify-center">
                                            <BiSolidMinusCircle
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
                                                className="ml-2 text-gray-500 cursor-pointer"
                                            />
                                            {item.qty}
                                            <BiSolidPlusCircle
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
                                                className="mr-2 text-gray-500 cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                </ol>
                <div className="mt-4 ">
                    <span className="total font-bold">SubTotal: Rs.{subTotle}</span>
                </div>
                <div className="flex items-center justify-center mt-4">
                    <Link href={"/checkout"}>
                        <button
                            disabled={Object.keys(cart).length <= 0 ? true : false}
                            title={
                                Object.keys(cart).length <= 0
                                    ? "Please add some products"
                                    : "Checkout: get paid"
                            }
                            className="disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center text-white bg-gray-500 border-0 py-2 px-2 focus:outline-none hover:bg-gray-600 rounded"
                        >
                            {" "}
                            <IoBagCheckOutline className="" />{" "}
                            <span className="ml-1">Checkout</span>
                        </button>
                    </Link>
                    <button
                        onClick={clearCart}
                        disabled={Object.keys(cart).length <= 0 ? true : false}
                        title={
                            Object.keys(cart).length <= 0
                                ? "Please add some products"
                                : "clear cart"
                        }
                        className="disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center  mx-auto text-white bg-gray-500 border-0 py-2 px-2 focus:outline-none hover:bg-gray-600 rounded"
                    >
                        {" "}
                        Clear Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DesktopHeader;