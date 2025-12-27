// Payment Method Details for Voice Guidance
export const PAYMENT_DETAILS = {
    easypaisa: {
        number: "0346-7383686",
        title: "Ali Raza",
        type: "Mobile Wallet"
    },
    jazzcash: {
        number: "0312-0905007",
        title: "Ali Raza",
        type: "Mobile Wallet"
    },
    meezan: {
        branch: "CHINNIOT BRANCH",
        account: "48010104279973",
        iban: "PK58MEZN0048010104279973",
        title: "Ali Raza",
        type: "Bank Transfer"
    },
    cod: {
        status: "available",
        extraCharge: 100,
        message: "Cash on Delivery available with Rs. 100 extra charge.",
        note: "Payment on delivery to courier"
    }
};

export const PAYMENT_VOICE_SCRIPTS = {
    easypaisa: {
        ur: "EasyPaisa ke liye 0346-7383686 par payment karein. Ali Raza ke naam se. Payment ke baad screenshot upload zaroor karein.",
        en: "For EasyPaisa, send payment to 0346-7383686 in the name of Ali Raza. Upload screenshot after payment."
    },
    jazzcash: {
        ur: "JazzCash ke liye 0312-0905007 par payment karein. Ali Raza ke naam se. Screenshot upload karna na bhoolein.",
        en: "For JazzCash, send payment to 0312-0905007 in the name of Ali Raza. Don't forget to upload screenshot."
    },
    meezan: {
        ur: "Meezan Bank Chinniot Branch. Account number 4 8 0 1 0 1 0 4 2 7 9 9 7 3. IBAN PK58MEZN0048010104279973. Ali Raza ke naam se. Payment proof upload karein.",
        en: "Meezan Bank Chinniot Branch. Account number 48010104279973. IBAN PK58MEZN0048010104279973. In the name of Ali Raza. Upload payment proof."
    },
    cod: {
        ur: "Ji sir, Cash on Delivery available hai. Lekin Rs. 100 extra charge lagega. Payment courier ko delivery par dena hoga.",
        en: "Yes sir, Cash on Delivery is available. However, Rs. 100 extra charge will apply. Payment to courier on delivery."
    }
};
