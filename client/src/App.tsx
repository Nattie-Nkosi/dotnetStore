import { useEffect, useState } from "react";

function App() {
  const [products, setProducts] = useState<{ name: string; price: number }[]>(
    []
  );

  useEffect(() => {
    fetch("https://localhost:5001/api/products")
      .then((response) => response.json())
      .then((data) => setProducts(data));
  }, []);

  const addProduct = async () => {
    setProducts((prevState) => [
      ...prevState,
      {
        name: "Product 1" + (prevState.length + 1),
        price: (prevState.length + 1) * 100,
      },
    ]);
  };

  return (
    <>
      <h1>App</h1>
      <ul>
        {products.map((product) => (
          <li key={product.name}>
            {product.name} - {product.price}
          </li>
        ))}
      </ul>
      <button onClick={addProduct}>Add</button>
    </>
  );
}

export default App;
