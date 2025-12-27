"use client";
import Header from "@/app/admin/(DashboardLayout)/layout/header/Header";
import Sidebar from "@/app/admin/(DashboardLayout)/layout/sidebar/Sidebar";
import LoadingComponent from "@/components/atom/LoadingComponent";
import theme from "@/utils/theme";
import {
  Box,
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
        const res = await fetch("/api/get-orders?status=Cancelled", {
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
        console.error("some error in orders");
      }
    };

    fetchOrders();
    return () => {
      cancelPendingRequests();
    };
  }, [router]);
  // Fetch orders from DB
  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <MainWrapper className="mainwrapper">
      <Head>
        <title> Cancelled Orders - CHAMPION-CHOICE</title>
        <meta
          name="description"
          content="This page was design for only admin in which can Canclled proudcts here taekwondo unifomrs and other gears of martial arts!"
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
      />{" "}
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
                  title="Canclle Orders"
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
                              City
                            </Typography>
                          </TableCell>

                          <TableCell align="right">
                            <Typography color="textSecondary" variant="h6">
                              State
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orders.map((order) => (
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
                            <TableCell>
                              <Typography color="textSecondary" variant="h6">
                                {Object.keys(order.products).length}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography color="textSecondary" variant="h6">
                                Rs.{order.amount}/_
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="h6">{order.city}</Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="h6">
                                {order.state}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
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
            </Grid>{" "}
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
