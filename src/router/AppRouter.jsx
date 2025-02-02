import React, { useState, useEffect } from "react";

import Signup from "../pages/Signup";
import Signin from "../pages/Signin";
import Dashboard from "../pages/dashboard/Dashboard";
import Wallet from "@/pages/wallet/Wallet";
import Analytics from "@/pages/analytics/Analytics";
import Bookmarks from "@/pages/bookmarks/Bookmarks";
import Market from "@/pages/market/Market";
import Settings from "@/pages/settings/Settings";
import Profile from "@/pages/profile/Profile";

import { Skeleton } from "@/components/ui/skeleton";

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
  if (loading)
    return (
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
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
              <div className="flex flex-col space-y-3">
                <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
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
              <div className="flex flex-col space-y-3">
                <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
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
              <div className="flex flex-col space-y-3">
                <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
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
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/market" element={<Market />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<div>404 page not found</div>} />
      </>
    )
  );

  return <RouterProvider router={router} />;
}

export default AppRouter;
