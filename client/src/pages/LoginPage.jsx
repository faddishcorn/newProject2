import Button from "../components/Button";
import logo from "../assets/logo.png";
import { useState } from "react";
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
      sessionStorage.setItem("token", token);

      // 로컬 스토리지의 루틴을 서버로 동기화
      const localRoutines = JSON.parse(localStorage.getItem('routines') || '[]');
      if (localRoutines.length > 0) {
        try {
          setMessage("로컬 운동 루틴을 동기화하는 중...");
          // 각 로컬 루틴을 서버에 저장
          await Promise.all(localRoutines.map(routine => 
            axiosInstance.post('/api/routines', {
              title: routine.title,
              exercises: routine.exercises.map(({ name, sets, reps }) => ({
                name,
                sets,
                reps,
              })),
            })
          ));
          // 동기화 후 로컬 루틴 삭제
          localStorage.removeItem('routines');
          setMessage("로컬 운동 루틴 동기화 완료!");
        } catch (error) {
          console.error('로컬 루틴 동기화 실패:', error);
          // 동기화 실패해도 로그인은 진행
        }
      }

      // YYYY-MM-DD 형식으로 날짜를 변환하는 함수
      const formatDate = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      // 로컬 스토리지의 운동 기록을 서버로 동기화
      const localWorkoutLogs = JSON.parse(localStorage.getItem('workoutLogs') || '[]');
      if (localWorkoutLogs.length > 0) {
        try {
          setMessage("로컬 운동 기록을 동기화하는 중...");
          // 각 운동 기록을 서버에 저장
          await Promise.all(localWorkoutLogs.map(log => 
            axiosInstance.post('/api/routines/history', {
              title: log.title,
              exercises: log.exercises,
              date: formatDate(log.date) // 날짜 형식을 YYYY-MM-DD로 변환하여 전송
            })
          ));
          // 동기화 후 로컬 운동 기록 삭제
          localStorage.removeItem('workoutLogs');
          setMessage("로컬 운동 기록 동기화 완료!");
        } catch (error) {
          console.error('로컬 운동 기록 동기화 실패:', error);
          // 동기화 실패해도 로그인은 진행
        }
      }

      // 3. 이동 (약간 지연시켜서 메시지를 보여줌)
      setTimeout(() => {
        navigate("/main");
      }, 1000);
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
        <a href="/main" className="flex items-center space-x-2">
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
                {/* <a
                  href="/forgot-password"
                  className="text-xs underline hover:underline-offset-4"
                >
                  비밀번호 찾기
                </a> */}
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

            {/* 상태 메시지 */}
            {message && (
              <div className={`mt-4 rounded-lg border p-4 text-sm ${
                message.includes('실패') 
                  ? 'border-red-500 bg-red-50 text-red-600'
                  : 'border-blue-500 bg-blue-50 text-blue-600'
              }`}>
                {message}
              </div>
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
          href="/main"
          className="hover:text-foreground underline underline-offset-4"
        >
          홈으로 돌아가기
        </a>
      </div>
    </div>
  );
}
