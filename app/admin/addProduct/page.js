"use client";
import Header from "@/app/admin/(DashboardLayout)/layout/header/Header";
import ProductVideo from "@/components/product/ProductVideo";
import Sidebar from "@/app/admin/(DashboardLayout)/layout/sidebar/Sidebar";
import LoadingComponent from "@/components/atom/LoadingComponent";
import TiptapEditor from "@/components/editor/TiptapEditor";
import theme from "@/utils/theme";
import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import BaseCard from "../(DashboardLayout)/components/shared/BaseCard";
import ImageUploader from "@/components/atom/ImageUploader";
import { cancelPendingRequests } from "@/services/api";

const MainWrapper = styled("div")(() => ({
  display: "flex",
  width: "100%",
  '@media (max-width: 900px)': {
    flexDirection: "column",
  },
}));

const PageWrapper = styled("div")(() => ({
  display: "flex",
  flexGrow: 1,
  paddingBottom: "25px",
  flexDirection: "column",
  backgroundColor: "transparent",
  minHeight: "100vh",
  '@media (max-width: 900px)': {
    paddingBottom: 0,
  },
}));

// Cloudinary config for products
const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/do58gkhav/upload"; // TODO: Replace <your_cloud_name> with your actual cloud name
const CLOUDINARY_UPLOAD_PRESET = "ml_default"; // TODO: Replace with your unsigned upload preset

const Page = () => {
  const [form, setForm] = useState({
    title: "",
    slug: "",
    disc: "",
    size: "",
    category: "",
    color: "",
    price: "",
    availability: "",
    flashPrice: "",
    flashStart: "",
    flashEnd: "",
    discountPercent: "",
    tags: "",
    videoUrl: "",
    // New e-commerce fields
    trackingLink: "",
    weight: "",
    dimensionLength: "",
    dimensionWidth: "",
    dimensionHeight: "",
    brand: "Ibnemukhtar",
    material: "",
    careInstructions: "",
    warranty: "",
    sku: "",
    condition: "New",
  });

  const [uploadedImages, setUploadedImages] = useState([]); // [{ url, publicId, status, progress, error }]
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false); // <-- new state for success message
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
    }
    const fetchUserRoll = async () => {
      try {
        const res = await fetch("/api/get-user", {
          method: "POST",
          body: JSON.stringify({ token }),
          headers: { "Content-Type": "application/json" },
        });
        const result = await res.json();
        if (result.error === "Token expired") {
          toast.warn("Your session expired, login again", {
            autoClose: 1000,
            closeOnClick: true,
            pauseOnHover: true,
          });
          return;
        }
        if (result.user.roll !== "admin") {
          router.push("/");
        }
        setLoading(false);
      } catch (error) {
        toast.error("Some internal error occurred", {
          autoClose: 1000,
          closeOnClick: true,
          pauseOnHover: true,
        });
        console.error("Failed to fetch user role", error);
        router.push("/");
      }
    };
    fetchUserRoll();
    return () => {
      cancelPendingRequests();
    };
  }, [router]);

  if (loading) return <LoadingComponent />;
  if (success) {
    return (
      <MainWrapper>
        <Head>
          <title>Add Products - CHAMPION-CHOICE</title>
        </Head>
        <ToastContainer position="bottom-left" autoClose={1000} />
        <PageWrapper>
          <div className="admin-sidebar">
            <Sidebar />
          </div>
          <Container
            sx={{
              paddingTop: { xs: "10px", md: "20px" },
              maxWidth: "1200px",
              minHeight: { xs: "auto", md: "calc(100vh - 240px)" },
              px: { xs: 1, sm: 2, md: 3 },
              ml: { lg: "0px" }, // align beside the sidebar on large screens
              width: { lg: "calc(100% - 270px)", xs: "100%" }, // full width minus sidebar on lg
            }}
          >
            <Box
              sx={{
                [theme.breakpoints.up("lg")]: {
                  marginLeft: "270px",
                },
                [theme.breakpoints.down("lg")]: {
                  marginLeft: 0,
                },
                width: '100%',
              }}
            >
              <Header />
              <Container
                sx={{
                  paddingTop: { xs: "10px", md: "20px" },
                  maxWidth: "1200px",
                  minHeight: { xs: "auto", md: "calc(100vh - 240px)" },
                  px: { xs: 1, sm: 2, md: 3 },
                }}
              >
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                  <BaseCard title="Success!">
                    <Typography variant="h5" color="success.main" align="center" mb={2}>
                      Product Uploaded Successfully!
                    </Typography>
                    <Button variant="contained" color="primary" onClick={() => setSuccess(false)}>
                      Add Another Product
                    </Button>
                  </BaseCard>
                </Box>
              </Container>
            </Box>
          </Container>
        </PageWrapper>
      </MainWrapper>
    );
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditorChange = (content) => {
    setForm({ ...form, disc: content });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (uploadedImages.length < 1 || uploadedImages.some(img => img.status !== "success")) {
      toast.error("Please upload at least one image successfully.", { autoClose: 1000 });
      return;
    }
    setBtnLoading(true);
    const cleanForm = {
      ...form,
      tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      images: uploadedImages.map(img => img.url),
    };
    try {
      const res = await fetch("/api/addProduct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanForm),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Something went wrong!", { autoClose: 1000 });
        // Cleanup: delete all uploaded images
        const publicIds = uploadedImages.map(img => img.publicId).filter(Boolean);
        if (publicIds.length) {
          await fetch("/api/destroy-cloudinary-image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ publicIds }),
          });
        }
      } else {
        setForm({
          title: "",
          slug: "",
          disc: "",
          size: "",
          category: "",
          color: "",
          price: "",
          availability: "",
          flashPrice: "",
          flashStart: "",
          flashEnd: "",
          discountPercent: "",
          tags: "",
          videoUrl: "",
          trackingLink: "",
          weight: "",
          dimensionLength: "",
          dimensionWidth: "",
          dimensionHeight: "",
          brand: "Ibnemukhtar",
          material: "",
          careInstructions: "",
          warranty: "",
          sku: "",
          condition: "New",
        });
        setUploadedImages([]);
        setSuccess(true); // <-- show success message
        // console.log("Product Uploaded Successfully",success);
        toast.success("Product Uploaded Successfully", { autoClose: 1000 });
      }
    } catch (error) {
      toast.error("Upload failed!", { autoClose: 1000 });
    }
    setBtnLoading(false);
  };

  return (
    <MainWrapper>
      <Head>
        <title>Add Products - CHAMPION-CHOICE</title>
        <meta
          name="description"
          content="This page is for admin to add taekwondo uniforms and martial arts gear."
        />
      </Head>
      <ToastContainer position="bottom-left" autoClose={1000} />
      <style jsx global>{`
        .footer,
        .header {
          display: none;
        }
        @media (max-width: 900px) {
          .admin-sidebar {
            display: none !important;
          }
        }
      `}</style>

      <PageWrapper>
        <div className="admin-sidebar">
          <Sidebar />
        </div>
        <Box
          sx={{
            [theme.breakpoints.up("lg")]: {
              marginLeft: "100px",
            },
            [theme.breakpoints.down("lg")]: {
              marginLeft: 0,
            },
            width: '100%',
          }}
        >
          <Header />
          <Container
            sx={{
              paddingTop: { xs: "10px", md: "20px" },
              maxWidth: "1200px",
              minHeight: { xs: "auto", md: "calc(100vh - 240px)" },
              px: { xs: 1, sm: 2, md: 3 },
              ml: { lg: "160px" }, // align beside the sidebar on large screens
              width: { lg: "calc(100% - 270px)", xs: "100%" }, // full width minus sidebar on lg
            }}
          >
            <Box>
              <Grid item xs={12} lg={12}>
                <BaseCard title="Add Product">
                  <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <Stack spacing={3}>
                      {/* Basic Fields */}
                      <TextField name="title" label="Product Title" size="small" required value={form.title} onChange={handleChange} fullWidth />
                      <TextField name="slug" label="Slug" size="small" required value={form.slug} onChange={handleChange} fullWidth />
                      <div>
                        <Typography fontWeight="bold" mb={1}>Product Description (Rich Text Editor)</Typography>
                        <TiptapEditor content={form.disc} onChange={handleEditorChange} />
                      </div>
                      <TextField name="size" label="Size" size="small" value={form.size} onChange={handleChange} fullWidth />
                      <TextField name="category" label="Category" size="small" required value={form.category} onChange={handleChange} fullWidth />
                      <TextField name="color" label="Color" size="small" value={form.color} onChange={handleChange} fullWidth />
                      <TextField name="price" label="Price" type="number" size="small" required value={form.price} onChange={handleChange} fullWidth />
                      <TextField name="availability" label="Availability" type="number" size="small" required value={form.availability} onChange={handleChange} fullWidth />

                      {/* New Fields */}
                      <TextField name="flashPrice" label="Flash Price" type="number" size="small" value={form.flashPrice} onChange={handleChange} fullWidth />
                      <TextField name="flashStart" label="Flash Start" type="datetime-local" size="small" value={form.flashStart} onChange={handleChange} InputLabelProps={{ shrink: true }} fullWidth />
                      <TextField name="flashEnd" label="Flash End" type="datetime-local" size="small" value={form.flashEnd} onChange={handleChange} InputLabelProps={{ shrink: true }} fullWidth />
                      <TextField name="discountPercent" label="Discount %" type="number" size="small" value={form.discountPercent} onChange={handleChange} fullWidth />
                      <TextField name="tags" label="Tags (comma separated)" size="small" value={form.tags} onChange={handleChange} fullWidth />

                      {/* Video URL Input with Preview */}
                      <Box>
                        <TextField
                          name="videoUrl"
                          label="YouTube Video URL (Optional)"
                          size="small"
                          value={form.videoUrl || ''}
                          onChange={handleChange}
                          fullWidth
                          placeholder="e.g., https://www.youtube.com/watch?v=..."
                          helperText="Paste a YouTube link to show a video on the product card."
                        />
                        {form.videoUrl && (
                          <Box sx={{ mt: 2, maxWidth: '300px' }}>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>Video Preview:</Typography>
                            <ProductVideo videoUrl={form.videoUrl} autoplay={false} />
                          </Box>
                        )}
                      </Box>

                      {/* E-commerce & Shipping Fields */}
                      <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 'bold', color: 'primary.main' }}>
                        E-commerce & Shipping Information
                      </Typography>

                      <TextField
                        name="trackingLink"
                        label="Tracking Link (Optional)"
                        size="small"
                        value={form.trackingLink}
                        onChange={handleChange}
                        fullWidth
                        placeholder="https://tracking.com/order/123"
                        helperText="Add tracking URL for shipped orders"
                      />

                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="weight"
                            label="Weight (grams)"
                            type="number"
                            size="small"
                            value={form.weight}
                            onChange={handleChange}
                            fullWidth
                            placeholder="500"
                            helperText="Product weight for shipping"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="sku"
                            label="SKU (Stock Keeping Unit)"
                            size="small"
                            value={form.sku}
                            onChange={handleChange}
                            fullWidth
                            placeholder="JKT-001-BLK-L"
                            helperText="Unique product identifier"
                          />
                        </Grid>
                      </Grid>

                      <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Dimensions (cm)</Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <TextField
                            name="dimensionLength"
                            label="Length"
                            type="number"
                            size="small"
                            value={form.dimensionLength}
                            onChange={handleChange}
                            fullWidth
                            placeholder="30"
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <TextField
                            name="dimensionWidth"
                            label="Width"
                            type="number"
                            size="small"
                            value={form.dimensionWidth}
                            onChange={handleChange}
                            fullWidth
                            placeholder="20"
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <TextField
                            name="dimensionHeight"
                            label="Height"
                            type="number"
                            size="small"
                            value={form.dimensionHeight}
                            onChange={handleChange}
                            fullWidth
                            placeholder="5"
                          />
                        </Grid>
                      </Grid>

                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="brand"
                            label="Brand"
                            size="small"
                            value={form.brand}
                            onChange={handleChange}
                            fullWidth
                            placeholder="Ibnemukhtar"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="material"
                            label="Material"
                            size="small"
                            value={form.material}
                            onChange={handleChange}
                            fullWidth
                            placeholder="Leather, Denim, Cotton"
                          />
                        </Grid>
                      </Grid>

                      <TextField
                        name="careInstructions"
                        label="Care Instructions"
                        size="small"
                        value={form.careInstructions}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        rows={2}
                        placeholder="Machine wash cold, tumble dry low"
                      />

                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="warranty"
                            label="Warranty"
                            size="small"
                            value={form.warranty}
                            onChange={handleChange}
                            fullWidth
                            placeholder="6 months warranty"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="condition"
                            label="Condition"
                            size="small"
                            value={form.condition}
                            onChange={handleChange}
                            fullWidth
                            select
                            SelectProps={{ native: true }}
                          >
                            <option value="New">New</option>
                            <option value="Pre-loved">Pre-loved</option>
                            <option value="Refurbished">Refurbished</option>
                          </TextField>
                        </Grid>
                      </Grid>

                      {/* Images */}
                      <ImageUploader
                        maxImages={4}
                        minImages={1}
                        onChange={setUploadedImages}
                        initialImages={[]}
                        folder="products" // ya "uniforms"
                        uploadPreset="ml_default" // ya jo bhi aapka preset ho
                      />

                      <Button type="submit" color="primary" variant="contained" fullWidth sx={{ py: 1.5, fontSize: { xs: '1rem', sm: '1.1rem' } }}>Submit</Button>
                    </Stack>
                  </form>
                </BaseCard>
              </Grid>
            </Box>
          </Container>
        </Box>
      </PageWrapper>
    </MainWrapper>
  );
};

export default Page;
