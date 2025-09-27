"use client";

import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { CheckCircle, ArrowLeft, Trophy } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import axiosInstance from "../api/axiosInstance";
import { saveWorkoutLog } from "../utils/workoutLogUtils";

export default function RoutineExecutionPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { routineId } = useParams();
  const [isAuthenticated] = useState(!!localStorage.getItem("token"));

  const [routine, setRoutine] = useState(() => {
    const initialRoutine = location.state?.routine || {
      id: Number.parseInt(routineId) || 1,
      title: "",
      exercises: [],
    };

    // 각 운동에 고유 ID 부여
    return {
      ...initialRoutine,
      exercises: initialRoutine.exercises.map((exercise, index) => ({
        ...exercise,
        uniqueId: exercise.id || exercise._id || `exercise-${index}-${Date.now()}`
      }))
    };
  });

  const completedExercises = routine.exercises.filter(
    (ex) => ex.isCompleted,
  ).length;
  const totalExercises = routine.exercises.length;
  const allCompleted = completedExercises === totalExercises;

  const getEncouragementMessage = () => {
    const percentage = (completedExercises / totalExercises) * 100;

    if (percentage === 0) return "운동을 시작해볼까요? 화이팅!";
    if (percentage < 50) return "좋아요! 계속 진행해보세요!";
    if (percentage < 100) return "절반 이상 완료했어요! 조금만 더 힘내세요!";
    return "대단해요! 모든 운동을 완료했습니다!";
  };

  const toggleExerciseCompletion = (uniqueId) => {
    setRoutine((prev) => ({
      ...prev,
      exercises: prev.exercises.map((exercise) =>
        exercise.uniqueId === uniqueId
          ? { ...exercise, isCompleted: !exercise.isCompleted }
          : exercise
      ),
    }));
  };

  // YYYY-MM-DD 형식으로 날짜를 변환하는 함수
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleCompleteRoutine = async () => {
    try {
      // 현재 날짜를 YYYY-MM-DD 형식으로 가져오기
      const today = new Date();
      const date = formatDate(today);

      if (isAuthenticated) {
        // 회원인 경우 서버에 저장
        await axiosInstance.post("/api/routines/history", {
          title: routine.title,
          exercises: routine.exercises,
          date: date,
        });
      } else {
        // 비회원인 경우 로컬 스토리지에 저장
        saveWorkoutLog({
          title: routine.title,
          exercises: routine.exercises,
          date: date,
        });
      }

      navigate("/main", {
        state: {
          routineCompleted: true,
          routineTitle: routine.title,
        },
      });
      
      toast.success("운동 기록이 저장되었습니다!", {
        position: "top-center",
      });
    } catch (err) {
      console.error("루틴 기록 저장 실패:", err);
      toast.error("루틴 저장 중 문제가 발생했습니다.");
    }
  };

  const handleCancel = () => {
    navigate("/main");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center mb-4">
          <button
            onClick={handleCancel}
            className="p-2 rounded-full hover:bg-gray-100 mr-2"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">오늘의 운동</h1>
            <p className="text-gray-600">{routine.title}</p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-gray-700 font-medium">
              {getEncouragementMessage()}
            </p>
            <p className="text-sm text-gray-500">
              {completedExercises}/{totalExercises} 완료
            </p>
          </div>

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

      <div className="space-y-4">
        {routine.exercises.map((exercise) => (
          <div
            key={exercise.uniqueId}
            className={`p-4 rounded-lg border transition-colors ${
              exercise.isCompleted
                ? "border-green-200 bg-green-50"
                : "border-gray-200 bg-white"
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3
                  className={`font-medium ${exercise.isCompleted ? "text-green-700" : "text-gray-800"}`}
                >
                  {exercise.name}
                </h3>
                <p
                  className={`text-sm ${exercise.isCompleted ? "text-green-600" : "text-gray-500"}`}
                >
                  {exercise.sets} 세트 x {exercise.reps} 회
                </p>
              </div>
              <button
                onClick={() => toggleExerciseCompletion(exercise.uniqueId)}
                className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  exercise.isCompleted
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {exercise.isCompleted ? (
                  <>
                    <CheckCircle size={16} className="mr-1.5" /> 완료됨
                  </>
                ) : (
                  "운동 완료"
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col space-y-3 pt-4">
        <button
          onClick={handleCompleteRoutine}
          className={`flex items-center justify-center px-4 py-3 rounded-md text-white font-medium transition-colors ${
            allCompleted
              ? "bg-green-600 hover:bg-green-700"
              : "bg-[#6ca7af] hover:bg-[#5a8f96]"
          }`}
        >
          {allCompleted && <Trophy size={18} className="mr-2" />}
          {isAuthenticated ? "오늘의 루틴 완료!" : "운동 기록 저장하기"}
        </button>
        <button
          onClick={handleCancel}
          className="px-4 py-3 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          취소
        </button>
        {!isAuthenticated && (
          <p className="text-center text-sm text-gray-500">
            * 비회원으로 저장된 운동 기록은 이 브라우저에만 저장됩니다.{" "}
            <a href="/login" className="text-[#6ca7af] hover:underline">
              로그인
            </a>
            하여 기록을 동기화할 수 있습니다.
          </p>
        )}
      </div>
    </div>
  );
}
