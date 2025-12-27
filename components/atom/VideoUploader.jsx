import React, { useRef, useEffect } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { cancelPendingRequests } from "@/services/api";

const DEFAULT_MAX = 1;
const DEFAULT_MIN = 1;
const DEFAULT_FOLDER = "ads";
const DEFAULT_UPLOAD_PRESET = "ml_default";
const DEFAULT_CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/do58gkhav/auto/upload"; // Targeted for Auto (Video/Image)

function VideoUploader({
    maxVideos = DEFAULT_MAX,
    minVideos = DEFAULT_MIN,
    onChange,
    initialVideos = [],
    folder = DEFAULT_FOLDER,
    uploadPreset = DEFAULT_UPLOAD_PRESET,
    acceptType = "video/*", // NEW PROP
    label = "Upload Video",  // NEW PROP
}) {
    const [uploadedVideos, setUploadedVideos] = React.useState([]);
    const [videoError, setVideoError] = React.useState("");
    const inputRef = useRef();

    useEffect(() => {
        if (initialVideos.length > 0) {
            setUploadedVideos(
                initialVideos.map((vid) => ({
                    ...vid,
                    id: vid.id || Math.random().toString(36).substr(2, 9),
                    status: "success",
                    progress: 100,
                    error: "",
                    publicId: vid.publicId || vid.public_id || "",
                }))
            );
        }
        return () => {
            cancelPendingRequests();
        };
    }, []);

    useEffect(() => {
        onChange && onChange(uploadedVideos);
    }, [uploadedVideos, onChange]);

    const handleVideoChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + uploadedVideos.length > maxVideos) {
            toast.warning(`Max ${maxVideos} items allowed.`, { autoClose: 1000 });
            return;
        }
        files.forEach((file) => {
            uploadVideoToCloudinary(file);
        });
        e.target.value = null;
    };

    const uploadVideoToCloudinary = async (file) => {
        const id = Math.random().toString(36).substr(2, 9);
        // Determine type based on file or default
        const type = file.type.startsWith('image/') ? 'image' : 'video';

        setUploadedVideos((prev) => [
            ...prev,
            { name: file.name, status: "uploading", progress: 0, error: "", url: "", publicId: "", id, type }
        ]);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);
        formData.append("folder", folder);
        // "auto" resource type usually handles both, but specific URL "video/upload" forces video.
        // We changed const DEFAULT_CLOUDINARY_URL to "auto/upload".

        try {
            const xhr = new window.XMLHttpRequest();
            xhr.open("POST", DEFAULT_CLOUDINARY_URL);

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const progress = Math.round((event.loaded / event.total) * 100);
                    setUploadedVideos((prev) => prev.map(vid => vid.id === id ? { ...vid, progress } : vid));
                }
            };

            xhr.onload = () => {
                if (xhr.status === 200) {
                    const res = JSON.parse(xhr.responseText);
                    setUploadedVideos((prev) =>
                        prev.map(vid => vid.id === id ? {
                            ...vid,
                            status: "success",
                            url: res.secure_url,
                            publicId: res.public_id,
                            type: res.resource_type,
                            progress: 100
                        } : vid)
                    );
                    toast.success(`Uploaded: ${file.name}`);
                } else {
                    setUploadedVideos((prev) =>
                        prev.map(vid => vid.id === id ? {
                            ...vid,
                            status: "error",
                            error: "Upload failed"
                        } : vid)
                    );
                    toast.error(`Upload failed: ${file.name}`);
                }
            };

            xhr.onerror = () => {
                setUploadedVideos((prev) =>
                    prev.map(vid => vid.id === id ? {
                        ...vid,
                        status: "error",
                        error: "Network error"
                    } : vid)
                );
                toast.error(`Upload failed: ${file.name}`);
            };

            xhr.send(formData);
        } catch (err) {
            setUploadedVideos((prev) =>
                prev.map(vid => vid.id === id ? {
                    ...vid,
                    status: "error",
                    error: "Exception"
                } : vid)
            );
            toast.error(`Upload failed: ${file.name}`);
        }
    };

    const handleRemoveVideo = async (id) => {
        try {
            setUploadedVideos((prev) =>
                prev.map((vid) =>
                    vid.publicId === id ? { ...vid, status: "removing" } : vid
                )
            );

            const vidToRemove = uploadedVideos.find((vid) => vid.publicId === id);
            if (vidToRemove && vidToRemove.publicId) {
                await fetch("/api/destroy-cloudinary-image", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ publicIds: [vidToRemove.publicId] }),
                });
            }

            setUploadedVideos((prev) => prev.filter((vid) => vid.id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (uploadedVideos.length < minVideos) {
            setVideoError(`Please upload at least ${minVideos} item${minVideos > 1 ? 's' : ''}.`);
        } else {
            setVideoError("");
        }
    }, [uploadedVideos, minVideos]);

    return (
        <Box className="video-uploader w-full">
            <Typography fontWeight="bold">{label} (Min {minVideos}, Max {maxVideos})</Typography>
            <input
                ref={inputRef}
                type="file"
                accept={acceptType}
                multiple={maxVideos > 1}
                onChange={handleVideoChange}
                style={{ width: '100%', marginTop: 8 }}
                disabled={uploadedVideos.length >= maxVideos}
            />
            {videoError && (
                <Typography color="error" variant="body2">{videoError}</Typography>
            )}
            {uploadedVideos.length > 0 && (
                <Stack spacing={1} mt={1}>
                    {uploadedVideos.map((vid) => (
                        <div key={vid.id} style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "6px 10px",
                            backgroundColor: "#f5f5f5",
                            borderRadius: "6px",
                            flexWrap: 'wrap'
                        }}>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ width: '100%' }}>
                                {vid.status === "uploading" && (
                                    <Typography variant="body2">{vid.name} ({vid.progress}%)</Typography>
                                )}

                                {vid.status === "success" && (
                                    <Box sx={{ width: '100%', maxWidth: '300px' }}>
                                        {/* Render based on Type */}
                                        {vid.type === 'video' || vid.url.endsWith('.mp4') || vid.url.endsWith('.webm') ? (
                                            <video
                                                src={vid.url}
                                                controls
                                                style={{ width: '100%', borderRadius: 4 }}
                                            />
                                        ) : (
                                            <img
                                                src={vid.url}
                                                alt={vid.name}
                                                style={{ width: '100%', borderRadius: 4, maxHeight: '200px', objectFit: 'contain' }}
                                            />
                                        )}

                                        <Typography variant="caption" display="block">{vid.name}</Typography>
                                    </Box>
                                )}

                                {(vid.status === "error" || vid.status === "success") && (
                                    <Button
                                        onClick={() => handleRemoveVideo(vid.publicId)}
                                        variant="outlined"
                                        color="error"
                                        size="small"
                                        sx={{ marginLeft: 'auto' }}
                                    >
                                        Remove
                                    </Button>
                                )}
                            </Stack>
                        </div>
                    ))}
                </Stack>
            )}
        </Box>
    );
}

export default VideoUploader;
