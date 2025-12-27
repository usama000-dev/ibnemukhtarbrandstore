"use client";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AiOutlineProduct } from "react-icons/ai";
import { BiMessageRounded } from "react-icons/bi";
import { CgHomeAlt } from "react-icons/cg";
import { FiSearch, FiShoppingBag } from "react-icons/fi";
import { MdSpaceDashboard } from "react-icons/md";
import { FiUser } from "react-icons/fi";
import { LuShirt } from "react-icons/lu";
import { IconList } from "@tabler/icons-react";
import { GiShorts } from 'react-icons/gi';
import SmartDisplayOutlinedIcon from '@mui/icons-material/SmartDisplayOutlined';


const MobileFooter = () => {
  const router = useRouter(); // router define
  const pathname = usePathname();
  const { isAdmin } = useAuth();
  const isActive = (path) => pathname === path;

  const handleHover = (path) => {
    router.prefetch(`${path}`);
  };

  return (
    <div className=" fixed bottom-0 bg-white block md:hidden flex items-center justify-between px-3 w-full border-t z-50">
      <Link onMouseEnter={() => handleHover("/")} title="Home" href="/">
        <button
          suppressHydrationWarning={true}
          className="text-center flex flex-col items-center justify-center relative"
        >
          {isActive("/") && (
            <span className="absolute top-0 w-[40px] h-1 bg-[#DD8560]"></span>
          )}
          <CgHomeAlt
            className={`text-3xl pt-1 rounded-lg transition ease-in-out`}
          />
          <span
            className={`text-[7px] text-black
           `}
          >
            Home
          </span>
        </button>
      </Link>

      <Link
        onMouseEnter={() => handleHover("/products")}
        title="All Products"
        href="/products"
      >
        <button
          suppressHydrationWarning={true}
          className="text-center flex flex-col items-center justify-center relative"
        >
          {isActive("/products") && (
            <span className="absolute top-0 w-[40px] h-1 bg-[#DD8560]"></span>
          )}

          <AiOutlineProduct
            className={`text-3xl pt-1 rounded-lg transition ease-in-out`}
          />
          <span className={`text-[7px] `}>Products</span>
        </button>
      </Link>
      <Link
        onMouseEnter={() => handleHover("/search")}
        title="Search..."
        href="/search"
      >
        <button
          suppressHydrationWarning={true}
          className="text-center flex flex-col items-center justify-center relative"
        >
          {isActive("/search") && (
            <span className="absolute top-0 w-[40px] h-1 bg-[#DD8560]"></span>
          )}
          <FiSearch
            className={`text-3xl pt-1 text-black rounded-lg transition ease-in-out`}
          />
          <span className={`text-[7px] text-black `}>Search</span>
        </button>
      </Link>
      <Link href="/stream" className={`flex flex-col items-center ${isActive('/stream') ? 'text-red-600' : 'text-gray-500'}`}>
        <div className="relative">
          <SmartDisplayOutlinedIcon size={24} className={isActive('/stream') ? 'animate-pulse' : ''} />
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
        </div>
        <span className="text-[7px] text-black">Shorts</span>
      </Link>
      <Link
        onMouseEnter={() => handleHover("/orders")}
        title="Orders"
        href="/orders"
      >
        <button
          suppressHydrationWarning={true}
          className="text-center flex flex-col items-center justify-center relative"
        >
          {isActive("/orders") && (
            <span className="absolute top-0 w-[40px] h-1 bg-[#DD8560]"></span>
          )}{" "}
          <FiShoppingBag
            className={`text-3xl pt-1 text-black rounded-lg transition ease-in-out`}
          />
          <span className={`text-[7px] text-black `}>Orders</span>
        </button>
      </Link>

      {isAdmin === true && (
        <Link
          onMouseEnter={() => handleHover("/admin")}
          title="Admin Pannel"
          href="/admin"
        >
          <button
            suppressHydrationWarning={true}
            className="text-center flex flex-col items-center justify-center relative"
          >
            {isActive("/admin") && (
              <span className="absolute top-0 w-[40px] h-1 bg-[#DD8560]"></span>
            )}{" "}
            <MdSpaceDashboard
              className={`text-3xl pt-1 text-black rounded-lg transition ease-in-out`}
            />
            <span className={`text-[7px] text-black`}>Admin</span>
          </button>
        </Link>
      )}
      <Link
        onMouseEnter={() => handleHover("/myaccount")}
        title="My Account"
        href="/myaccount"
      >
        <button
          suppressHydrationWarning={true}
          className="text-center flex flex-col items-center justify-center relative"
        >
          {isActive("/myaccount") && (
            <span className="absolute top-0 w-[40px] h-1 bg-[#DD8560]"></span>
          )}{" "}
          <FiUser
            className={`text-3xl pt-1  text-black rounded-lg transition ease-in-out`}
          />
          <span className={`text-[7px] text-black `}>Account</span>
        </button>
      </Link>
    </div>
  );
};

export default MobileFooter;