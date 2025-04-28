// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import { Analytics } from "@vercel/analytics/react";
import LoginPage from "./pages/LoginPage";
import AppRoutes from "./routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <>
      <AppRoutes />
      <ToastContainer position="top-center" autoClose={3000} />
      <Analytics />
    </>
  );
}
