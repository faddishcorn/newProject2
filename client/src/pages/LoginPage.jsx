import Button from "../components/Button"
import logo from "../assets/logo.png"
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
const [message, setMessage] = useState("");
const navigate = useNavigate();

const handleChange = (e) => {
  setForm({ ...form, [e.target.name]: e.target.value });
};

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("/api/auth/login", form); // 로그인 요청
    const { token } = res.data;

    // 로그인 성공 시 토큰 저장
    localStorage.setItem("token", token);

    // 메인 페이지로 이동
    navigate("/main");
  } catch (err) {
    setMessage(err.response?.data?.message || "로그인 실패");
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
          <h1 className="text-3xl font-bold">로그인</h1>
          <p className="text-muted-foreground">계정에 로그인하여 맞춤형 운동 루틴을 관리하세요</p>
        </div>

        <div className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                이메일
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="name@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  비밀번호
                </label>
                <a href="/forgot-password" className="text-xs text-muted-foreground underline-offset-4 hover:underline">
                  비밀번호 찾기
                </a>
              </div>
              <input
                id="password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
            </div>
            <Button className="w-full bg-primary hover:bg-primary/90">로그인</Button>
          </form>

          <div className="mt-4 text-center text-sm">
            계정이 없으신가요?{" "}
            <a href="/signup" className="text-primary underline-offset-4 hover:underline">
              회원가입
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
