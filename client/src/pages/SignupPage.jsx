"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import Button from "../components/Button"
import logo from "../assets/logo.png"
import axios from 'axios';
import { useNavigate } from "react-router-dom"

export default function SignupPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    height: '',
    weight: '',
    gender: '',
    birthdate: '',
  });
  
  const [message, setMessage] = useState('');
  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE}/api/auth/signup`, form);
      setMessage(res.data.message);
//       setMessage("회원가입 성공! 로그인 페이지로 이동합니다...");
// setTimeout(() => {
//   navigate("/login");
// }, 1000);
navigate("/login");
    } catch (err) {
      setMessage(err.response?.data?.message || '회원가입 실패');
    }
  };
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="absolute top-4 left-4 md:top-8 md:left-8">
        <a href="/" className="flex items-center space-x-2">
        <img src={logo} alt="로고" className="h-17 w-20" />
        </a>
      </div>

      <div className="mx-auto w-full max-w-md space-y-6 px-4">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">회원가입</h1>
          <p className="text-muted-foreground">맞춤형 운동 루틴을 시작하기 위해 계정을 만드세요</p>
        </div>

        <div className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
  {/* 닉네임 */}
  <div className="space-y-2">
    <label htmlFor="username" className="text-sm font-medium leading-none">
      닉네임
    </label>
    <input
      id="username"
      name="username"
      type="text"
      value={form.username}
      onChange={handleChange}
      className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
      placeholder="nickname"
      required
    />
  </div>

  {/* 이메일 */}
  <div className="space-y-2">
    <label htmlFor="email" className="text-sm font-medium leading-none">
      이메일
    </label>
    <input
      id="email"
      name="email"
      type="email"
      value={form.email}
      onChange={handleChange}
      className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
      placeholder="name@example.com"
      required
    />
  </div>

  {/* 비밀번호 */}
  <div className="space-y-2">
    <label htmlFor="password" className="text-sm font-medium leading-none">
      비밀번호
    </label>
    <div className="relative">
      <input
        id="password"
        name="password"
        type={showPassword ? "text" : "password"}
        value={form.password}
        onChange={handleChange}
        className="flex h-10 w-full rounded-md border px-3 py-2 text-sm pr-10"
        placeholder="••••••••"
        required
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
      >
        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        <span className="sr-only">{showPassword ? "비밀번호 숨기기" : "비밀번호 표시"}</span>
      </button>
    </div>
    <p className="text-xs text-muted-foreground">
      비밀번호는 최소 8자 이상이며, 문자, 숫자, 특수문자를 포함해야 합니다.
    </p>
  </div>

  {/* 키, 몸무게 */}
  <div className="grid grid-cols-2 gap-4">
    <div className="space-y-2">
      <label htmlFor="height" className="text-sm font-medium leading-none">
        키 (cm)
      </label>
      <input
        id="height"
        name="height"
        type="number"
        value={form.height}
        onChange={handleChange}
        className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
        placeholder="예: 175"
        required
      />
    </div>
    <div className="space-y-2">
      <label htmlFor="weight" className="text-sm font-medium leading-none">
        몸무게 (kg)
      </label>
      <input
        id="weight"
        name="weight"
        type="number"
        value={form.weight}
        onChange={handleChange}
        className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
        placeholder="예: 65"
        required
      />
    </div>
  </div>

  {/* 성별, 생년월일 */}
  <div className="grid grid-cols-2 gap-4">
    <div className="space-y-2">
      <label htmlFor="gender" className="text-sm font-medium leading-none">
        성별
      </label>
      <select
        id="gender"
        name="gender"
        value={form.gender}
        onChange={handleChange}
        className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
        required
      >
        <option value="">선택</option>
        <option value="male">남성</option>
        <option value="female">여성</option>
      </select>
    </div>
    <div className="space-y-2">
      <label htmlFor="birthdate" className="text-sm font-medium leading-none">
        생년월일
      </label>
      <input
        id="birthdate"
        name="birthdate"
        type="date"
        value={form.birthdate}
        onChange={handleChange}
        className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
        required
      />
    </div>
  </div>

  {/* 이용약관 */}
  <div className="space-y-2">
    <div className="flex items-center space-x-2">
      <input
        id="terms"
        type="checkbox"
        className="h-4 w-4 rounded border-gray-300 text-primary"
        required
      />
      <label htmlFor="terms" className="text-sm text-muted-foreground">
        <a href="/terms" className="text-primary underline hover:underline-offset-4">이용약관</a> 및{" "}
        <a href="/privacy" className="text-primary underline hover:underline-offset-4">개인정보 처리방침</a>에 동의합니다.
      </label>
    </div>
  </div>

  <Button className="w-full bg-primary hover:bg-primary/90" type="submit">회원가입</Button>
  {message && (
  <p className="text-red-500 text-sm text-center mt-2">{message}</p>
)}
</form>


          <div className="mt-4 text-center text-sm">
            이미 계정이 있으신가요?{" "}
            <a href="/login" className="text-primary underline-offset-4 hover:underline">
              로그인
            </a>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <a href="/" className="hover:text-foreground underline underline-offset-4">
          홈으로 돌아가기
        </a>
      </div>
    </div>
  )
}
