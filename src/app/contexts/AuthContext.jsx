"use client";

import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AuthContext = React.createContext(null);

export function AuthProvider({ children }) {
  const { data, isError } = useQuery({
    queryKey: ["validateToken"],
    queryFn: async () => {
      const res = await fetch("/api/auth/validate-token", {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Not authenticated");
      return res.json();
    },
    retry: 0,
  });

  const showToast = ({ message, type }) => {
    if (type === "SUCCESS") toast.success(message);
    else toast.error(message);
  };

  const role = data?.role || null;
  const userId = data?.userId || null;

  const isLoggedIn = !isError && !!userId;
  const isAdmin = role === "admin";
  const isCompetitor = role === "competitor";

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, isAdmin, isCompetitor, role, userId, showToast }}
    >
      <ToastContainer position="top-right" autoClose={3000} />
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
