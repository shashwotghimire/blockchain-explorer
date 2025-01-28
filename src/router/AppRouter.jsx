import React, { useState, useEffect } from "react";
import Signup from "../pages/Signup";
import Signin from "../pages/Signin";
import Dashboard from "../pages/dashboard/Dashboard";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";
import { auth } from "../firebase/firebase-config";
import { onAuthStateChanged } from "firebase/auth";

const PrivateRoute = ({ element: Element, user, loading }) => {
  if (loading) return <div>Loading...</div>;
  return user ? <Element user={user} /> : <Navigate to="/signin" replace />;
};

function AppRouter() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route
          path="/"
          element={
            loading ? (
              <div>Loading...</div>
            ) : user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/signin" replace />
            )
          }
        />
        <Route
          path="/signin"
          element={
            loading ? (
              <div>Loading...</div>
            ) : user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Signin />
            )
          }
        />
        <Route
          path="/signup"
          element={
            loading ? (
              <div>Loading...</div>
            ) : user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Signup />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute element={Dashboard} user={user} loading={loading} />
          }
        />
        <Route path="*" element={<div>404 page not found</div>} />
      </>
    )
  );

  return <RouterProvider router={router} />;
}

export default AppRouter;
