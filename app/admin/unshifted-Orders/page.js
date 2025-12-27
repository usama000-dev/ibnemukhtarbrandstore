"use client";
import Header from "@/app/admin/(DashboardLayout)/layout/header/Header";
import Sidebar from "@/app/admin/(DashboardLayout)/layout/sidebar/Sidebar";
import LoadingComponent from "@/components/atom/LoadingComponent";
import theme from "@/utils/theme";
import {
  Box,
  Button,
  Container,
  Grid,
  MenuItem,
  Pagination,
  Select,
  Stack,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import BaseCard from "../(DashboardLayout)/components/shared/BaseCard";
import { cancelPendingRequests } from "@/services/api";
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
  const router = useRouter();
  const [month, setMonth] = useState("1");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState("");

  const handleChange = (e) => {
    setMonth(e.target.value);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.warn("Sorry! you are not eligable access this page", {
        position: "bottom-left",
        autoClose: 1000,
        closeOnClick: true,
        pauseOnHover: true,
      });
      setLoading(false);

      return;
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
            position: "bottom-left",
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
          position: "bottom-left",
          autoClose: 1000,
          closeOnClick: true,
          pauseOnHover: true,
        });
        console.error("faild to fetch use roll", error);
      }
    };
    fetchUserRoll();
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/get-orders?deliveryStatus=unshifted", {
          method: "POST",
          body: JSON.stringify({ token }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = res.json();

        result
          .then((res) => {
            setOrders(res.orders);
            toast.success("Orders get successfully !", {
              position: "bottom-left",
              autoClose: 1000,
              closeOnClick: true,
              pauseOnHover: true,
            });
          })
          .catch((err) => {
            console.error(err);
            toast.error(err.error || "some error from server", {
              position: "bottom-left",
              autoClose: 1000,
              closeOnClick: true,
              pauseOnHover: true,
            });
          });
      } catch (error) {
        console.error("some error in orders", error);
        return;
      }
    };

    fetchOrders();
    return () => {
      cancelPendingRequests();
    };
  }, [router]);
  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      if (!(file instanceof Blob)) {
        return reject(new Error("Provided value is not a file or blob"));
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
  };

  // console.log("Image file being passed: ", image); // 👈 Add this

  const updateStatus = async (orderId, deliveryStatus) => {
    if (!image) {
      console.error("❌ No image file selected");
      toast.error("Please select an image before updating status");
      return;
    }
    // console.log("✅ Image type:", typeof image);
    // console.log("✅ Is Blob:", image instanceof Blob);

    const base64Image = await toBase64(image); // convert file to base64
    const formData = {
      deliveryStatus,
      orderId: orderId, // use real ID
      image: base64Image,
    };
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/update-status?deliveryStatus=delivering`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            formData,
          }),
        }
      );

      const result = await res.json();

      if (res.ok) {
        toast.success("Order Status Updated", {
          position: "bottom-left",
          autoClose: 1000,
          closeOnClick: true,
          pauseOnHover: true,
        });
        setOrders(result);
        // optionally show success toast or update state
      } else {
        toast.error("Sorry Order not Updated", {
          position: "bottom-left",
          autoClose: 1000,
          closeOnClick: true,
          pauseOnHover: true,
        });
      }
    } catch (error) {
      // console.error("🚨 Error in updateStatus:", error);
      toast.error("Sorry Order not Updated", {
        position: "bottom-left",
        autoClose: 1000,
        closeOnClick: true,
        pauseOnHover: true,
      });
    }
  };

  // Fetch orders from DB
  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <MainWrapper className="mainwrapper">
      <Head>
        <title> Pending Orders - CHAMPION-CHOICE</title>
        <meta
          name="description"
          content="This page was design for only admin in which can Pending orders of  proudcts here taekwondo unifomrs and other gears of martial arts!"
        />
      </Head>
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
            <Grid container spacing={0}>
              <Grid
                size={{
                  xs: 12,
                  lg: 12,
                }}
              >
                <BaseCard
                  title="Unshifted Orders"
                  action={
                    <Select
                      labelId="month-dd"
                      id="month-dd"
                      value={month}
                      size="small"
                      onChange={handleChange}
                    >
                      <MenuItem value={1}>March 2025</MenuItem>
                      <MenuItem value={2}>April 2025</MenuItem>
                      <MenuItem value={3}>May 2025</MenuItem>
                    </Select>
                  }
                >
                  <TableContainer
                    sx={{
                      width: {
                        xs: "274px",
                        sm: "100%",
                      },
                    }}
                  >
                    <Table
                      aria-label="simple table"
                      sx={{
                        whiteSpace: "nowrap",
                        mt: 2,
                      }}
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <Typography color="textSecondary" variant="h6">
                              Order-Id
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography color="textSecondary" variant="h6">
                              Name
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography color="textSecondary" variant="h6">
                              Products
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography color="textSecondary" variant="h6">
                              Amount
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography color="textSecondary" variant="h6">
                              Voucher
                            </Typography>
                          </TableCell>

                          <TableCell align="center">
                            <Typography color="textSecondary" variant="h6">
                              Delivery Status
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orders.length > 0 ? (
                          orders.map((order) => (
                            <TableRow key={order._id}>
                              <TableCell>
                                <Typography fontSize="15px" fontWeight={500}>
                                  {order.orderId}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Box display="flex" alignItems="center">
                                  <Box>
                                    <Typography variant="h6" fontWeight={600}>
                                      {order.name}
                                    </Typography>
                                    <Typography
                                      color="textSecondary"
                                      fontSize="13px"
                                    >
                                      {order.status}
                                    </Typography>
                                  </Box>
                                </Box>
                              </TableCell>
                              <TableCell align="center">
                                <Typography color="textSecondary" variant="h6">
                                  {Object.keys(order.products).length}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography color="textSecondary" variant="h6">
                                  Rs.{order.amount}/_
                                </Typography>
                              </TableCell>
                              <TableCell align="center">
                                <input
                                  type="file"
                                  accept="image/*"
                                  required
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    console.log("Selected file:", file);
                                    if (file instanceof Blob) {
                                      setImage(file);
                                    } else {
                                      console.error("Invalid file selected");
                                    }
                                  }}
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Button
                                  color="primary"
                                  variant="contained"
                                  onClick={() =>
                                    updateStatus(order.orderId, "delivering")
                                  }
                                >
                                  Delivering
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell>
                              <Typography color="textSecondary" variant="h6">
                                no such data available
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </BaseCard>
                <Grid
                  size={{
                    xs: 12,
                    lg: 12,
                  }}
                >
                  {/* <BaseCard title="Squred Paginations"> */}
                  <Stack
                    className="flex items-center justify-center my-4"
                    spacing={2}
                  >
                    <Pagination count={10} shape="rounded" variant="outlined" />
                  </Stack>
                  {/* </BaseCard> */}
                </Grid>
              </Grid>
            </Grid>
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
