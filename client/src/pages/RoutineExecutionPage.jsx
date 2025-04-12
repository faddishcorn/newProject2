"use client"

import { useState } from "react"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { CheckCircle, ArrowLeft, Trophy } from "lucide-react"

export default function RoutineExecutionPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { routineId } = useParams()
  
  // 실제로는 API에서 루틴 정보를 가져올 것입니다
  const [routine, setRoutine] = useState(
    location.state?.routine || {
      id: Number.parseInt(routineId) || 1,
      title: "",
      exercises: [],
    }
  );

  // 완료된 운동 수 계산
  const completedExercises = routine.exercises.filter((ex) => ex.isCompleted).length
  const totalExercises = routine.exercises.length
  const allCompleted = completedExercises === totalExercises

  // 격려 메시지 생성
  const getEncouragementMessage = () => {
    const percentage = (completedExercises / totalExercises) * 100

    if (percentage === 0) return "운동을 시작해볼까요? 화이팅!"
    if (percentage < 50) return "좋아요! 계속 진행해보세요!"
    if (percentage < 100) return "절반 이상 완료했어요! 조금만 더 힘내세요!"
    return "대단해요! 모든 운동을 완료했습니다!"
  }

  // 운동 완료 상태 토글
  const toggleExerciseCompletion = (exerciseId) => {
    setRoutine({
      ...routine,
      exercises: routine.exercises.map((exercise) =>
        exercise.id === exerciseId ? { ...exercise, isCompleted: !exercise.isCompleted } : exercise,
      ),
    })
  }

  // 루틴 완료 처리
  const handleCompleteRoutine = () => {
    // 실제로는 여기서 API를 통해 완료된 루틴을 저장합니다
    console.log("루틴 완료:", routine)

    // 메인 페이지로 이동
    navigate("/main", {
      state: {
        routineCompleted: true,
        routineTitle: routine.title,
      },
    })
  }

  // 취소 처리
  const handleCancel = () => {
    navigate("/main")
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center mb-4">
          <button onClick={handleCancel} className="p-2 rounded-full hover:bg-gray-100 mr-2">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">오늘의 운동</h1>
            <p className="text-gray-600">{routine.title}</p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-gray-700 font-medium">{getEncouragementMessage()}</p>
            <p className="text-sm text-gray-500">
              {completedExercises}/{totalExercises} 완료
            </p>
          </div>

          {/* 진행 상태 바 */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div
              className="h-2.5 rounded-full"
              style={{
                width: `${(completedExercises / totalExercises) * 100}%`,
                backgroundColor: "#6ca7af",
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* 운동 목록 */}
      <div className="space-y-4">
        {routine.exercises.map((exercise) => (
          <div
            key={exercise.id}
            className={`p-4 rounded-lg border transition-colors ${
              exercise.isCompleted ? "border-green-200 bg-green-50" : "border-gray-200 bg-white"
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className={`font-medium ${exercise.isCompleted ? "text-green-700" : "text-gray-800"}`}>
                  {exercise.name}
                </h3>
                <p className={`text-sm ${exercise.isCompleted ? "text-green-600" : "text-gray-500"}`}>
                  {exercise.sets} 세트 x {exercise.reps} 회
                </p>
              </div>
              <button
                onClick={() => toggleExerciseCompletion(exercise.id)}
                className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  exercise.isCompleted
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {exercise.isCompleted ? (
                  <>
                    <CheckCircle size={16} className="mr-1.5" />
                    완료됨
                  </>
                ) : (
                  "운동 완료"
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 하단 버튼 */}
      <div className="flex flex-col space-y-3 pt-4">
        <button
          onClick={handleCompleteRoutine}
          className={`flex items-center justify-center px-4 py-3 rounded-md text-white font-medium transition-colors ${
            allCompleted ? "bg-green-600 hover:bg-green-700" : "bg-[#6ca7af] hover:bg-[#5a8f96]"
          }`}
        >
          {allCompleted && <Trophy size={18} className="mr-2" />}
          오늘의 루틴 완료!
        </button>
        <button
          onClick={handleCancel}
          className="px-4 py-3 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          취소
        </button>
      </div>
    </div>
  )
}
