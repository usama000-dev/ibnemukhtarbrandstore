import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Typography,
  Button,
  Modal,
} from '@mui/material';
import { useEffect, useState } from 'react';
import CouponForm from './CouponForm';
import { toast } from 'react-toastify';
import { cancelPendingRequests } from '@/services/api';

const CouponDetails = ({ coupons: initialCoupons }) => {
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [open, setOpen] = useState(false);
  const [coupons, setCoupons] = useState(Array.isArray(initialCoupons) ? initialCoupons : []);

  // Sync local coupons state with parent prop
  useEffect(() => {
    setCoupons(Array.isArray(initialCoupons) ? initialCoupons : []);
    return () => {
      cancelPendingRequests();
    };
  }, [initialCoupons]);

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setOpen(true);
  };

  const handleClose = () => {
    setEditingCoupon(null);
    setOpen(false);
  };

  // Refresh coupons after edit
  const handleEditSuccess = async () => {
    // Optionally, fetch updated coupons from API
    try {
      const res = await fetch('/api/admin/all-coupons');
      const data = await res.json();
      setCoupons(Array.isArray(data) ? data : []);
      toast.success('Coupon updated successfully!');
    } catch (e) {
      // fallback: do nothing
    }
    setOpen(false);
    setEditingCoupon(null);
  };

  // Delete coupon
  const handleDelete = async (coupon) => {
    if (!window.confirm(`Are you sure you want to delete coupon "${coupon.code}"?`)) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/coupons/${coupon._id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      if (res.ok) {
        toast.success('Coupon deleted successfully!');
        // Refresh list
        const updated = coupons.filter(c => c._id !== coupon._id);
        setCoupons(updated);
      } else {
        const data = await res.json();
        toast.error(data.error || data.message || 'Failed to delete coupon');
      }
    } catch (e) {
      toast.error('Failed to delete coupon');
    }
  };

  if (!coupons || coupons.length === 0) {
    console.log("coupons: ",coupons);
    
    return (
      <Typography variant="h6" align="center" color="textSecondary">
        No coupons available.
      </Typography>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom align="center">
        Coupon Details
      </Typography>

      <Grid container spacing={3}>
        {coupons.map((coupon) => (
          <Grid item xs={12} md={6} lg={4} key={coupon._id}>
            <Card variant="outlined">
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" color="primary">
                    {coupon.title}
                  </Typography>
                  <Chip label={`${coupon.discountValue}% OFF`} color="success" />
                </Box>

                <Typography variant="body1" sx={{ mt: 1 }}>
                  <strong>Code:</strong> {coupon.code}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {coupon.description}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Valid Until:</strong>{' '}
                  {new Date(coupon.validUntil).toLocaleDateString()}
                </Typography>
                <Typography variant="body2">
                  <strong>Minimum Order:</strong> Rs. {coupon.minOrderAmount}
                </Typography>
                <Typography variant="body2">
                  <strong>Usage Limit:</strong> {coupon.maxUses}
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  sx={{ mt: 2, mr: 1 }}
                  onClick={() => handleEdit(coupon)}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  sx={{ mt: 2 }}
                  onClick={() => handleDelete(coupon)}
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            minWidth: 350,
            maxWidth: 500,
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
        >
          {editingCoupon && (
            <CouponForm initialData={editingCoupon} onSuccess={handleEditSuccess} />
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default CouponDetails;
