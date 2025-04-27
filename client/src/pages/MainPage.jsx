"use client"

import { useState, useEffect } from "react"
import { Activity, TrendingUp, ArrowRight, Plus } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import axios from "axios";

export default function MainPage() {
  const [greeting, setGreeting] = useState("")
  const [userName, setUserName] = useState("사용자")
  const [stats, setStats] = useState({
    totalWorkouts: 23,
    thisWeek: 3,
  })
  const [showCompletionMessage, setShowCompletionMessage] = useState(false)
  const [completedRoutineTitle, setCompletedRoutineTitle] = useState("")

  const location = useLocation()
  const navigate = useNavigate()

  const [recommendedRoutines, setRecommendedRoutines] = useState([])

  // 시간에 따른 인사말 설정
  useEffect(() => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) {
      setGreeting("좋은 아침이에요")
    } else if (hour >= 12 && hour < 18) {
      setGreeting("좋은 오후에요")
    } else {
      setGreeting("좋은 저녁이에요")
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get(`/api/auth/me`);
        setUserName(res.data.username); 
      } catch (err) {
        console.error("사용자 정보 불러오기 실패", err);
      }
    }
  
    fetchUser();

    // 루틴 완료 메시지 표시
    if (location.state?.routineCompleted) {
      setShowCompletionMessage(true)
      setCompletedRoutineTitle(location.state.routineTitle)

      // 3초 후 메시지 숨기기
      const timer = setTimeout(() => {
        setShowCompletionMessage(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [location])


  useEffect(() => {
  const fetchUserRoutines = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE}/api/routines`);
      setRecommendedRoutines(res.data);  // 백엔드에서 온 루틴으로 상태 갱신
    } catch (err) {
      console.error("루틴 목록 불러오기 실패:", err);
    }
  };

  fetchUserRoutines();
}, []);

  // 오늘의 날짜 포맷팅
  const today = new Date()
  const formattedDate = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`

  // 루틴 시작하기
  const handleStartRoutine = (routine) => {
    navigate(`/routine-execution/${routine.id}`, {
      state: { routine }, // ✅ 루틴 전체 데이터를 넘김
    });
  }

  return (
    <div className="space-y-8">
      {/* 헤더 섹션 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {greeting}, {userName}님!
          </h1>
          <p className="text-gray-600 mt-1">{formattedDate}</p>
        </div>

        {/* 루틴 완료 메시지 */}
        {showCompletionMessage && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg animate-fade-in">
            <p className="font-medium">"{completedRoutineTitle}" 루틴을 완료했습니다! 🎉</p>
            <p className="text-sm">오늘의 운동 기록이 저장되었습니다.</p>
          </div>
        )}
      </div>

      {/* 추천 루틴 섹션 (위치 변경됨) */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">오늘의 루틴을 골라보세요</h2>

        {recommendedRoutines.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendedRoutines.map((routine) => (
              <div key={routine.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-800">{routine.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{routine.description}</p>
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-2">{routine.exercises.length}개 운동</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {routine.exercises.map((exercise) => (
                      <li key={exercise.id} className="truncate">
                        • {exercise.name} ({exercise.sets}세트 x {exercise.reps}회)
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => handleStartRoutine(routine)}
                  className="w-full mt-3 px-3 py-2 rounded-md text-white text-sm font-medium transition-colors flex items-center justify-center"
                  style={{ backgroundColor: "#6ca7af" }}
                >
                  루틴 시작하기
                  <ArrowRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div
            onClick={() => navigate("/routines")}
            className="border border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div className="flex flex-col items-center justify-center space-y-3">
              <Plus size={40} className="text-gray-400" />
              <div>
                <p className="text-gray-600 font-medium">루틴이 없습니다</p>
                <p className="text-gray-500 text-sm mt-1">클릭하여 루틴을 추가해보세요</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 통계 카드 (위치 변경됨) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center">
            <div className="p-3 rounded-full" style={{ backgroundColor: "rgba(108, 167, 175, 0.2)" }}>
              <Activity size={24} style={{ color: "#6ca7af" }} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">총 운동 횟수</p>
              <p className="text-2xl font-semibold text-gray-800">{stats.totalWorkouts}회</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center">
            <div className="p-3 rounded-full" style={{ backgroundColor: "rgba(108, 167, 175, 0.2)" }}>
              <TrendingUp size={24} style={{ color: "#6ca7af" }} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">이번 주 운동</p>
              <p className="text-2xl font-semibold text-gray-800">{stats.thisWeek}회</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
