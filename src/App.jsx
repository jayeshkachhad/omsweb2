// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import { useAuthStore } from "./store/useAuthStore";
import MenuCategories from "./pages/MenuCategories";
import MenuItems from "./pages/MenuItems";

export default function App() {
  const { isAuthenticated } = useAuthStore();
  return (
    <Routes>
      <Route
        path="/"
        element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
      />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route
        path="/categories"
        element={
          isAuthenticated ? (
            <MenuCategories />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="/menuitems" element={<MenuItems />} />
    </Routes>
  );
}
