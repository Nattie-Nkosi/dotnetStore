import { useEffect, useState } from "react";
import { Product } from "../models/product";
import Catalog from "../../features/catalog/Catalog";
import { Box, Button, Container, Typography } from "@mui/material";

function App() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("https://localhost:5001/api/products")
      .then((response) => response.json())
      .then((data) => setProducts(data));
  }, []);

  const addProduct = async () => {
    setProducts([
      ...products,
      {
        id: 0,
        name: "New Product",
        description: "New Description",
        price: 0,
        pictureUrl: "https://via.placeholder.com/150",
        type: "New Type",
        brand: "New Brand",
        quantityInStock: 1,
      },
    ]);
  };

  return (
    <Container maxWidth="xl">
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Typography variant="h4">Dotnet-Store</Typography>
        <Button variant="contained" onClick={addProduct}>
          Add Product
        </Button>
      </Box>

      <Catalog products={products} addProduct={addProduct} />
    </Container>
  );
}

export default App;
