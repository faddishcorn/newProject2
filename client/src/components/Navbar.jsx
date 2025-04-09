"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Home, Users, Calendar, User, BarChart2, Menu, X } from "lucide-react"

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  const menuItems = [
    { name: "메인", path: "/dashboard", icon: <Home size={20} /> },
    { name: "소셜", path: "/social", icon: <Users size={20} /> },
    { name: "루틴관리", path: "/routines", icon: <Calendar size={20} /> },
    { name: "내정보", path: "/profile", icon: <User size={20} /> },
    { name: "운동기록", path: "/workout-logs", icon: <BarChart2 size={20} /> },
  ]

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <nav className="sticky top-0 z-50 w-full" style={{ backgroundColor: "#6ca7af" }}>
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and desktop navigation */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/dashboard" className="flex items-center">
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
          </div>
        </div>
      )}
    </nav>
  )
}
