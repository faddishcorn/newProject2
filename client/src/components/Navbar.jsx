"use client"

import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Home, Users, Calendar, User, BarChart2, Menu, X, LogOut } from "lucide-react"
import axios from 'axios'

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const menuItems = [
    { name: "메인", path: "/main", icon: <Home size={20} /> },
    { name: "소셜", path: "/social", icon: <Users size={20} /> },
    { name: "루틴관리", path: "/routines", icon: <Calendar size={20} /> },
    { name: "내정보", path: "/profile", icon: <User size={20} /> },
    { name: "운동기록", path: "/workout-logs", icon: <BarChart2 size={20} /> },
  ]

  const isActive = (path) => {
    return location.pathname === path
  }

  const handleLogout = async () => {
    try {
      // await axios.post('/api/auth/logout'); // ✅ 서버에 로그아웃 요청
      localStorage.removeItem('token');
      console.log('로그아웃 완료');
      navigate('/'); 
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full" style={{ backgroundColor: "#6ca7af" }}>
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and desktop navigation */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/main" className="flex items-center">
                <span className="text-white font-bold text-xl">바디플랜</span>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-4">
                {menuItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.path) ? "bg-white text-[#6ca7af]" : "text-white hover:bg-[#5a8f96] hover:text-white"
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Logout button (desktop) */}
          <div className="hidden md:block">
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-[#5a8f96] transition-colors"
            >
              <LogOut size={20} className="mr-2" />
              로그아웃
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-[#5a8f96]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">메뉴 열기</span>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden" style={{ backgroundColor: "#6ca7af" }}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                  isActive(item.path) ? "bg-white text-[#6ca7af]" : "text-white hover:bg-[#5a8f96] hover:text-white"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </Link>
            ))}

            {/* Logout button (mobile) */}
            <button
              onClick={handleLogout}
              className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-white hover:bg-[#5a8f96] transition-colors"
            >
              <LogOut size={20} className="mr-2" />
              로그아웃
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
