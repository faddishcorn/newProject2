"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import Button from "../components/Button"
import logo from "../assets/logo.png"

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)

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
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="first-name"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  이름
                </label>
                <input
                  id="first-name"
                  type="text"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="홍"
                  required
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="last-name"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  성
                </label>
                <input
                  id="last-name"
                  type="text"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="길동"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                이메일
              </label>
              <input
                id="email"
                type="email"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="name@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                비밀번호
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="sr-only">{showPassword ? "비밀번호 숨기기" : "비밀번호 표시"}</span>
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                비밀번호는 최소 8자 이상이어야 하며, 문자, 숫자, 특수문자를 포함해야 합니다.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  id="terms"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  required
                />
                <label htmlFor="terms" className="text-sm text-muted-foreground">
                  <span>
                    <a href="/terms" className="text-primary underline-offset-4 hover:underline">
                      이용약관
                    </a>{" "}
                    및{" "}
                    <a href="/privacy" className="text-primary underline-offset-4 hover:underline">
                      개인정보 처리방침
                    </a>
                    에 동의합니다
                  </span>
                </label>
              </div>
            </div>

            <Button className="w-full bg-primary hover:bg-primary/90">회원가입</Button>
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
