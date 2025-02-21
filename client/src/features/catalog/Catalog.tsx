import { Product } from "../../app/models/product";
import ProductList from "./ProductList";

type ProductProps = {
  products: Product[];
  addProduct: () => void;
};

export default function Catalog({ products }: ProductProps) {
  return (
    <>
      <ProductList products={products} />
    </>
  );
}
