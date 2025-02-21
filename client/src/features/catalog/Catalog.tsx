import { Product } from "../../app/models/product";

interface ProductProps {
  products: Product[];
  addProduct: () => void;
}

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
      <button onClick={addProduct}>Add</button>
    </>
  );
}
