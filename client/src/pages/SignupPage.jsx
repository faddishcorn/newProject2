"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Button from "../components/Button";
import logo from "../assets/logo.png";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    height: "",
    weight: "",
    gender: "",
    birthdate: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const togglePrivate = (field) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field] === "private" ? "" : "private",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password.length < 8) {
      setMessage("비밀번호는 최소 8자 이상이어야 합니다.");
      return;
    }
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(form.password)) {
      setMessage("비밀번호는 문자와 숫자가 모두 포함되어야 합니다.");
      return;
    }

    try {
      const res = await axiosInstance.post(`/api/auth/signup`, form);
      setMessage(res.data.message);
      navigate("/login");
    } catch (err) {
      setMessage(err.response?.data?.message || "회원가입 실패");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background pt-12 pb-12">
      <div className="absolute top-4 left-4 md:top-8 md:left-8">
        <a href="/" className="flex items-center space-x-2">
          <img src={logo} alt="로고" className="h-17 w-20" />
        </a>
      </div>

      <div className="mx-auto w-full max-w-md space-y-6 px-4">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">회원가입</h1>
          <p className="text-muted-foreground">
            맞춤형 운동 루틴을 시작하기 위해 계정을 만드세요
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 닉네임 */}
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="text-sm font-medium leading-none"
            >
              닉네임
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              required
              className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
              placeholder="nickname"
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
              required
              className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
              placeholder="name@example.com"
            />
          </div>

          {/* 비밀번호 */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium leading-none"
            >
              비밀번호
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                required
                className="flex h-10 w-full rounded-md border px-3 py-2 text-sm pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              비밀번호는 최소 8자 이상이며, 문자, 숫자, 특수문자를 포함해야
              합니다.
            </p>
          </div>

          {/* 키, 몸무게 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="height"
                className="text-sm font-medium leading-none"
              >
                키 (cm)
              </label>
              <input
                id="height"
                name="height"
                type="number"
                value={form.height === "private" ? "" : form.height}
                onChange={handleChange}
                disabled={form.height === "private"}
                required={form.height !== "private"}
                className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
                placeholder="예: 175"
              />
              <button
                type="button"
                onClick={() => togglePrivate("height")}
                className="text-xs text-gray-500 underline"
              >
                {form.height === "private" ? "입력하기" : "비공개"}
              </button>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="weight"
                className="text-sm font-medium leading-none"
              >
                몸무게 (kg)
              </label>
              <input
                id="weight"
                name="weight"
                type="number"
                value={form.weight === "private" ? "" : form.weight}
                onChange={handleChange}
                disabled={form.weight === "private"}
                required={form.weight !== "private"}
                className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
                placeholder="예: 65"
              />
              <button
                type="button"
                onClick={() => togglePrivate("weight")}
                className="text-xs text-gray-500 underline"
              >
                {form.weight === "private" ? "입력하기" : "비공개"}
              </button>
            </div>
          </div>

          {/* 성별, 생년월일 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="gender"
                className="text-sm font-medium leading-none"
              >
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
                <option value="private">비공개</option>
              </select>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="birthdate"
                className="text-sm font-medium leading-none"
              >
                생년월일
              </label>
              <input
                id="birthdate"
                name="birthdate"
                type="date"
                value={form.birthdate === "private" ? "" : form.birthdate}
                onChange={handleChange}
                disabled={form.birthdate === "private"}
                required={form.birthdate !== "private"}
                className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={() => togglePrivate("birthdate")}
                className="text-xs text-gray-500 underline"
              >
                {form.birthdate === "private" ? "입력하기" : "비공개"}
              </button>
            </div>
          </div>

          {/* 안내 문구 */}
          <div className="space-y-2">
            <label htmlFor="terms" className="text-sm text-muted-foreground">
              신체 정보는 보다 정확한 루틴 추천을 위해 이용되며 타인이 확인할 수
              없습니다. 추후에 변경이 가능합니다.
            </label>
          </div>

          <Button
            className="w-full bg-primary hover:bg-primary/90"
            type="submit"
          >
            회원가입
          </Button>
          {message && (
            <p className="text-red-500 text-sm text-center mt-2">{message}</p>
          )}
        </form>

        <div className="mt-4 text-center text-sm">
          이미 계정이 있으신가요?{" "}
          <a
            href="/login"
            className="text-primary underline-offset-4 hover:underline"
          >
            로그인
          </a>
        </div>
      </div>

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
