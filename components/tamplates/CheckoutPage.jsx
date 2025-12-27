"use client";
import BorderSection from "@/components/atom/BorderSection";
import HeadingStyle from "@/components/atom/HeadingStyle";
import { CartContext } from "@/context/CartContext";
import calculateDeliveryCharges from "@/utils/deliveryChargesCalculater";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { GoPlus } from "react-icons/go";
import { HiOutlineMinusSmall } from "react-icons/hi2";
import { IoBagCheckOutline } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import CouponInput from "../molecules/CouponInput";
import LoginModal from "../molecules/LoginModal";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import { useCheckoutVoice } from "@/app/features/voice-ai";
import "react-toastify/dist/ReactToastify.css";

function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart, addToCart, removeFromCart, subTotle } =
    useContext(CartContext);
  const [showLogin, setShowLogin] = useState(false);
  const [discount, setDiscount] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [deliveryMethod, setDeliveryMethod] = useState("store");
  const [loading, setLoading] = useState(false);
  const [freeDelivery, setFreeDelivery] = useState(false);
  const [bogoApplied, setBogoApplied] = useState(false);
  const [code, setCode] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [pincodeData, setPincodeData] = useState(null);
  const [isPakistan, setIsPakistan] = useState(true);

  // Voice guidance for checkout fields
  useCheckoutVoice(formData);
  const handleApplyCoupon = (couponData) => {
    let discountAmount = 0;

    if (couponData.type === "percentage") {
      discountAmount = (subTotle * couponData.value) / 100;
    } else if (couponData.type === "flat") {
      discountAmount = couponData.value;
    } else if (couponData.type === "bogo") {
      // You'd apply BOGO logic on the cart (e.g., duplicate one item for free)
      setBogoApplied(true);
    } else if (couponData.type === "free-delivery") {
      setFreeDelivery(true); // Flag to hide delivery charges
    }
    setCode(couponData.code);
    setDiscount(discountAmount);
  };

  // Validate form function
  const validateForm = (data) => {
    return (
      data.name.trim() !== "" &&
      data.address.trim() !== "" &&
      data.phone.trim() !== "" &&
      data.city.trim() !== "" &&
      data.state.trim() !== "" &&
      data.pincode.trim() !== "" &&
      data.pincode.length === 5
    );
  };

  useEffect(() => {
    const userEmail = localStorage.getItem("email") || "";
    setFormData((prev) => ({ ...prev, email: userEmail }));
    if (!userEmail && !localStorage.getItem("loginPopupShown")) {
      toast.warning("Please login for checkout!");
      localStorage.setItem("loginPopupShown", "1");

      setTimeout(() => setShowLogin(true), 1500);
    }

    // Auto-detect user's location and pincode
    detectUserLocation();
  }, [router]);

  // Function to detect user's location and set pincode
  const detectUserLocation = async () => {
    try {
      // Fetch pincode data from JSON file
      const pincodeResponse = await fetch("/pincodes.json");
      const pincodeData = await pincodeResponse.json();
      // console.log("pincode data: ",pincodeData);

      setPincodeData(pincodeData);

      // IP detection removed due to CORS issues
      // User will use manual selection with auto-suggestions
    } catch (error) {
      console.log("Pincode data loading failed:", error);
      // Silently fail - user can still enter manually
    }
  };

  // Function to get suggestions based on pincode
  const getPincodeSuggestions = (pincode) => {
    if (!pincodeData || pincode.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const filtered = pincodeData.cities.filter((city) =>
      city.pincode.startsWith(pincode)
    );

    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  };

  // Function to get suggestions based on city/state
  const getCitySuggestions = (input, type) => {
    if (!pincodeData || input.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const filtered = pincodeData.cities.filter((city) => {
      if (type === "city") {
        return city.city.toLowerCase().includes(input.toLowerCase());
      } else if (type === "state") {
        return city.state.toLowerCase().includes(input.toLowerCase());
      }
      return false;
    });

    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  };

  // Function to select suggestion
  const selectSuggestion = (suggestion) => {
    const updatedFormData = {
      ...formData,
      pincode: suggestion.pincode,
      city: suggestion.city,
      state: suggestion.state,
    };
    setFormData(updatedFormData);
    setShowSuggestions(false);
    setDisabled(!validateForm(updatedFormData));
  };

  const handleChange = async (e) => {
    try {
      const { name, value } = e.target;

      // Update the formData
      const updatedFormData = {
        ...formData,
        [name]: value,
      };
      setFormData(updatedFormData);

      // Special handling for pincode
      if (name === "pincode") {
        if (value.length === 5) {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_HOST}/api/pincode`
          );
          const data = await response.json();

          if (data.hasOwnProperty(value)) {
            const [state, city] = data[value];
            const finalFormData = {
              ...updatedFormData,
              city,
              state,
              pincode: value,
            };
            setFormData(finalFormData);
            setDisabled(!validateForm(finalFormData));
            toast.success("Congrats! Your pincode is serviceable", {
              autoClose: 1000,
              closeOnClick: true,
              pauseOnHover: true,
            });
          } else {
            setFormData({
              ...updatedFormData,
              city: "",
              state: "",
            });
            setDisabled(true);
            toast.error("Sorry! Pincode not serviceable", {
              autoClose: 1000,
              closeOnClick: true,
              pauseOnHover: true,
            });
          }
        } else {
          setFormData({
            ...updatedFormData,
            city: "",
            state: "",
          });
          setDisabled(true);
          if (value.length >= 5) {
            toast.error("Please enter a valid pincode", {
              autoClose: 1000,
              closeOnClick: true,
              pauseOnHover: true,
            });
          }
        }
      } else if (name === "state") {
        // Check if state is in Pakistan
        const pakistanStates = ['punjab', 'sindh', 'khyber pakhtunkhwa', 'balochistan', 'islamabad', 'azad kashmir', 'gilgit-baltistan'];
        const isPakistanState = pakistanStates.some(state =>
          value.toLowerCase().includes(state) || state.includes(value.toLowerCase())
        );

        setIsPakistan(isPakistanState);

        if (!isPakistanState && value.length > 3) {
          toast.error("Sorry! We only deliver within Pakistan", {
            autoClose: 3000,
            closeOnClick: true,
            pauseOnHover: true,
          });
          setDisabled(true);
        } else {
          // For other fields, validate the entire form
          setDisabled(!validateForm(updatedFormData));
        }
      } else {
        // For other fields, validate the entire form
        setDisabled(!validateForm(updatedFormData));
      }
    } catch (error) {
      console.error("ERR:: some err in pincode", error);
      setDisabled(true);
    }
  };

  useEffect(() => {
    if (deliveryMethod === "post-office") {
      setDeliveryCharge(calculateDeliveryCharges(cart, deliveryMethod));
    } else {
      setDeliveryCharge(0);
    }
  }, [cart, deliveryMethod]);

  const handleDeliveryChange = (e) => {
    setDeliveryMethod(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (disabled) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    const oid = "#" + Math.floor(1000000 + Math.random() * 9000000).toString();

    try {
      // ✅ Flash Sale Validation - Check if any flash sale items are still valid
      const now = new Date();
      let flashSaleValidationError = null;

      for (const [slug, item] of Object.entries(cart)) {
        try {
          const productRes = await fetch(
            `${process.env.NEXT_PUBLIC_HOST}/api/getProducts`
          );
          const productData = await productRes.json();
          const product = productData.products.find((p) => p.slug === slug);

          if (product && product.flashEnd && product.flashPrice) {
            const flashEndDate = new Date(product.flashEnd);

            // Check if user is trying to use flash sale price but flash sale has expired
            if (item.price < product.price && now > flashEndDate) {
              flashSaleValidationError = `Flash sale for ${product.title} has expired. Current price is Rs. ${product.price}, but cart shows Rs. ${item.price}. Please refresh your cart.`;
              break;
            }
          }
        } catch (error) {
          console.error("Error validating flash sale:", error);
        }
      }

      if (flashSaleValidationError) {
        setLoading(false);
        toast.error(flashSaleValidationError, {
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
        });
        return;
      }

      const amount = Math.max(0, subTotle + deliveryCharge - discount);
      const orderData = {
        ...formData,
        code,
        email: formData.email,
        deliveryMethod,
        deliveryCharge,
        amount,
        orderId: oid,
        cart,
      };
      console.log("order befor save localy", orderData);

      // Save order data in localStorage instead of creating order
      const pendingorder = localStorage.setItem(
        "pendingOrderData",
        JSON.stringify(orderData)
      );
      localStorage.setItem("userOriginPage", document.referrer || "/");
      setLoading(false);
      toast.success("Redirecting to payment proof page...", {
        autoClose: 1000,
        closeOnClick: true,
        pauseOnHover: true,
      });

      // Add a small delay before redirect to ensure toast is shown
      setTimeout(() => {
        try {
          router.push(`/checkout/manual-payment`);
        } catch (error) {
          console.error("Navigation error:", error);
          // Fallback: try window.location
          window.location.href = `/checkout/manual-payment`;
        }
      }, 100);

      setFormData({
        name: "",
        email: "",
        address: "",
        phone: "",
        city: "",
        state: "",
        pincode: "",
      });
    } catch (error) {
      console.error("Order error:", error);
      toast.error("Sorry! Some internal error occurred.", {
        autoClose: 1000,
        closeOnClick: true,
        pauseOnHover: true,
      });
      toast.error("Please! Reload the page", {
        autoClose: 1000,
        closeOnClick: true,
        pauseOnHover: true,
      });
      setLoading(false);
    }
  };

  return (
    <div className="container m-auto px-2 mt-20 mb-6 ">
      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
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
      />
      <h1 className="font-normal text-center text-3xl my-8 ">
        CHECKOUT <BorderSection className="pt-2" />
      </h1>
      <h2 className="font-semibold text-xl">1. Delivery Details</h2>
      <form onSubmit={handleSubmit} className=" mx-auto p-6 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-gray-200"
            />
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Address
          </label>
          <textarea
            name="address"
            id="address"
            value={formData.address || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows="3"
            required
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              City
            </label>
            <input
              type="text"
              name="city"
              id="city"
              value={formData.city || ""}
              onChange={(e) => {
                handleChange(e);
                getCitySuggestions(e.target.value, "city");
              }}
              onBlur={(e) => getCitySuggestions(e.target.value, "city")}
              onFocus={(e) => getCitySuggestions(e.target.value, "city")}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            {showSuggestions && (
              <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.pincode}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => selectSuggestion(suggestion)}
                  >
                    {suggestion.city}, {suggestion.state} - {suggestion.pincode}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label
              htmlFor="state"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              State
            </label>
            <input
              type="text"
              name="state"
              id="state"
              value={formData.state || ""}
              onChange={(e) => {
                handleChange(e);
                getCitySuggestions(e.target.value, "state");
              }}
              onBlur={(e) => getCitySuggestions(e.target.value, "state")}
              onFocus={(e) => getCitySuggestions(e.target.value, "state")}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            {showSuggestions && (
              <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.pincode}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => selectSuggestion(suggestion)}
                  >
                    {suggestion.city}, {suggestion.state} - {suggestion.pincode}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor="pincode"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              PinCode
            </label>
            <input
              type="text"
              name="pincode"
              id="pincode"
              value={formData.pincode || ""}
              onChange={(e) => {
                handleChange(e);
                getPincodeSuggestions(e.target.value);
              }}
              onBlur={(e) => getPincodeSuggestions(e.target.value)}
              onFocus={(e) => getPincodeSuggestions(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            {showSuggestions && (
              <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.pincode}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => selectSuggestion(suggestion)}
                  >
                    {suggestion.city}, {suggestion.state} - {suggestion.pincode}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </form>

      <h2 className="font-semibold text-xl">2. Review Cart Items</h2>
      <div className="shadow-xl py-10 px-2">
        <h2 className="font-bold text-xl">Shopping Cart</h2>
        <ul className="list-decimal font-semibold px-2">
          {Object.keys(cart).length === 0 && (
            <div className="my-4 text-[#333] text-center">
              Your cart is empty!
            </div>
          )}

          {Object.keys(cart).length !== 0 &&
            Object.keys(cart).map((k) => {
              const item = cart[k];
              return (
                <li key={k}>
                  <div className="item flex">
                    <div className="w-1/3 overflow-hidden">
                      <Image
                        src={
                          item.imgUrl
                            ? item.imgUrl
                            : "/images/Black and White Minimalist T-Shirt Mockup Instagram Post.jpg"
                        }
                        alt={item.title || item.company || "Product Image"}
                        width={100}
                        height={100}
                      />
                    </div>
                    <div className="flex flex-col items-center justify-center space-y-2 ml-2">
                      <div className="w-full">{item.name.toUpperCase()}</div>
                      <div className="w-full flex items-center justify-center ml-[-20px] space-x-3">
                        <button
                          disabled={item.disabled === 1 ? true : false}
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
                        >
                          <HiOutlineMinusSmall className="p-1 text-3xl border border-1 rounded-full cursor-pointer" />
                        </button>
                        <span className="text-xl">{item.qty}</span>
                        <button
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
                        >
                          <GoPlus className="p-1 text-3xl border border-1 rounded-full cursor-pointer" />
                        </button>
                      </div>
                      <HeadingStyle level="7" tag="span">
                        {" "}
                        Rs.{item.price}/_
                      </HeadingStyle>
                    </div>
                  </div>
                </li>
              );
            })}
        </ul>
        <div className="mt-4 flex flex-col">
          <div className="bg-white py-6 px-2 rounded-lg shadow-md space-y-6 mt-8 border border-gray-200">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Delivery Method
              </label>
              <select
                value={deliveryMethod}
                onChange={handleDeliveryChange}
                className="block w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              >
                <option value="store">Pickup at Store</option>
                <option value="post-office">By Post Office</option>
              </select>
            </div>
            <CouponInput onApplyCoupon={handleApplyCoupon} />
            <div className="border-t pt-4">
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                📋 Order Summary
              </h3>

              {/* Original Subtotal */}
              <div className="space-y-2 text-sm text-gray-700 mb-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Original Subtotal:</span>
                  <span className="font-semibold">Rs. {subTotle}/_</span>
                </div>

                {/* Flash Sale Discount */}
                {(() => {
                  let flashDiscount = 0;
                  Object.keys(cart).forEach((slug) => {
                    const item = cart[slug];
                    if (item.originalPrice && item.originalPrice > item.price) {
                      flashDiscount +=
                        (item.originalPrice - item.price) * item.qty;
                    }
                  });
                  return flashDiscount > 0 ? (
                    <div className="flex justify-between items-center text-green-600">
                      <span className="flex items-center">
                        ⚡ Flash Sale Discount
                        <span className="ml-1 text-xs bg-green-100 px-2 py-1 rounded">
                          SAVE
                        </span>
                      </span>
                      <span className="font-semibold">
                        -Rs. {flashDiscount.toFixed(2)}
                      </span>
                    </div>
                  ) : null;
                })()}

                {/* Product Discount */}
                {(() => {
                  let productDiscount = 0;
                  Object.keys(cart).forEach((slug) => {
                    const item = cart[slug];
                    if (item.discountPercent && item.discountPercent > 0) {
                      const discountAmount =
                        ((item.price * item.discountPercent) / 100) * item.qty;
                      productDiscount += discountAmount;
                    }
                  });
                  return productDiscount > 0 ? (
                    <div className="flex justify-between items-center text-green-600">
                      <span className="flex items-center">
                        🏷️ Product Discount
                        <span className="ml-1 text-xs bg-green-100 px-2 py-1 rounded">
                          OFF
                        </span>
                      </span>
                      <span className="font-semibold">
                        -Rs. {productDiscount.toFixed(2)}
                      </span>
                    </div>
                  ) : null;
                })()}

                {/* Coupon Discount */}
                {discount > 0 && (
                  <div className="flex justify-between items-center text-green-600">
                    <span className="flex items-center">
                      🎫 Coupon Discount
                      <span className="ml-1 text-xs bg-blue-100 px-2 py-1 rounded">
                        {code}
                      </span>
                    </span>
                    <span className="font-semibold">
                      -Rs. {discount.toFixed(2)}
                    </span>
                  </div>
                )}

                {/* BOGO Applied */}
                {bogoApplied && (
                  <div className="flex justify-between items-center text-blue-600">
                    <span className="flex items-center">
                      🎁 BOGO Applied
                      <span className="ml-1 text-xs bg-blue-100 px-2 py-1 rounded">
                        FREE
                      </span>
                    </span>
                    <span className="font-semibold">1 Item Free</span>
                  </div>
                )}

                {/* Delivery Charges */}
                <div className="flex justify-between items-center">
                  <span className="font-medium">🚚 Delivery Charges:</span>
                  <span
                    className={`font-semibold ${freeDelivery ? "text-green-600" : "text-red-600"}`}
                  >
                    {freeDelivery ? (
                      <span className="flex items-center">
                        FREE
                        <span className="ml-1 text-xs bg-green-100 px-2 py-1 rounded">
                          SAVED
                        </span>
                      </span>
                    ) : (
                      `Rs. ${deliveryCharge}/_`
                    )}
                  </span>
                </div>
              </div>

              {/* Total Amount */}
              <div className="border-t border-gray-300 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-800">
                    💰 Total Payable:
                  </span>
                  <span className="text-xl font-bold text-[#DD8560]">
                    Rs. {Math.max(0, subTotle + deliveryCharge - discount)}/_
                  </span>
                </div>

                {/* Savings Summary */}
                {(() => {
                  let totalSavings = 0;
                  let flashDiscount = 0;
                  let productDiscount = 0;

                  Object.keys(cart).forEach((slug) => {
                    const item = cart[slug];
                    if (item.originalPrice && item.originalPrice > item.price) {
                      flashDiscount +=
                        (item.originalPrice - item.price) * item.qty;
                    }
                    if (item.discountPercent && item.discountPercent > 0) {
                      const discountAmount =
                        ((item.price * item.discountPercent) / 100) * item.qty;
                      productDiscount += discountAmount;
                    }
                  });

                  totalSavings =
                    flashDiscount +
                    productDiscount +
                    discount +
                    (freeDelivery ? deliveryCharge : 0);

                  return totalSavings > 0 ? (
                    <div className="mt-2 text-center">
                      <span className="text-sm text-green-600 font-medium">
                        🎉 You saved Rs. {totalSavings.toFixed(2)} on this
                        order!
                      </span>
                    </div>
                  ) : null;
                })()}
              </div>
            </div>
          </div>
          <button
            disabled={disabled || loading || Object.keys(cart).length === 0}
            onClick={handleSubmit}
            className={`flex items-center justify-center bg-black text-white mt-3 py-2 px-2 focus:outline-none ${disabled || loading || Object.keys(cart).length === 0
              ? "opacity-70 cursor-not-allowed"
              : "cursor-pointer"
              }`}
          >
            <IoBagCheckOutline className="mr-2" />
            {loading
              ? "Processing..."
              : `Pay Rs. ${Math.max(0, subTotle + deliveryCharge - discount)}/_`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
