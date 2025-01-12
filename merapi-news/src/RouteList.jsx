import React, { useState } from "react";
import { createBrowserRouter } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Home from "./components/Home";
import NewsPage from "./components/newsPage";
import NewsDetailPage from "./components/newsDetail_page";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";

function LayoutWithSidebar({ children, onToggleSidebar, isSidebarVisible }) {
  return (
    <div className="flex">
      {isSidebarVisible && <Sidebar />}
      <div className={`flex flex-col ${isSidebarVisible ? "flex-1" : "w-full"}`}>
        <Header onToggleSidebar={onToggleSidebar} />
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}

function RouteWithSidebar({ children }) {
  const [isSidebarVisible, setSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  return (
    <LayoutWithSidebar
      isSidebarVisible={isSidebarVisible}
      onToggleSidebar={toggleSidebar}
    >
      {children}
    </LayoutWithSidebar>
  );
}

const RouteList = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <RouteWithSidebar>
          <Home />
        </RouteWithSidebar>
      </ProtectedRoute>
    ),
  },
  {
    path: "/newsPage",
    element: (
      <ProtectedRoute>
        <RouteWithSidebar>
          <NewsPage />
        </RouteWithSidebar>
      </ProtectedRoute>
    ),
  },
  {
    path: "/newsDetail_page/:id",
    element: (
      <ProtectedRoute>
        <RouteWithSidebar>
          <NewsDetailPage />
        </RouteWithSidebar>
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

export default RouteList;
