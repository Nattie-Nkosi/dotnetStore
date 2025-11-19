import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./app/layout/styles.css";
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/routes/Routes.tsx";
import { Provider } from "react-redux";
import { configureTheStore } from "./app/store/store.ts";

const store = configureTheStore();

console.log("Store configured:", store.getState());

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
