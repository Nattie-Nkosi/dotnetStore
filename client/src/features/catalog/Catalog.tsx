import { Button } from "@mui/material";
import { Product } from "../../app/models/product";

type ProductProps = {
  products: Product[];
  addProduct: () => void;
};

export default function Catalog({ products, addProduct }: ProductProps) {
  return (
    <>
      <ul>
        {products.map((product: Product) => (
          <li key={product.name}>
            {product.name} - {product.price}
          </li>
        ))}
      </ul>
      <Button variant="contained" onClick={addProduct}>
        Add Product
      </Button>
    </>
  );
}
