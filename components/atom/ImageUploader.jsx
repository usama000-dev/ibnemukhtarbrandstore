import React, { useRef, useEffect } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { cancelPendingRequests } from "@/services/api";

const DEFAULT_MAX = 4;
const DEFAULT_MIN = 1;
const DEFAULT_FOLDER = "products";
const DEFAULT_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default";
const DEFAULT_CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dwqchugmp'}/upload`;

function ImageUploader({
  maxImages = DEFAULT_MAX,
  minImages = DEFAULT_MIN,
  onChange,
  initialImages = [],
  folder = DEFAULT_FOLDER,
  uploadPreset = DEFAULT_UPLOAD_PRESET,
  cloudinaryUrl = DEFAULT_CLOUDINARY_URL,
}) {
  const [uploadedImages, setUploadedImages] = React.useState([]);
  const [imageError, setImageError] = React.useState("");
  const inputRef = useRef();

  // Initialize with initialImages only once when component mounts
  useEffect(() => {
    if (initialImages.length > 0) {
      setUploadedImages(
        initialImages.map((img) => ({
          ...img,
          id: img.id || Math.random().toString(36).substr(2, 9),
          status: "success",
          progress: 100,
          error: "",
          publicId: img.publicId || img.public_id || "",
        }))
      );
    }
    return () => {
      cancelPendingRequests();
    };
  }, []); // Empty dependency array means this runs only once on mount

  // Call onChange when uploadedImages changes
  useEffect(() => {
    onChange && onChange(uploadedImages);
  }, [uploadedImages, onChange]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + uploadedImages.length > maxImages) {
      toast.warning(`Max ${maxImages} images allowed.`, { autoClose: 1000 });
      return;
    }
    files.forEach((file) => {
      uploadImageToCloudinary(file);
    });
    e.target.value = null;
  };

  const uploadImageToCloudinary = async (file) => {
    const id = Math.random().toString(36).substr(2, 9);
    setUploadedImages((prev) => [
      ...prev,
      { name: file.name, status: "uploading", progress: 0, error: "", url: "", publicId: "", id }
    ]);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", folder);

    try {
      const xhr = new window.XMLHttpRequest();
      xhr.open("POST", cloudinaryUrl);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadedImages((prev) => prev.map(img => img.id === id ? { ...img, progress } : img));
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const res = JSON.parse(xhr.responseText);
          setUploadedImages((prev) =>
            prev.map(img => img.id === id ? {
              ...img,
              status: "success",
              url: res.secure_url,
              publicId: res.public_id,
              progress: 100
            } : img)
          );
          toast.success(`Image uploaded: ${file.name}`);
        } else {
          setUploadedImages((prev) =>
            prev.map(img => img.id === id ? {
              ...img,
              status: "error",
              error: "Upload failed"
            } : img)
          );
          toast.error(`Image upload failed: ${file.name}`);
        }
      };

      xhr.onerror = () => {
        setUploadedImages((prev) =>
          prev.map(img => img.id === id ? {
            ...img,
            status: "error",
            error: "Network error"
          } : img)
        );
        toast.error(`Image upload failed: ${file.name}`);
      };

      xhr.send(formData);
    } catch (err) {
      setUploadedImages((prev) =>
        prev.map(img => img.id === id ? {
          ...img,
          status: "error",
          error: "Exception"
        } : img)
      );
      toast.error(`Image upload failed: ${file.name}`);
    }
  };

  const handleRemoveImage = async (id) => {
    console.log("id", id);
    console.log("button is clicked");
    try {
      setUploadedImages((prev) =>
        prev.map((img) =>
          img.publicId === id ? { ...img, status: "removing" } : img
        )
      );
      console.log("button is clicked line 137");
      const imgToRemove = uploadedImages.find((img) => img.publicId === id);
      console.log("imgToRemove", imgToRemove);
      if (imgToRemove && imgToRemove.publicId) {
        try {
          const res = await fetch("/api/destroy-cloudinary-image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ publicIds: [imgToRemove.publicId] }),
          });
          const data = await res.json();
          if (res.ok && data.success) {
            toast.success("Image deleted from Cloudinary");
          } else {
            toast.error(data.error || "Failed to delete image from Cloudinary");
          }
        } catch (err) {
          toast.error("Error deleting image from Cloudinary");
        }
      }
      console.log("button is clicked line 157");
      setUploadedImages((prev) => prev.filter((img) => img.id !== id));
      console.log("button is clicked line 159");
    } catch (error) {
      console.error("error", error);
      console.log("button is clicked in catch block line 163");
    }
  };

  useEffect(() => {
    if (uploadedImages.length < minImages) {
      setImageError(`Please upload at least ${minImages} image${minImages > 1 ? 's' : ''}.`);
    } else {
      setImageError("");
    }
  }, [uploadedImages, minImages]);

  return (
    <Box className="image-uploader w-full">
      <Typography fontWeight="bold">Upload Images (Min {minImages}, Max {maxImages})</Typography>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={maxImages > 1}
        onChange={handleImageChange}
        style={{ width: '100%', marginTop: 8 }}
        disabled={uploadedImages.length >= maxImages}
      />
      {imageError && (
        <Typography color="error" variant="body2">{imageError}</Typography>
      )}
      {uploadedImages.length > 0 && (
        <Stack spacing={1} mt={1}>
          {uploadedImages.map((img) => (
            <div key={img.id} style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "6px 10px",
              backgroundColor: "#f5f5f5",
              borderRadius: "6px",
              flexWrap: 'wrap'
            }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                {img.status === "uploading" && (
                  <Typography variant="body2" sx={{ wordBreak: 'break-all', maxWidth: { xs: '120px', sm: 'none' } }}>
                    {img.name} ({img.progress}%)
                  </Typography>
                )}
                {img.status === "success" && (
                  <Typography variant="body2" sx={{ wordBreak: 'break-all', maxWidth: { xs: '120px', sm: 'none' } }}>
                    {img.name}
                  </Typography>
                )}
                {img.status === "error" && (
                  <Typography variant="body2" sx={{ wordBreak: 'break-all', maxWidth: { xs: '120px', sm: 'none' } }}>
                    {img.name} (Error: {img.error})
                  </Typography>
                )}
              </Stack>

              {img.status === "success" && (
                <img
                  src={img.url}
                  alt={img.name}
                  style={{ width: 50, height: 50, borderRadius: 4 }}
                />
              )}

              {img.status === "uploading" && (
                <Typography variant="body2">Uploading...</Typography>
              )}

              {(img.status === "error" || img.status === "success") && (
                <Button
                  onClick={() => handleRemoveImage(img.publicId)}
                  variant="outlined"
                  color="error"
                  size="small"
                  sx={{ ml: 1, mt: { xs: 1, sm: 0 } }}
                  disabled={img.status === "removing"}
                >
                  {img.status === "removing" ? "Removing..." : "Remove"}
                </Button>
              )}
            </div>
          ))}
        </Stack>
      )}
    </Box>
  );
}

export default ImageUploader;