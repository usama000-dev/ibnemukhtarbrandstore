"use client";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CartContext } from "./CartContext";
import { trackAddToCart, trackBuyNow } from "@/lib/facebookPixel";

export const CartProvider = ({ children }) => {
  const router = useRouter();
  const [cart, setCart] = useState({});
  const [subTotle, setSubTotle] = useState(0);

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        setCart(parsedCart);
        saveCart(parsedCart); // 💡 Add this line to recalculate subtotal
      }
    } catch (err) {
      console.error(err);
      localStorage.clear();
    }
  }, []);

  const saveCart = (myCart) => {
    localStorage.setItem("cart", JSON.stringify(myCart));
    let sbt = 0;
    Object.keys(myCart).forEach((key) => {
      sbt += myCart[key].price * myCart[key].qty;
    });
    setSubTotle(sbt);
    // console.log("Totale is Calculated =", sbt);
  };

const addToCart = (
  itemCode,
  qty,
  price,
  name,
  size,
  variant,
  imgUrl,
  disabled = 2
) => {
  console.warn("button clicked");

  if (!itemCode || typeof itemCode !== "string") {
    console.error("Invalid itemCode");
    toast.warn("Please try again to add to cart", {
      autoClose: 1000,
      closeOnClick: true,
      pauseOnHover: true,
    });
    return;
  }

  let newCart = { ...cart };

  if (newCart[itemCode]) {
    newCart[itemCode].qty += qty;
  } else {
    newCart[itemCode] = {
      qty,
      price,
      name,
      size,
      variant,
      imgUrl,
      disabled,
    };
  }

  // ✅ FIXED: Wrap product object in itemCode key for Facebook Pixel
  trackAddToCart({ [itemCode]: newCart[itemCode] }, qty);

  setCart(newCart);
  saveCart(newCart);

  toast.success("Congrats! Product successfully added to your cart", {
    autoClose: 1000,
    closeOnClick: true,
    pauseOnHover: true,
  });
};


  const buyNow = (itemCode, qty, price, name, size, variant, imgUrl) => {
    saveCart({});
    let newCart = {
      [itemCode]: { itemCode, qty: 1, price, name, size, variant, imgUrl },
    };
    setCart(newCart);
    // console.log(newCart);
    trackBuyNow(newCart);
    toast.success("Product added in cart ! ", {
      autoClose: 1000,
      closeOnClick: true,
      pauseOnHover: true,
    });
    saveCart(newCart);
    setTimeout(() => {
      router.push("/checkout");
    }, 1500);
  };

  const removeFromCart = (itemCode, qty, name, size, variant, price) => {
    let newCart = { ...cart };
    if (itemCode in newCart) {
      newCart[itemCode].qty -= qty;
      if (newCart[itemCode].qty <= 0) {
        delete newCart[itemCode];
      }
    }
    setCart(newCart);
    saveCart(newCart);
    toast.success("Item Remove From Cart Sccessfully.", {
      autoClose: 1000,
      closeOnClick: true,
      pauseOnHover: true,
    });
  };

  const clearCart = () => {
    localStorage.removeItem("cart");
    setCart({});
    toast.success("Cart is Cleared Successfully", {
      autoClose: 1000,
      closeOnClick: true,
      pauseOnHover: true,
    });
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        subTotle,
        addToCart,
        removeFromCart,
        clearCart,
        buyNow,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
