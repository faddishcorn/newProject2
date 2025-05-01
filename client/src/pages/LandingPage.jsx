"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowRight, Smartphone, Users, CheckCircle, Zap } from "lucide-react"
import "./LandingPage.css"
import laptop from "../assets/laptop.png"
import mobile from "../assets/mobile.png"
import demoVideo from "../assets/demoVid.mp4"
import mobile_routine from "../assets/mobile_2.png"
import logo from "../assets/logo.png"

export default function LandingPage() {
  useEffect(() => {
    // 스크롤 애니메이션 효과
    const handleScroll = () => {
      const elements = document.querySelectorAll(".scroll-animate")
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect()
        const windowHeight = window.innerHeight

        if (rect.top <= windowHeight * 0.8) {
          el.classList.add("visible")
        }
      })
    }

    // 배경 그라데이션 애니메이션
    const heroSection = document.querySelector(".hero-section")
    let gradientPosition = 0

    const animateGradient = () => {
      gradientPosition = (gradientPosition + 1) % 360
      if (heroSection) {
        heroSection.style.background = `linear-gradient(${gradientPosition}deg, #f8f9fa 0%, #e8f4f6 50%, #d9eef2 100%)`
      }
      requestAnimationFrame(animateGradient)
    }

    animateGradient()
    window.addEventListener("scroll", handleScroll)
    handleScroll() // 초기 로드 시 실행

    return () => {
      window.removeEventListener("scroll", handleScroll)
      // No need to cancel animateGradient as component unmount will stop it
    }
  }, [])

  const navigate = useNavigate();

  return (
    <div className="landing-page">
    <div className="landing-container">
      {/* 헤더 섹션 */}
      <header className="header">
        <div className="header-container">
          <div className="logo">
          <img src={logo} alt="logo" />
        </div>
        <div className="nav-buttons">
          <button className="login-btn" onClick={() => navigate("/login")}>
            로그인
          </button>
          <button className="signup-btn" onClick={() => navigate("/signup")}>
            회원가입
          </button>
        </div>
        </div>
          
       
        
      </header>

      {/* 히어로 섹션 */}
      <section className="hero-section">
        <div className="hero-section-container">

          <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>AI가 만드는 맞춤형 운동 루틴</h1>
          <p>당신의 신체 정보와 목표에 맞는 최적의 운동 계획을 제공합니다</p>
          <button className="cta-button" onClick={() => navigate("/signup")}>
            무료로 시작하기 <ArrowRight size={16} />
          </button>
        </motion.div>

        <motion.div
          className="hero-image"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Device Mockups */}
          <div className="device-mockups">
            {/* Laptop mockup */}
            <div className="laptop-mockup">
              <div className="laptop-screen">
                <div className="laptop-content">
                  {/* 노트북 스크린샷 이미지 크기: 760x475px */}
                  <img src={laptop} alt="laptop_screenshot" />
                </div>
              </div>
              <div className="laptop-base"></div>
            </div>

            {/* Mobile mockup */}
            <div className="mobile-mockup">
              <div className="mobile-screen">
                {/* 모바일 스크린샷 이미지 크기: 180x320px */}
                <img src={mobile} alt="mobile_screenshot" />
              </div>
            </div>
          </div>
        </motion.div>
        </div>
        
      </section>

      {/* 특징 섹션 */}
      <section className="features-section">
        <h2 className="section-title scroll-animate">핵심 기능</h2>

        <div className="features-grid">
          <div className="feature-card scroll-animate">
            <div className="feature-icon" style={{ backgroundColor: "rgba(109, 163, 171, 0.2)" }}>
              <Zap size={32} color="#6da3ab" />
            </div>
            <h3>AI 맞춤 루틴</h3>
            <p>당신의 신체 정보와 목표에 맞는 최적의 운동 루틴을 AI가 설계합니다</p>
          </div>

          <div className="feature-card scroll-animate">
            <div className="feature-icon" style={{ backgroundColor: "rgba(109, 163, 171, 0.2)" }}>
              <CheckCircle size={32} color="#6da3ab" />
            </div>
            <h3>간편한 기록</h3>
            <p>완료한 운동을 체크하고 진행 상황을 한눈에 확인하세요</p>
          </div>

          <div className="feature-card scroll-animate">
            <div className="feature-icon" style={{ backgroundColor: "rgba(109, 163, 171, 0.2)" }}>
              <Users size={32} color="#6da3ab" />
            </div>
            <h3>소셜 기능</h3>
            <p>친구들과 운동 기록을 공유하고 댓글로 소통하세요</p>
          </div>

          <div className="feature-card scroll-animate">
            <div className="feature-icon" style={{ backgroundColor: "rgba(109, 163, 171, 0.2)" }}>
              <Smartphone size={32} color="#6da3ab" />
            </div>
            <h3>어디서나 접근</h3>
            <p>PC, 태블릿, 모바일 등 모든 기기에서 편리하게 이용하세요</p>
          </div>
        </div>
      </section>

      {/* 비디오 섹션 */}
      <section className="how-it-works scroll-animate">
        <div className="section-content">
          <h2 className="section-title">간편한 루틴생성</h2>
          <div className="video-container">
            {/* 비디오 플레이스홀더 - 권장 크기: 800x450px (16:9 비율) */}
            <video autoPlay loop muted>
              <source src={demoVideo} type="video/mp4"/>
              데모 비디오
            </video>
          </div>
        </div>
      </section>

      {/* 소셜 기능 섹션 */}
      <section className="social-section scroll-animate">
        <div className="social-content">
          <div className="social-text">
            <h2>세세한 운동 기록</h2>
            <p>성공한 운동, 미처 끝내지 못한 운동까지 기록됩니다</p>
          </div>
          <div className="social-image">
              <img src={mobile_routine} alt="mobie_routine" /> 
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="cta-section scroll-animate">
        <div className="cta-content">
          <h2>지금 바로 시작하세요</h2>
          <p>완전 무료로 제공되는 바디플랜의 모든 기능을 경험해보세요</p>
          <button className="cta-button" onClick={() => navigate("/signup")}>
            무료로 시작하기 <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="footer">
        <div className="footer-content">
          <p>© 2025 바디플랜. 모든 권리 보유.</p>
        </div>
      </footer>
    </div>
    </div>
  )
}
