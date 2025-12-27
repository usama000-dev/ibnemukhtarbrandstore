"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { usePaymentVoice } from "@/app/features/voice-ai";

export default function PaymentMethods() {
  const [selected, setSelected] = useState("easypaisa");

  // Voice guidance when payment tab changes
  usePaymentVoice(selected);

  // Update localStorage with payment method and COD charge
  useEffect(() => {
    const orderDataString = localStorage.getItem('pendingOrderData');
    if (orderDataString) {
      try {
        const orderData = JSON.parse(orderDataString);
        const originalAmount = orderData.amount || 0;
        const previousCodCharge = orderData.codCharge || 0;

        // Remove previous COD charge if any
        let newAmount = originalAmount - previousCodCharge;

        // Add COD charge if COD selected
        if (selected === 'cod') {
          newAmount += 100;
          orderData.codCharge = 100;
        } else {
          orderData.codCharge = 0;
        }

        orderData.amount = newAmount;
        orderData.paymentMethod = selected;

        localStorage.setItem('pendingOrderData', JSON.stringify(orderData));
      } catch (e) {
        console.error('Error updating payment method:', e);
      }
    }
  }, [selected]);

  const methods = [
    { id: "easypaisa", label: "", icon: "https://res.cloudinary.com/dmkqox9ry/image/upload/v1763396138/easypaisa_mdsmss.png" },
    { id: "jazzcash", label: "", icon: "https://res.cloudinary.com/dmkqox9ry/image/upload/v1763399473/jazzcash_deyigu.png" },
    { id: "meezan", label: "Meezan Bank", icon: "https://res.cloudinary.com/dmkqox9ry/image/upload/v1763372659/ibn-e-mukhtar_logo_1_uc5cry.png" },
    { id: "cod", label: "Cash on Delivery", icon: "https://res.cloudinary.com/dmkqox9ry/image/upload/v1763399108/ibn-e-mukhtar_logo_2_nftazv.png" },
  ];

  const info = {
    easypaisa: (
      <>
        <p className="text-green-600 text-lg font-semibold">0346-7383686</p>
        <p className="text-sm text-gray-600">Ali Raza – Easypaisa</p>
      </>
    ),
    jazzcash: (
      <>
        <p className="text-orange-600 text-lg font-semibold">0312-0905007</p>
        <p className="text-sm text-gray-600">Ali Raza – JazzCash</p>
      </>
    ),
    meezan: (
      <>
        <p className="text-sm text-gray-600">Ali Raza – Meezan Bank</p>
        <p className="text-purple-700 text-sm font-semibold">
          Meezan Bank-CHINNIOT BRANCH
        </p>
        <p className="text-purple-700 text-sm font-semibold">
          Account No: 48010104279973
        </p>
        <p className="text-purple-700 text-sm  font-semibold">
          IBAN: PK58MEZN0048010104279973
        </p>
      </>
    ),
    cod: (
      <>
        <p className="text-green-600 font-medium">
          ✅ Cash on Delivery Available
        </p>
        <p className="text-yellow-600 text-sm mt-2 font-semibold">
          ⚠️ Extra Rs. 100 will be added for COD
        </p>
        <p className="text-gray-600 text-xs mt-1">
          Pay to courier on delivery
        </p>
      </>
    ),
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 border rounded-xl shadow-md bg-white">
      <h2 className="text-center text-xl font-bold mb-4">
        Select Payment Method
      </h2>

      {/* Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {methods.map((m) => (
          <button
            key={m.id}
            onClick={() => setSelected(m.id)}
            className={`flex flex-col items-center justify-center gap-1 py-1 rounded-md border transition ${selected === m.id
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-blue-400"
              }`}
          >
            <Image
              src={m.icon}
              alt={m.label}
              width={40}
              height={40}
              className="object-contain"
            />
            {m.label !== "" && (<span className="text-xs font-medium">{m.label}</span>)}
          </button>
        ))}
      </div>

      {/* Animated Info Section */}
      <div className="relative min-h-[120px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={selected}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute w-full p-4 border rounded-md bg-gray-50 shadow-sm"
          >
            {info[selected]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
