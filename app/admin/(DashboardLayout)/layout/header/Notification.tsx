import { cancelPendingRequests } from "@/services/api";
import { Badge, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { IconBell } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

export default function Notification() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [orders, setOrders] = useState([]);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const fetchPendigOrders = async () => {
    try {
      const res = await fetch("/api/get-confirm-order", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await res.json();
      if (result.proofs) {
        setOrders(result.proofs);
      }
    } catch (error) {
      console.error("some error in pinding orders");
    }
  };

  useEffect(() => {
    fetchPendigOrders();
    if (orders.length > 0) toast.success("Some Orders Pending !", {
      position: "bottom-left",
      autoClose: 1000,
      closeOnClick: true,
      pauseOnHover: true,
    });
    return () => {
      cancelPendingRequests();
    };
  }, [orders.length]);

  return (
    <>
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
      <IconButton
        aria-label="show 4 new mails"
        color="inherit"
        aria-controls="notification-menu"
        aria-haspopup="true"
        onClick={handleClick}
        size="large"
      >
        <Badge variant={orders.length > 0 ? "dot" : "standard"} color="primary">
          <IconBell size="21" stroke="1.5" />
        </Badge>
      </IconButton>
      <Menu
        id="notification-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {orders.length > 0 && (
          <Link href={"/admin/order-confirm"}>
            <MenuItem onClick={handleClose}>
              <Typography variant="body2">Order Confirm</Typography>
            </MenuItem>
          </Link>
        )}
        {orders.length == 0 && (
          <Link href={"/admin/order-confirm"}>
          <MenuItem onClick={handleClose}>
            <Typography variant="body2">Visit Confirm Orders</Typography>
          </MenuItem>
        </Link>
        )}
      </Menu>
    </>
  );
}
