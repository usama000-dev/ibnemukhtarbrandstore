"use client";
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Switch, 
  Button, 
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton,
  Tooltip
} from "@mui/material";
import { 
  IconEdit, 
  IconEye, 
  IconStar, 
  IconFlame,
  IconDiscount,
  IconPackage
} from "@tabler/icons-react";
import Image from "next/image";
import { toast } from "react-toastify";
import { cancelPendingRequests } from "@/services/api";

export default function ManageProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [editDialog, setEditDialog] = useState({ open: false, product: null });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProducts();
    return () => {
      cancelPendingRequests();
    };
  }, [selectedStatus, selectedCategory, page]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const baseUrl = process.env.NEXT_PUBLIC_HOST || 'http://localhost:3001';
      
      let url = `${baseUrl}/api/products/manage-status?page=${page}&limit=20`;
      if (selectedStatus !== "all") url += `&status=${selectedStatus}`;
      if (selectedCategory !== "all") url += `&category=${selectedCategory}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (response.ok) {
        setProducts(data.products);
        setTotalPages(data.totalPages);
      } else {
        toast.error("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Error fetching products");
    } finally {
      setLoading(false);
    }
  };

  const updateProductStatus = async (productId, updates) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_HOST || 'http://localhost:3001';
      const response = await fetch(`${baseUrl}/api/products/manage-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, updates }),
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success("Product updated successfully!");
        fetchProducts(); // Refresh the list
        setEditDialog({ open: false, product: null });
      } else {
        toast.error(data.error || "Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Error updating product");
    }
  };

  const handleStatusToggle = (productId, field, currentValue) => {
    updateProductStatus(productId, { [field]: !currentValue });
  };

  const handleEditProduct = (product) => {
    setEditDialog({ open: true, product });
  };

  const handleSaveEdit = () => {
    const { product } = editDialog;
    const updates = {
      featured: product.featured,
      popular: product.popular,
      availability: product.availability,
      flashPrice: product.flashPrice,
      flashStart: product.flashStart,
      flashEnd: product.flashEnd,
      discountPercent: product.discountPercent,
    };
    
    updateProductStatus(product._id, updates);
  };

  const getStatusChips = (product) => {
    const chips = [];
    
    if (product.featured) {
      chips.push(<Chip key="featured" icon={<IconStar size={16} />} label="Featured" color="primary" size="small" />);
    }
    
    if (product.popular) {
      chips.push(<Chip key="popular" icon={<IconFlame size={16} />} label="Popular" color="secondary" size="small" />);
    }
    
    if (product.flashEnd && new Date(product.flashEnd) > new Date()) {
      chips.push(<Chip key="flash" icon={<IconDiscount size={16} />} label="Flash Sale" color="error" size="small" />);
    }
    
    if (product.availability < 10) {
      chips.push(<Chip key="low-stock" icon={<IconPackage size={16} />} label="Low Stock" color="warning" size="small" />);
    }
    
    return chips;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateTitle = (title, maxLength = 40) => {
    return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
  };

  if (loading) {
    return (
      <div className="p-6">
        <Typography variant="h4" gutterBottom>Loading...</Typography>
      </div>
    );
  }

  return (
    <div className="p-6 mt-20 md:mt-0">
      <Box sx={{ display: 'flex', flexWrap:'wrap', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Manage Products
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="contained" 
            color="primary"
            href="/admin/addProduct"
            sx={{ textDecoration: 'none' }}
          >
            Add New Product
          </Button>
          <Button 
            variant="outlined" 
            color="primary"
            href="/admin/allProducts"
            sx={{ textDecoration: 'none' }}
          >
            View All Products
          </Button>
        </Box>
      </Box>
      
      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Status Filter</InputLabel>
                <Select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  label="Status Filter"
                >
                  <MenuItem value="all">All Products</MenuItem>
                  <MenuItem value="featured">Featured</MenuItem>
                  <MenuItem value="flash">Flash Sale</MenuItem>
                  <MenuItem value="low-stock">Low Stock</MenuItem>
                  <MenuItem value="out-of-stock">Out of Stock</MenuItem>
                  <MenuItem value="popular">Popular</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Category Filter</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  label="Category Filter"
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  <MenuItem value="tshirts">T-Shirts</MenuItem>
                  <MenuItem value="hoodies">Hoodies</MenuItem>
                  <MenuItem value="mugs">Mugs</MenuItem>
                  <MenuItem value="stickers">Stickers</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button 
                variant="contained" 
                onClick={fetchProducts}
                fullWidth
              >
                Refresh
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Products List */}
      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid item xs={12} md={6} lg={4} key={product._id}>
            <Card>
              <CardContent>
                {/* Product Image */}
                <Box sx={{ position: 'relative', height: 200, mb: 2 }}>
                  {product.images && product.images[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      fill
                      style={{ objectFit: 'cover', borderRadius: 8 }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#e0e0e0',
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Typography color="textSecondary">No Image</Typography>
                    </Box>
                  )}
                </Box>

                {/* Product Title */}
                <Typography variant="h6" gutterBottom>
                  {truncateTitle(product.title)}
                </Typography>

                {/* Status Chips */}
                <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {getStatusChips(product)}
                </Box>

                {/* Quick Stats */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Price: Rs. {product.price}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Stock: {product.availability}
                  </Typography>
                  {product.flashPrice && (
                    <Typography variant="body2" color="error">
                      Flash Price: Rs. {product.flashPrice}
                    </Typography>
                  )}
                </Box>

                {/* Quick Toggles */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Featured</Typography>
                    <Switch
                      checked={product.featured}
                      onChange={() => handleStatusToggle(product._id, 'featured', product.featured)}
                      size="small"
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Popular</Typography>
                    <Switch
                      checked={product.popular}
                      onChange={() => handleStatusToggle(product._id, 'popular', product.popular)}
                      size="small"
                    />
                  </Box>
                </Box>

                {/* Actions */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Edit Details">
                    <IconButton 
                      size="small" 
                      onClick={() => handleEditProduct(product)}
                      color="primary"
                    >
                      <IconEdit size={16} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="View Product">
                    <IconButton 
                      size="small" 
                      href={`/product/${product.slug}`}
                      target="_blank"
                      color="info"
                    >
                      <IconEye size={16} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            sx={{ mr: 1 }}
          >
            Previous
          </Button>
          <Typography sx={{ mx: 2, alignSelf: 'center' }}>
            Page {page} of {totalPages}
          </Typography>
          <Button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            sx={{ ml: 1 }}
          >
            Next
          </Button>
        </Box>
      )}

      {/* Edit Dialog */}
      <Dialog 
        open={editDialog.open} 
        onClose={() => setEditDialog({ open: false, product: null })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Product: {editDialog.product?.title}</DialogTitle>
        <DialogContent>
          {editDialog.product && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Stock Availability"
                  type="number"
                  value={editDialog.product.availability}
                  onChange={(e) => setEditDialog({
                    ...editDialog,
                    product: { ...editDialog.product, availability: parseInt(e.target.value) }
                  })}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Discount Percent"
                  type="number"
                  value={editDialog.product.discountPercent || 0}
                  onChange={(e) => setEditDialog({
                    ...editDialog,
                    product: { ...editDialog.product, discountPercent: parseInt(e.target.value) }
                  })}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Flash Price"
                  type="number"
                  value={editDialog.product.flashPrice || ''}
                  onChange={(e) => setEditDialog({
                    ...editDialog,
                    product: { ...editDialog.product, flashPrice: e.target.value ? parseFloat(e.target.value) : null }
                  })}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Flash Sale Start"
                  type="datetime-local"
                  value={editDialog.product.flashStart ? new Date(editDialog.product.flashStart).toISOString().slice(0, 16) : ''}
                  onChange={(e) => setEditDialog({
                    ...editDialog,
                    product: { ...editDialog.product, flashStart: e.target.value ? new Date(e.target.value) : null }
                  })}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Flash Sale End"
                  type="datetime-local"
                  value={editDialog.product.flashEnd ? new Date(editDialog.product.flashEnd).toISOString().slice(0, 16) : ''}
                  onChange={(e) => setEditDialog({
                    ...editDialog,
                    product: { ...editDialog.product, flashEnd: e.target.value ? new Date(e.target.value) : null }
                  })}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ mr: 1 }}>Featured:</Typography>
                    <Switch
                      checked={editDialog.product.featured}
                      onChange={(e) => setEditDialog({
                        ...editDialog,
                        product: { ...editDialog.product, featured: e.target.checked }
                      })}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ mr: 1 }}>Popular:</Typography>
                    <Switch
                      checked={editDialog.product.popular}
                      onChange={(e) => setEditDialog({
                        ...editDialog,
                        product: { ...editDialog.product, popular: e.target.checked }
                      })}
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog({ open: false, product: null })}>
            Cancel
          </Button>
          <Button onClick={handleSaveEdit} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
} 