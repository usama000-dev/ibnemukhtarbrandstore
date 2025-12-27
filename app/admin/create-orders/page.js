"use client";
import Header from "@/app/admin/(DashboardLayout)/layout/header/Header";
import Sidebar from "@/app/admin/(DashboardLayout)/layout/sidebar/Sidebar";
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

const MainWrapper = styled("div")(() => ({
  display: "flex",
  // minHeight: "100vh",
  width: "100%",
}));

const PageWrapper = styled("div")(() => ({
  display: "flex",
  flexGrow: 1,
  paddingBottom: "25px",
  flexDirection: "column",
  backgroundColor: "transparent",
}));

const Page = () => {
  const [form, setForm] = useState({
    email: "",
    name: "",
    size: "",
    color: "",
    city: "",
    slug: "",
    qty: "",
    productNumber: "",
    amount: "",
    address: "",
    phone: "",
  });

  const [images, setImages] = useState([]);
  const [imageError, setImageError] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(true);
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
          headers: {
            "Content-Type": "application/json",
          },
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
        toast.error("Some internal error occour :", {
          autoClose: 1000,
          closeOnClick: true,
          pauseOnHover: true,
        });
        console.error("faild to fetch use roll", error, {
          autoClose: 1000,
          closeOnClick: true,
          pauseOnHover: true,
        });
        router.push("/");
      }
    };
    fetchUserRoll();
  }, [router]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + images.length > 4) {
      toast.warning("Max 4 images allowed in total.", {
        autoClose: 1000,
        closeOnClick: true,
        pauseOnHover: true,
      });
      return;
    }

    setImages((prev) => [...prev, ...files]);
    setImageError("");
  };

  const handleRemoveImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (images.length < 1) {
      setImageError("At least one image is required.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));
    images.forEach((img) => formData.append("images", img));

    try {
      const res = await fetch("/api/addOrder", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Error:", data.error);
        toast.error(data.error || "Something went wrong!", {
          autoClose: 1000,
          closeOnClick: true,
          pauseOnHover: true,
        });
        setLoading(false);

        return;
      }
      if (res.ok) {
        // Reset form (optional)
        setForm({
          email: "",
          name: "",
          size: "",
          color: "",
          slug: "",
          qty: "",
          productNumber: "",
          amount: "",
          address: "",
          phone: "",
          city: "",
        });
        setImages([]);
        toast.success("Product Uploaded Successfully", {
          autoClose: 1000,
          closeOnClick: true,
          pauseOnHover: true,
        });
        setLoading(false);
      }
      toast.success("Order Created Successfully", {
        autoClose: 1000,
        closeOnClick: true,
        pauseOnHover: true,
      });
    } catch (error) {
      console.error("Submit error:", error);
      setLoading(false);

      toast.error("Upload failed!", {
        autoClose: 1000,
        closeOnClick: true,
        pauseOnHover: true,
      });
    }
  };

  return (
    <MainWrapper className="mainwrapper">
      <Head>
        <title> Create Orders - CHAMPION-CHOICE</title>
        <meta
          name="description"
          content="This page was design for only admin in which can Create Orders here taekwondo unifomrs and other gears of martial arts!"
        />
      </Head>

      <style jsx global>{`
        .footer,
        .header {
          display: none;
        }
      `}</style>
      {/* ------------------------------------------- */}
      {/* Main Wrapper */}
      {/* ------------------------------------------- */}
      <PageWrapper className="page-wrapper">
        {/* <Topbar /> */}

        {/* ------------------------------------------- */}
        {/* Sidebar */}
        {/* ------------------------------------------- */}

        <Sidebar />
        {/* ------------------------------------------- */}
        {/* PageContent */}
        {/* ------------------------------------------- */}
        <Box
          sx={{
            [theme.breakpoints.up("lg")]: {
              marginLeft: "270px",
            },
          }}
        >
          {/* ------------------------------------------- */}
          {/* Header */}
          {/* ------------------------------------------- */}
          <Header />
          <Container
            sx={{
              paddingTop: "20px",
              maxWidth: "1200px",
              minHeight: "calc(100vh - 240px)",
            }}
          >
            {/* ------------------------------------------- */}
            {/* Page Route */}
            {/* ------------------------------------------- */}
            <Box>
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
              <Grid item xs={12} lg={12}>
                <BaseCard title="Create Order">
                  <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <Stack spacing={3}>
                      <TextField
                        disabled={loading ? true : false}
                        name="email"
                        label="Email"
                        variant="outlined"
                        size="small"
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                      <TextField
                        disabled={loading ? true : false}
                        name="name"
                        label="Name"
                        variant="outlined"
                        size="small"
                        value={form.name}
                        onChange={handleChange}
                        required
                      />
                      <TextField
                        disabled={loading ? true : false}
                        name="address"
                        label="Address"
                        variant="outlined"
                        size="small"
                        multiline
                        rows={4}
                        value={form.address}
                        onChange={handleChange}
                        required
                      />
                      <TextField
                        disabled={loading ? true : false}
                        name="city"
                        label="City"
                        variant="outlined"
                        size="small"
                        value={form.city}
                        onChange={handleChange}
                        required
                      />
                      <TextField
                        disabled={loading ? true : false}
                        name="slug"
                        label="Slug(slug1,slug2...)"
                        variant="outlined"
                        size="small"
                        value={form.slug}
                        onChange={handleChange}
                      />
                      <TextField
                        disabled={loading ? true : false}
                        name="qty"
                        label="Quantity[slug1ofqty , slug2ofqty...]"
                        type="text"
                        variant="outlined"
                        size="small"
                        value={form.qty}
                        onChange={handleChange}
                      />
                      <TextField
                        disabled={loading ? true : false}
                        name="color"
                        label="Color(for product)"
                        variant="outlined"
                        size="small"
                        value={form.color}
                        onChange={handleChange}
                      />
                      <TextField
                        disabled={loading ? true : false}
                        name="size"
                        label="Size(for product)"
                        variant="outlined"
                        size="small"
                        value={form.size}
                        onChange={handleChange}
                      />
                      <TextField
                        disabled={loading ? true : false}
                        name="productNumber"
                        label="Product no.(110,220...)"
                        variant="outlined"
                        size="small"
                        value={form.productNumber}
                        onChange={handleChange}
                      />
                      <TextField
                        disabled={loading ? true : false}
                        name="amount"
                        label="Amount"
                        type="number"
                        variant="outlined"
                        size="small"
                        value={form.amount}
                        onChange={handleChange}
                        required
                      />

                      <TextField
                        disabled={loading ? true : false}
                        name="phone"
                        label="Phone"
                        variant="outlined"
                        size="small"
                        value={form.phone}
                        onChange={handleChange}
                        required
                      />

                      <div>
                        <Typography variant="body1" fontWeight="bold">
                          Upload Images (1 Required, Max 4)
                        </Typography>
                        <input
                          disabled={loading ? true : false}
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageChange}
                        />
                        {imageError && (
                          <Typography color="error" variant="body2">
                            {imageError}
                          </Typography>
                        )}

                        {/* Show uploaded image names with remove button */}
                        {images.length > 0 && (
                          <Stack spacing={1} mt={1}>
                            {images.map((img, index) => (
                              <div
                                key={index}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  padding: "6px 10px",
                                  backgroundColor: "#f5f5f5",
                                  borderRadius: "6px",
                                }}
                              >
                                <Typography variant="body2">
                                  {img.name}
                                </Typography>
                                <Button
                                  onClick={() => handleRemoveImage(index)}
                                  variant="outlined"
                                  color="error"
                                  size="small"
                                >
                                  Remove
                                </Button>
                              </div>
                            ))}
                          </Stack>
                        )}
                      </div>

                      <Button
                        loading={loading ? true : false}
                        type="submit"
                        color="primary"
                        variant="contained"
                      >
                        Submit
                      </Button>
                    </Stack>
                  </form>
                </BaseCard>
              </Grid>
            </Box>
            {/* ------------------------------------------- */}
            {/* End Page */}
            {/* ------------------------------------------- */}
          </Container>
          {/* ------------------------------------------- */}
          {/* Footer */}
          {/* ------------------------------------------- */}
          {/* <Footer /> */}
        </Box>
      </PageWrapper>
    </MainWrapper>
  );
};

export default Page;
