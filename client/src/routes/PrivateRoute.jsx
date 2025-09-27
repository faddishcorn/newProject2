import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

export default function PrivateRoute({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // const checkAuth = async () => {
    //   try {
    //     await axios.get('/api/auth/me'); // ✅ withCredentials: true 자동 적용
    //     setIsAuthenticated(true);
    //   } catch (error) {
    //     setIsAuthenticated(false);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };

    // checkAuth();
    const token = sessionStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        {/* 간단한 로딩 UI */}
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6ca7af]"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
}
