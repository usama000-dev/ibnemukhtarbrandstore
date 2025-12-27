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
  Select,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import BaseCard from "../(DashboardLayout)/components/shared/BaseCard";
import LoginModal from "@/components/molecules/LoginModal";
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
  const [month, setMonth] = useState("1");

  const handleChange = (e) => {
    setMonth(e.target.value);
  };
  const [users, setUsers] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warn("Sorry! you are not eligable access this page", {
        autoClose: 1000,
        closeOnClick: true,
        pauseOnHover: true,
      });
      setShowLogin(true);
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
            autoClose: 1000,
            closeOnClick: true,
            pauseOnHover: true,
          });
          return;
        }
        console.log(result, "fetchuser");

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
        console.error("faild to fetch use roll", error);
        // router.push('/')
      }
    };
    fetchUserRoll();
    (async () => {
      try {
        const res = await fetch("/api/get-users", {
          method: "POST",
          body: JSON.stringify({ token }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await res.json();
        if (result.error === "Token expired") {
          toast.warn("Your session expired, please login again", {
            autoClose: 1000,
            closeOnClick: true,
            pauseOnHover: true,
          });
          return;
        }
        // console.log(result);
        setUsers(result.users); // <- Just use the actual array
      } catch (error) {
        console.log("Error : ", error);
      }
    })();

    setLoading(false);
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
        <title> All Users - CHAMPION-CHOICE</title>
        <meta 
          name="description" 
          content="This page was design for only admin in which can you can see all users who signup in website for all analyzing best of luck " 
        />
      </Head>
      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
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
      <PageWrapper className="page-wrapper">
        <Sidebar />
        <Box
          sx={{
            [theme.breakpoints.up("lg")]: {
              marginLeft: "270px",
            },
          }}
        >
          <Header />
          <Container
            sx={{
              paddingTop: "20px",
              maxWidth: "1200px",
              minHeight: "calc(100vh - 240px)",
            }}
          >
            <Grid container spacing={0}>
              <Grid
                size={{
                  xs: 12,
                  lg: 12,
                }}
              >
                <BaseCard
                  title="All users"
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
                              Name
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography color="textSecondary" variant="h6">
                              Email
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography color="textSecondary" variant="h6">
                              City
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography color="textSecondary" variant="h6">
                              State
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography color="textSecondary" variant="h6">
                              Address
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user._id}>
                            <TableCell>
                              <Box display="flex" alignItems="center">
                                <Box>
                                  <Typography variant="h6" fontWeight={600}>
                                    {user.name?.toUpperCase()}
                                  </Typography>
                                  <Typography
                                    color="textSecondary"
                                    fontSize="13px"
                                  >
                                    {user.phone}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography fontSize="15px" fontWeight={500}>
                                {user.email}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography color="textSecondary" variant="h6">
                                {user.city}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="h6">{user.state}</Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="h6">
                                {user.address}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </BaseCard>
              </Grid>
            </Grid>{" "}
          </Container>
        </Box>
      </PageWrapper>
    </MainWrapper>
  );
}

export default Page;
