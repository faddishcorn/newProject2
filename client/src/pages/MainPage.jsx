"use client"

import { useState, useEffect } from "react"
import { Activity, TrendingUp, ArrowRight, Plus } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import axios from "axios"

export default function MainPage() {
  const [greeting, setGreeting] = useState("")
  const [userName, setUserName] = useState("")
  const [userId, setUserId] = useState("")
  const [thisWeekWorkoutDays, setThisWeekWorkoutDays] = useState(0)
  const [recommendedRoutines, setRecommendedRoutines] = useState([])
  const [showCompletionMessage, setShowCompletionMessage] = useState(false)
  const [completedRoutineTitle, setCompletedRoutineTitle] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const location = useLocation()
  const navigate = useNavigate()

  // 오늘 날짜
  const today = new Date()
  const formattedDate = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`

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
  }, [])

  // 사용자 이름 가져오기
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/api/auth/me`)
        setUserName(res.data.username)
        setUserId(res.data._id)
      } catch (err) {
        console.error("사용자 정보 불러오기 실패", err)
      }
    }
    fetchUser()
  }, [])

  // 이번 주 운동 기록 가져오기
  useEffect(() => {
    const fetchWorkoutDates = async () => {
      if (!userId) return; // 아직 userId를 못 불러왔으면 대기

      try {
        const res = await axios.get(`/api/workout-logs/dates/${userId}`)
        const dates = res.data

        const startOfWeek = new Date(today)
        startOfWeek.setDate(today.getDate() - today.getDay()) // 일요일
        startOfWeek.setHours(0, 0, 0, 0)

        const endOfWeek = new Date(today)
        endOfWeek.setDate(today.getDate() + (6 - today.getDay())) // 토요일
        endOfWeek.setHours(23, 59, 59, 999)

        const uniqueWorkoutDays = new Set(
          dates
            .map((d) => new Date(d))
            .filter((date) => date >= startOfWeek && date <= endOfWeek)
            .map((date) => date.toDateString())
        )

        setThisWeekWorkoutDays(uniqueWorkoutDays.size)
      } catch (err) {
        console.error("운동 기록 날짜 불러오기 실패", err)
      }
    }

    fetchWorkoutDates()
  }, [userId])

  // 루틴 추천 목록 가져오기
  useEffect(() => {
    const fetchRecommendedRoutines = async () => {
      try {
        const res = await axios.get(`/api/routines`)
        setRecommendedRoutines(res.data)
      } catch (err) {
        console.error("루틴 목록 불러오기 실패", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecommendedRoutines()
  }, [])

  // 루틴 완료 메시지 표시
  useEffect(() => {
    if (location.state?.routineCompleted) {
      setShowCompletionMessage(true)
      setCompletedRoutineTitle(location.state.routineTitle)

      const timer = setTimeout(() => setShowCompletionMessage(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [location])

  const handleStartRoutine = (routine) => {
    navigate(`/routine-execution/${routine.id}`, {
      state: { routine },
    })
  }

  // 로딩 중이면 로딩 스피너 표시
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6ca7af]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800">{greeting}, {userName}님!</h1>
        <p className="text-gray-600 mt-1">{formattedDate}</p>

        {showCompletionMessage && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg animate-fade-in">
            <p className="font-medium">"{completedRoutineTitle}" 루틴을 완료했습니다! 🎉</p>
            <p className="text-sm">오늘의 운동 기록이 저장되었습니다.</p>
          </div>
        )}
      </div>

      {/* 추천 루틴 */}
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
                      <li key={exercise.id}>
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
            <Plus size={40} className="text-gray-400 mb-4" />
            <div key="no-routine">
              <p className="text-gray-600 font-medium">루틴이 없습니다</p>
              <p className="text-gray-500 text-sm mt-1">클릭하여 루틴을 추가해보세요</p>
            </div>
          </div>
        )}
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1">
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center">
            <div className="p-3 rounded-full" style={{ backgroundColor: "rgba(108, 167, 175, 0.2)" }}>
              <TrendingUp size={24} style={{ color: "#6ca7af" }} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">이번 주 운동일수</p>
              <p className="text-2xl font-semibold text-gray-800">{thisWeekWorkoutDays}일</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
