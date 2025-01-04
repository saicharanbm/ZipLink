import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthRoute from "./components/AuthRoute.tsx";
import Home from "./components/Home.tsx";
import Login from "./components/Login.tsx";
import Signup from "./components/Signup.tsx";
import { ToastContainer, Bounce } from "react-toastify";
import Analytics from "./components/Analytics.tsx";
import Account from "./components/Account.tsx";
import PageNotFound from "./components/PageNotFound.tsx";
import CreateZipLink from "./components/CreateZipLink.tsx";

export const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <AuthRoute isProtected={true}>
            <Home />
          </AuthRoute>
        ),
      },
      {
        path: "/login",
        element: (
          <AuthRoute isProtected={false}>
            <Login />
          </AuthRoute>
        ),
      },
      {
        path: "/signup",
        element: (
          <AuthRoute isProtected={false}>
            <Signup />
          </AuthRoute>
        ),
      },
      {
        path: "/account-setting",
        element: (
          <AuthRoute isProtected={true}>
            <Account />
          </AuthRoute>
        ),
      },
      {
        path: "/analytics",
        element: (
          <AuthRoute isProtected={true}>
            <Analytics />
          </AuthRoute>
        ),
      },
      {
        path: "/create-ziplink",
        element: (
          <AuthRoute isProtected={true}>
            <CreateZipLink />
          </AuthRoute>
        ),
      },
      {
        path: "*",
        element: <PageNotFound />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      <RouterProvider router={router} />
      <ReactQueryDevtools />
    </QueryClientProvider>
  </StrictMode>
);
