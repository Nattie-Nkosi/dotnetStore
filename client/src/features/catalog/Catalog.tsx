import { Typography } from "@mui/material";
import ProductList from "./ProductList";
import { useFetchProductsQuery } from "./catalogApi";

export default function Catalog() {
  const { data: products = [], isLoading } = useFetchProductsQuery();

  if (isLoading) return <Typography>Loading products...</Typography>;

  return (
    <>
      <ProductList products={products} />
    </>
  );
}
