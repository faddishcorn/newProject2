"use client"

import { useState, useEffect } from "react"
import { Activity, TrendingUp } from "lucide-react"

export default function MainPage() {
  const [greeting, setGreeting] = useState("")
  const [userName, setUserName] = useState("사용자")
  const [stats, setStats] = useState({
    totalWorkouts: 23,
    thisWeek: 3,
  })

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

    // 실제 구현에서는 API에서 사용자 정보를 가져올 것입니다
    setUserName("홍길동")
  }, [])

  // 오늘의 날짜 포맷팅
  const today = new Date()
  const formattedDate = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`

  // 추천 운동 루틴 데이터
  const recommendedRoutines = [
    {
      id: 1,
      title: "상체 집중 루틴",
      description: "팔, 가슴, 어깨를 집중적으로 단련하는 루틴",
      duration: "45분",
      level: "중급",
    },
    {
      id: 2,
      title: "전신 HIIT 운동",
      description: "짧은 시간에 효과적인 전신 고강도 인터벌 트레이닝",
      duration: "30분",
      level: "고급",
    },
    {
      id: 3,
      title: "초보자를 위한 기초 운동",
      description: "기본적인 동작으로 구성된 전신 운동",
      duration: "40분",
      level: "초급",
    },
  ]

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
      </div>

      {/* 통계 카드 */}
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

      {/* 추천 루틴 섹션 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">추천 운동 루틴</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendedRoutines.map((routine) => (
            <div key={routine.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-gray-800">{routine.title}</h3>
              <p className="text-gray-600 text-sm mt-1">{routine.description}</p>
              <div className="flex justify-between mt-3 text-sm text-gray-500">
                <span>소요시간: {routine.duration}</span>
                <span>난이도: {routine.level}</span>
              </div>
              <button
                className="w-full mt-3 px-3 py-2 rounded-md text-white text-sm font-medium transition-colors"
                style={{ backgroundColor: "#6ca7af" }}
              >
                루틴 시작하기
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
