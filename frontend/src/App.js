import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Nav from "./components/Nav";
import SplashPage from "./pages/SplashPage";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import CreatePostPage from "./pages/CreatePostPage";
import EditPostPage from "./pages/EditPostPage";
import AdminPage from "./pages/AdminPage";


import "./App.css";

function App() {
  const [showSplash, setShowSplash] = useState(
    localStorage.getItem("visited") ? false : true
  );
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    if (showSplash) {
      const timer = setTimeout(() => {
        localStorage.setItem("visited", "true");
        setShowSplash(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  const toggleMode = () => {
    setDarkMode(prev => {
      const newMode = !prev;
      localStorage.setItem("darkMode", newMode);
      document.body.classList.toggle("dark-mode", newMode);
      return newMode;
    });
  };

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, []);

  if (showSplash) return <SplashPage />;

  const Layout = ({ children }) => (
    <div>
      {/* Global Navbar */}
      <Nav darkMode={darkMode} toggleMode={toggleMode} />
      <main>{children}</main>
      <footer>
        <p>© All Rights Reserved 2026</p>
      </footer>
    </div>
  );

  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Navigate to="/home" />} />
        <Route
          path="/home"
          element={
            <Layout>
              <HomePage darkMode={darkMode} setDarkMode={setDarkMode} />
            </Layout>
          }
        />
        <Route
          path="/about"
          element={
            <Layout>
              <AboutPage darkMode={darkMode} setDarkMode={setDarkMode} />
            </Layout>
          }
        />
        <Route
          path="/contact"
          element={
            <Layout>
              <ContactPage darkMode={darkMode} setDarkMode={setDarkMode} />
            </Layout>
          }
        />
        <Route
          path="/register"
          element={
            <Layout>
              <RegisterPage />
            </Layout>
          }
        />
        <Route
          path="/login"
          element={
            <Layout>
              <LoginPage />
            </Layout>
          }
        />

        {/* Protected routes */}
        <Route
          path="/profile"
          element={
            <Layout>
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            </Layout>
          }
        />
        <Route
          path="/create-post"
          element={
            <Layout>
              <ProtectedRoute>
                <CreatePostPage />
              </ProtectedRoute>
            </Layout>
          }
        />

        {/* Admin only */}
        <Route
          path="/admin"
          element={
            <Layout>
              <ProtectedRoute role="admin">
                <AdminPage />
              </ProtectedRoute>
            </Layout>
          }
        />

        <Route
  path="/edit-post/:postId"
  element={
    <Layout>
      <ProtectedRoute>
        <EditPostPage darkMode={darkMode} setDarkMode={setDarkMode} />
      </ProtectedRoute>
    </Layout>
  }
/>
      </Routes>
    </AuthProvider>
  );
}

export default App;