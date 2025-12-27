"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Modal, Box, IconButton, Button } from "@mui/material";
import {
  WhatsApp,
  Facebook,
  Twitter,
  LinkedIn,
  Telegram,
  Reddit,
  Pinterest,
  Email,
  ContentCopy,
  Close,
  MoreHoriz,
  Share,
  Image as ImageIcon,
} from "@mui/icons-material";
import { useState } from "react";

const ShareModal = ({ open, setOpen, product }) => {
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  if (!product) return null;

  const {
    _id,
    name,
    size,
    category,
    uniformNumberFormat,
    images,
    imageUrl,
    title,
    Color,
    company,
    upperColor,
    trowserColor,
  } = product;

  const shareUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/product/${_id}`
    : "";

  const getFirstImage = () => {
    if (images && images.length > 0) return images[0];
    if (imageUrl) return imageUrl;
    return "";
  };

  // WhatsApp share text with ALL details
  const whatsappShareText = `🥋 *TAEKWONDO UNIFORM ORDER* 🥋

*${title || name}*

📏 *Size:* ${size || "Not specified"}
⭐ *Category:* ${category || "Not specified"}  
🔢 *Product No:* ${uniformNumberFormat || "Not specified"}
🎨 *Color:* ${Color || upperColor || trowserColor || "Not specified"}
🏢 *Brand:* ${company || "Not specified"}

🛍️ *View Full Details & Order:*
${shareUrl}

🚀 *Fast Delivery Across Pakistan*
📞 *Contact for Pricing & Orders*`;

  // 📱 DEVICE DETECTION FUNCTIONS
  const isIOS = () => /iPhone|iPad|iPod/.test(navigator.userAgent);
  const isAndroid = () => /Android/.test(navigator.userAgent);
  const isChrome = () => /Chrome/.test(navigator.userAgent);
  const isSamsungBrowser = () => /SamsungBrowser/.test(navigator.userAgent);

  // 🎯 MAIN SMART SHARE FUNCTION
  const handleSmartWhatsAppShare = async () => {
    const imageUrl = getFirstImage();
    const text = whatsappShareText;

    // 🔍 STEP 1: Detect Device Type and Choose Best Method
    if (navigator.share) {
      // 📱 MODERN DEVICES - Web Share API
      await handleModernDeviceShare(imageUrl, text);
    } else {
      // 📟 OLD DEVICES - Alternative Methods
      await handleOldDeviceShare(imageUrl, text);
    }
  };

  // 📱 MODERN DEVICES (Web Share API Available)
  const handleModernDeviceShare = async (imageUrl, text) => {
    try {
      // Method 1: Android Chrome (Best Support)
      if (isAndroid() && isChrome()) {
        await handleAndroidChromeShare(imageUrl, text);
        return;
      }

      // Method 2: Samsung Browser
      if (isSamsungBrowser()) {
        await handleSamsungBrowserShare(imageUrl, text);
        return;
      }

      // Method 3: iOS Devices (Limited Support)
      if (isIOS()) {
        await handleIOSShare(imageUrl, text);
        return;
      }

      // Method 4: Generic Web Share (Fallback)
      await handleGenericWebShare(text);
      
    } catch (error) {
      console.log("❌ Modern share failed, using fallback");
      await handleOldDeviceShare(imageUrl, text);
    }
  };

  // 🤖 ANDROID CHROME (Best Support)
  const handleAndroidChromeShare = async (imageUrl, text) => {
    if (imageUrl) {
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], `uniform-${size}-${category}.jpg`, { 
          type: 'image/jpeg' 
        });
        
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            text: text,
            title: `${title} - Uniform`
          });
          return;
        }
      } catch (error) {
        console.log("Android Chrome image share failed");
      }
    }
    
    // Fallback to text only
    await navigator.share({
      text: text,
      url: shareUrl
    });
  };

  // 📱 SAMSUNG BROWSER
  const handleSamsungBrowserShare = async (imageUrl, text) => {
    // Samsung browser has good file sharing support
    if (imageUrl) {
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], `uniform-${size}.jpg`, { type: 'image/jpeg' });
        
        await navigator.share({
          files: [file],
          text: text
        });
        return;
      } catch (error) {
        console.log("Samsung browser share failed");
      }
    }
    
    await navigator.share({ text: text });
  };

  // 🍎 iOS DEVICES (Limited File Sharing)
  const handleIOSShare = async (imageUrl, text) => {
    // iOS doesn't support file sharing well, use text only
    try {
      await navigator.share({
        text: text,
        url: shareUrl
      });
      
      // Offer image download after text share
      if (imageUrl) {
        setTimeout(() => {
          this.downloadImageWithInstructions(imageUrl);
        }, 1000);
      }
    } catch (error) {
      // If Web Share fails on iOS, use direct WhatsApp
      this.openWhatsAppWithText(text, imageUrl);
    }
  };

  // 🌐 GENERIC WEB SHARE
  const handleGenericWebShare = async (text) => {
    await navigator.share({
      text: text,
      url: shareUrl
    });
  };

  // 📟 OLD DEVICES (No Web Share API)
  const handleOldDeviceShare = async (imageUrl, text) => {
    const userChoice = window.confirm(
      `📱 WHATSAPP SHARING\n\n` +
      `Your device doesn't support auto-sharing.\n\n` +
      `Choose method:\n` +
      `✅ OK - Text + Image (2 steps)\n` +
      `❌ Cancel - Text Only (1 step)\n\n` +
      `We recommend "Text + Image" for best results.`
    );

    if (userChoice) {
      // 2-STEP PROCESS: Text + Image
      await handleTwoStepSharing(imageUrl, text);
    } else {
      // 1-STEP PROCESS: Text Only
      this.openWhatsAppWithText(text, null);
    }
  };

  // 🔄 2-STEP SHARING PROCESS
  const handleTwoStepSharing = async (imageUrl, text) => {
    // Step 1: Download Image First
    if (imageUrl) {
      this.downloadImageWithInstructions(imageUrl);
      
      // Step 2: Open WhatsApp after download
      setTimeout(() => {
        this.openWhatsAppWithText(text, null);
      }, 2000);
    } else {
      this.openWhatsAppWithText(text, null);
    }
  };

  // 📥 IMAGE DOWNLOAD WITH INSTRUCTIONS
  const downloadImageWithInstructions = (imageUrl) => {
    // Show instructions first
    const proceed = confirm(
      `📸 DOWNLOAD UNIFORM IMAGE\n\n` +
      `1. Click OK to download image\n` +
      `2. Image will save as: uniform-${size}-${category}.jpg\n` +
      `3. Then WhatsApp will open automatically\n` +
      `4. Attach the downloaded image\n\n` +
      `Click OK to continue.`
    );
    
    if (proceed) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `uniform-${size}-${category}-${uniformNumberFormat}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // 💬 OPEN WHATSAPP WITH TEXT
  const openWhatsAppWithText = (text, imageUrl) => {
    let finalText = text;
    
    // Add image URL to text if provided
    if (imageUrl) {
      finalText += `\n\n📸 Product Image: ${imageUrl}`;
    }
    
    window.open(`https://wa.me/?text=${encodeURIComponent(finalText)}`, '_blank');
  };

  // 🚀 SIMPLE WHATSAPP (Text Only - Works Everywhere)
  const handleSimpleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(whatsappShareText)}`, '_blank');
  };

  // 🎯 QUICK SHARE (Auto-detects best method)
  const handleQuickShare = () => {
    handleSmartWhatsAppShare();
  };

  return (
    <AnimatePresence>
      {open && (
        <Modal open={open} onClose={() => setOpen(false)}>
          <Box className="absolute bottom-0 left-0 w-full bg-white rounded-t-2xl shadow-xl max-h-[80vh] overflow-y-auto">
            
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Share Uniform</h2>
                <IconButton onClick={() => setOpen(false)}>
                  <Close />
                </IconButton>
              </div>
              
              {/* Product Preview */}
              <div className="mt-3 flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <img 
                  src={getFirstImage()} 
                  alt={title || name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-gray-800">{title || name}</h3>
                  <div className="text-xs text-gray-600 mt-1 space-y-1">
                    {size && <div><strong>Size:</strong> {size}</div>}
                    {category && <div><strong>Category:</strong> {category}</div>}
                    {uniformNumberFormat && <div><strong>Product No:</strong> {uniformNumberFormat}</div>}
                  </div>
                </div>
              </div>

              {/* Device-Specific Info */}
              <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs font-semibold text-blue-800">
                  {navigator.share ? "✅ Auto-Sharing Supported" : "📱 Manual Sharing Required"}
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  {navigator.share 
                    ? "Image + Text will be shared automatically" 
                    : "Follow simple steps to share image + text"}
                </p>
              </div>
            </div>

            <motion.div
              initial={{ y: 200, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 200, opacity: 0 }}
            >
              <div className="p-6">
                
                {/* 🚀 QUICK SHARE BUTTON (Main) */}
                <div className="mb-4">
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<WhatsApp />}
                    onClick={handleQuickShare}
                    sx={{
                      backgroundColor: "#25D366",
                      py: 1.5,
                      borderRadius: 2,
                      fontSize: "1rem",
                      fontWeight: "600",
                      '&:hover': { backgroundColor: "#128C7E" }
                    }}
                  >
                    {navigator.share ? "Auto Share" : "Smart Share"}
                  </Button>
                  <p className="text-xs text-gray-600 text-center mt-2">
                    {navigator.share 
                      ? "Image + Text automatically" 
                      : "Guided process for image + text"}
                  </p>
                </div>

                {/* 📝 SIMPLE TEXT SHARE (Works Everywhere) */}
                <div className="mb-4">
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Share />}
                    onClick={handleSimpleWhatsApp}
                    sx={{
                      borderColor: "#10b981",
                      color: "#10b981",
                      '&:hover': { 
                        borderColor: "#059669", 
                        backgroundColor: "#f0fdf4" 
                      }
                    }}
                  >
                    Quick Text Share
                  </Button>
                  <p className="text-xs text-gray-500 text-center mt-1">
                    Fastest - Works on all devices
                  </p>
                </div>

                {/* 📸 IMAGE OPTIONS */}
                {getFirstImage() && (
                  <div className="mb-6 space-y-3">
                    {/* Download Image */}
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<ImageIcon />}
                      onClick={() => downloadImageWithInstructions(getFirstImage())}
                      sx={{
                        borderColor: "#8b5cf6",
                        color: "#8b5cf6",
                        '&:hover': { 
                          borderColor: "#7c3aed", 
                          backgroundColor: "#faf5ff" 
                        }
                      }}
                    >
                      Download Image
                    </Button>

                    {/* Share Image via Link */}
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<ContentCopy />}
                      onClick={() => {
                        const textWithImage = `${whatsappShareText}\n\n📸 Image: ${getFirstImage()}`;
                        navigator.clipboard.writeText(textWithImage);
                        alert("✅ Copied! Paste in WhatsApp - image may show as preview");
                      }}
                      sx={{
                        borderColor: "#f59e0b",
                        color: "#f59e0b",
                        '&:hover': { 
                          borderColor: "#d97706", 
                          backgroundColor: "#fffbeb" 
                        }
                      }}
                    >
                      Copy Text + Image Link
                    </Button>
                  </div>
                )}

                {/* 📊 Device Support Info */}
                <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                  <p className="text-xs font-semibold text-gray-700">📱 Device Support:</p>
                  <div className="text-xs text-gray-600 mt-1 space-y-1">
                    <div>• <strong>Android Chrome:</strong> Auto image + text ✅</div>
                    <div>• <strong>Samsung Browser:</strong> Auto image + text ✅</div>
                    <div>• <strong>iOS Safari:</strong> Text only + image download</div>
                    <div>• <strong>Old Devices:</strong> Guided process</div>
                  </div>
                </div>

              </div>
            </motion.div>
          </Box>
        </Modal>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;