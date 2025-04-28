import Button from "../components/Button";
import logo from "../assets/logo.png";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // 제출 시작 시 로딩
    setMessage(""); // 제출할 때 기존 메시지 초기화

    try {
      // // 1. 로그인 요청
      // await axios.post(`/api/auth/login`, form, {
      //   withCredentials: true,
      // });

      // // 2. ping 요청
      // await axios.get('/api/auth/ping', {
      //   withCredentials: true,
      // });

      const res = await axiosInstance.post(`/api/auth/login`, form);
      const { token } = res.data;
      localStorage.setItem("token", token);

      // 3. 이동
      navigate("/main");
    } catch (err) {
      console.error("로그인 실패:", err);
      const errorMessage =
        err.response?.data?.message ||
        "로그인 실패. 잠시 후 다시 시도해주세요.";
      setMessage(errorMessage);
    } finally {
      setIsLoading(false); // 요청 끝나면 로딩 해제
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      {/* 로고 */}
      <div className="absolute top-4 left-4 md:top-8 md:left-8">
        <a href="/" className="flex items-center space-x-2">
          <img src={logo} alt="로고" className="h-17 w-20" />
        </a>
      </div>

      {/* 로그인 폼 */}
      <div className="mx-auto w-full max-w-md space-y-6 px-4">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">로그인</h1>
          <p className="text-muted-foreground">
            계정에 로그인하여 맞춤형 운동 루틴을 관리하세요
          </p>
        </div>

        <div className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 이메일 입력 */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                이메일
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                placeholder="name@example.com"
                required
                disabled={isLoading}
              />
            </div>

            {/* 비밀번호 입력 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">
                  비밀번호
                </label>
                <a
                  href="/forgot-password"
                  className="text-xs underline hover:underline-offset-4"
                >
                  비밀번호 찾기
                </a>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                required
                disabled={isLoading}
              />
            </div>

            {/* 로그인 버튼 */}
            <Button
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  <span>로그인 중...</span>
                </div>
              ) : (
                "로그인"
              )}
            </Button>

            {/* 에러 메시지 */}
            {message && (
              <p className="text-red-500 text-sm text-center">{message}</p>
            )}
          </form>

          {/* 회원가입 링크 */}
          <div className="mt-4 text-center text-sm">
            계정이 없으신가요?{" "}
            <a
              href="/signup"
              className="text-primary underline-offset-4 hover:underline"
            >
              회원가입
            </a>
          </div>
        </div>
      </div>

      {/* 홈으로 돌아가기 */}
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <a
          href="/"
          className="hover:text-foreground underline underline-offset-4"
        >
          홈으로 돌아가기
        </a>
      </div>
    </div>
  );
}
