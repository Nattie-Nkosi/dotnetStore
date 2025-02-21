import { useEffect, useState } from "react";
import { Product } from "../models/product";
import Catalog from "../../features/catalog/Catalog";

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
    <>
      <h1>App</h1>
      <Catalog products={products} addProduct={addProduct} />
    </>
  );
}

export default App;
