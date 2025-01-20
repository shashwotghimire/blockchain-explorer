import React from "react";
import Signup from "../pages/Signup";
import Dashboard from "../pages/dashboard/Dashboard";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

const AppRouter = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </>
    )
  );
  return <RouterProvider router={router} />;
};

export default AppRouter;
