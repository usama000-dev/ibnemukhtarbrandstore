import axios from "axios";
import { toast } from "react-toastify";
import imageCompression from 'browser-image-compression';

// =============================================
// CORE CONFIGURATION & UTILITIES
// =============================================

const API_URL = ""; // IF /LIVE
// const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/v1`; // IF TESTING STAGE

// Create a cancel token source for request cancellation
const CancelToken = axios.CancelToken;
let cancelSource = CancelToken.source();

/**
 * Get the appropriate base URL based on environment
 * @returns {string}
 */
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin; // Client-side
  }
  return process.env.NEXT_PUBLIC_HOST || 'http://localhost:3001'; // Server-side
};

/**
 * Cancel all pending requests
 * @param {string} reason - Reason for cancellation
 */
const cancelPendingRequests = (reason = 'Component unmounted') => {
  cancelSource.cancel(reason);
  cancelSource = CancelToken.source(); // Reset for new requests
};

/**
 * Handle API response consistently
 * @param {object} response 
 * @returns {object}
 */
const handleResponse = (response) => {
  if (!response.data) {
    throw new Error('Empty response from server');
  }
  return response.data;
};

// =============================================
// PRODUCT API METHODS
// =============================================

// =============================================
// IMAGE UTILITIES (YOUR ORIGINAL FUNCTIONS)
// =============================================

/**
 * Compress an image file if it exceeds 10MB.
 * @param {File} file - The image file to compress.
 * @returns {Promise<File>} - The compressed file (or original if <=10MB).
 */
export async function compressImage(file) {
  const MAX_SIZE_MB = 10;
  if (file.size / 1024 / 1024 <= MAX_SIZE_MB) {
    return file;
  }

  const options = {
    maxSizeMB: 6,
    maxWidthOrHeight: 2048,
    useWebWorker: true,
    initialQuality: 0.85,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    throw new Error('Image compression failed: ' + error.message);
  }
}

/**
 * Optimize Cloudinary image URL
 * @param {string} url 
 * @returns {string}
 */
function getOptimizedCloudinaryUrl(url) {
  if (!url || !url.includes("/upload/")) return url;
  if (url.includes("/upload/w_400")) return url;
  return url.replace("/upload/", "/upload/w_400,h_400,c_fill,q_auto,f_auto/");
}

// =============================================
// EXPORTS
// =============================================

export {
  getOptimizedCloudinaryUrl,
  cancelPendingRequests
};