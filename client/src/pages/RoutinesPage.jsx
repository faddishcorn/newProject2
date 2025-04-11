"use client"

import { useState, useEffect, useRef } from "react"
import { Trash2, Plus, Send, Clock, BarChart } from "lucide-react"

export default function RoutinesPage() {
  const [promptInput, setPromptInput] = useState("")
  const textareaRef = useRef(null)

  // 저장된 루틴 목록 (실제로는 API에서 가져올 것입니다)
  const [savedRoutines, setSavedRoutines] = useState([
    {
      id: 1,
      title: "상체 집중 루틴",
      description: "팔, 가슴, 어깨를 집중적으로 단련하는 루틴",
      duration: "45분",
      level: "중급",
      createdAt: "2023-04-15",
    },
    {
      id: 2,
      title: "전신 HIIT 운동",
      description: "짧은 시간에 효과적인 전신 고강도 인터벌 트레이닝",
      duration: "30분",
      level: "고급",
      createdAt: "2023-05-20",
    },
    {
      id: 3,
      title: "초보자를 위한 기초 운동",
      description: "기본적인 동작으로 구성된 전신 운동",
      duration: "40분",
      level: "초급",
      createdAt: "2023-06-10",
    },
    {
      id: 4,
      title: "하체 강화 루틴",
      description: "하체 근력을 집중적으로 향상시키는 운동 루틴",
      duration: "50분",
      level: "중급",
      createdAt: "2023-07-05",
    },
  ])

  // 텍스트 영역 자동 크기 조절
  useEffect(() => {
    if (textareaRef.current) {
      // 높이 초기화
      textareaRef.current.style.height = "120px"
      // 스크롤 높이에 맞게 조정 (최소 120px)
      const scrollHeight = textareaRef.current.scrollHeight
      textareaRef.current.style.height = Math.max(120, scrollHeight) + "px"
    }
  }, [promptInput])

  const handlePromptSubmit = (e) => {
    e.preventDefault()
    if (!promptInput.trim()) return

    // 실제로는 여기서 AI API 호출 등의 로직이 들어갈 것입니다
    console.log("프롬프트 제출:", promptInput)

    // 입력 필드 초기화
    setPromptInput("")

    // 여기서 AI 응답을 처리하고 새 루틴을 생성하는 로직이 들어갈 것입니다
  }

  const handleEditRoutine = (routineId) => {
    // 실제로는 여기서 루틴 편집 모달을 열거나 편집 페이지로 이동하는 로직이 들어갈 것입니다
    console.log("루틴 편집:", routineId)
  }

  const handleDeleteRoutine = (routineId) => {
    // 실제로는 여기서 삭제 확인 모달을 표시하고 확인 시 삭제하는 로직이 들어갈 것입니다
    console.log("루틴 삭제:", routineId)

    // 임시 구현: 해당 ID의 루틴을 목록에서 제거
    setSavedRoutines(savedRoutines.filter((routine) => routine.id !== routineId))
  }

  return (
    <div className="space-y-8">
      {/* 헤더 섹션 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800">루틴 관리</h1>
        <p className="text-gray-600 mt-1">맞춤형 운동 루틴을 생성하고 관리하세요</p>
      </div>

      {/* 프롬프트 입력 섹션 */}
      <div className="bg-white rounded-lg shadow-sm p-8 flex flex-col items-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">오늘은 어떤 운동을 해볼까요?</h2>
        <p className="text-gray-600 mb-6 text-center max-w-2xl">
          원하는 운동 루틴을 자연어로 설명해보세요. 예: "30분 동안 할 수 있는 상체 위주의 홈트레이닝 루틴 추천해줘"
        </p>

        <form onSubmit={handlePromptSubmit} className="w-full max-w-2xl">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder="원하는 운동 루틴을 설명해보세요..."
              className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6ca7af] focus:border-transparent resize-none overflow-hidden"
              style={{
                minHeight: "120px",
                whiteSpace: "pre-wrap",
                overflowWrap: "break-word",
              }}
            />
            <button
              type="submit"
              className="absolute right-3 bottom-3 p-2 rounded-full"
              style={{ backgroundColor: "#6ca7af" }}
            >
              <Send size={18} className="text-white" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">AI가 입력한 내용을 바탕으로 맞춤형 운동 루틴을 생성합니다.</p>
        </form>
      </div>

      {/* 새 루틴 생성 버튼 */}
      <div className="flex justify-end">
        <button
          className="flex items-center px-4 py-2 rounded-md text-white font-medium transition-colors"
          style={{ backgroundColor: "#6ca7af" }}
        >
          <Plus size={18} className="mr-2" />새 루틴 만들기
        </button>
      </div>

      {/* 저장된 루틴 목록 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">내 루틴 목록</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {savedRoutines.map((routine) => (
            <div key={routine.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-gray-800">{routine.title}</h3>
                <button
                  onClick={() => handleDeleteRoutine(routine.id)}
                  className="p-1 rounded-full hover:bg-gray-100 text-red-500"
                  title="루틴 삭제"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <p className="text-gray-600 text-sm mt-1 line-clamp-2">{routine.description}</p>

              <div className="flex items-center mt-3 text-xs text-gray-500">
                <Clock size={14} className="mr-1" />
                <span className="mr-3">{routine.duration}</span>
                <BarChart size={14} className="mr-1" />
                <span>{routine.level}</span>
              </div>

              <div className="flex justify-center mt-4">
                <button
                  onClick={() => handleEditRoutine(routine.id)}
                  className="w-full px-3 py-2 rounded-md text-white text-sm font-medium transition-colors"
                  style={{ backgroundColor: "#6ca7af" }}
                >
                  루틴 수정하기
                </button>
              </div>
            </div>
          ))}
        </div>

        {savedRoutines.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>저장된 루틴이 없습니다. 새 루틴을 만들어보세요!</p>
          </div>
        )}
      </div>
    </div>
  )
}
