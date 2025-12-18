import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  Avatar,
  IconButton,
} from "@mui/material";
import { Close, CloudUpload } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { Product } from "../../app/models/product";
import { useCreateProductMutation, useUpdateProductMutation } from "./adminApi";
import { toast } from "react-toastify";

interface Props {
  open: boolean;
  onClose: () => void;
  product?: Product;
}

export default function ProductForm({ open, onClose, product }: Props) {
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    pictureUrl: "",
    type: "",
    brand: "",
    quantityInStock: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: (product.price / 100).toString(),
        pictureUrl: product.pictureUrl,
        type: product.type,
        brand: product.brand,
        quantityInStock: product.quantityInStock.toString(),
      });
      setImagePreview(product.pictureUrl);
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        pictureUrl: "",
        type: "",
        brand: "",
        quantityInStock: "",
      });
      setImagePreview("");
      setImageFile(null);
    }
  }, [product, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append(
      "price",
      (parseFloat(formData.price) * 100).toString()
    );
    formDataToSend.append("pictureUrl", formData.pictureUrl || "");
    formDataToSend.append("type", formData.type);
    formDataToSend.append("brand", formData.brand);
    formDataToSend.append("quantityInStock", formData.quantityInStock);

    if (product) {
      formDataToSend.append("id", product.id.toString());
    }

    if (imageFile) {
      formDataToSend.append("file", imageFile);
    }

    try {
      if (product) {
        await updateProduct(formDataToSend).unwrap();
        toast.success("Product updated successfully");
      } else {
        await createProduct(formDataToSend).unwrap();
        toast.success("Product created successfully");
      }
      onClose();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.data?.title || "Failed to save product");
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={600}>
            {product ? "Edit Product" : "Create Product"}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Avatar
                  src={imagePreview}
                  alt="Product preview"
                  variant="rounded"
                  sx={{ width: 200, height: 200 }}
                />
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUpload />}
                >
                  Upload Image
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Product Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={3}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Price (Rands)"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                inputProps={{ step: "0.01", min: "0" }}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Quantity in Stock"
                name="quantityInStock"
                type="number"
                value={formData.quantityInStock}
                onChange={handleChange}
                inputProps={{ min: "0" }}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? "Saving..." : product ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
