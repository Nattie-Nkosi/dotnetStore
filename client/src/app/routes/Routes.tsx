import { createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";
import Catalog from "../../features/catalog/Catalog";
import ProductDetails from "../../features/catalog/ProductDetails";
import AboutPage from "../../features/about/AboutPage";
import ContactPage from "../../features/contact/ContactPage";
import BasketPage from "../../features/basket/BasketPage";
import CheckoutPage from "../../features/checkout/CheckoutPage";
import NotFound from "../errors/NotFound";
import ServerError from "../errors/ServerError";
import LoginPage from "../../features/account/LoginPage";
import RegisterPage from "../../features/account/RegisterPage";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ServerError />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/catalog", element: <Catalog /> },
      { path: "/catalog/:id", element: <ProductDetails /> },
      { path: "/basket", element: <BasketPage /> },
      {
        path: "/checkout",
        element: (
          <PrivateRoute>
            <CheckoutPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/login",
        element: (
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        ),
      },
      {
        path: "/register",
        element: (
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        ),
      },
      { path: "/about", element: <AboutPage /> },
      { path: "/contact", element: <ContactPage /> },
      { path: "/server-error", element: <ServerError /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
