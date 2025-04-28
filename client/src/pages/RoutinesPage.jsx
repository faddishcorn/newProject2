"use client"

import { useState, useEffect, useRef, memo } from "react"
import { Trash2, Plus, Send, X, Save, Loader, AlertTriangle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import RoutineEditor from "../components/RoutineEditor"
import { toast } from "react-toastify"
import axiosInstance from '../api/axiosInstance';

export default function RoutinesPage() {
  const [promptInput, setPromptInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [generatedRoutine, setGeneratedRoutine] = useState(null)
  const [isCreatingNewRoutine, setIsCreatingNewRoutine] = useState(false)
  const [newRoutine, setNewRoutine] = useState(null)
  const [savedRoutines, setSavedRoutines] = useState([]);
  // 수정 중인 루틴 상태
  const [editingRoutine, setEditingRoutine] = useState(null);
  const textareaRef = useRef(null)
  const navigate = useNavigate()
  const [error, setError] = useState(null)
  const [routineToDelete, setRoutineToDelete] = useState(null); 
  
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

  useEffect(() => {
    const fetchSavedRoutines = async () => {
      try {
        const res = await axiosInstance.get(`/api/routines`);
        setSavedRoutines(res.data);
      } catch (err) {
        console.error("루틴 목록 불러오기 실패:", err);
        toast.error("루틴 목록 불러오기 실패, 다시 시도해주세요😥");
      }
    };
  
    fetchSavedRoutines();
  }, []);

  const handlePromptSubmit = async (e) => {
    e.preventDefault();
    if (!promptInput.trim()) return;
  
    setIsLoading(true);
    setError(null); // 이전 에러 초기화
  
    try {
      const res = await axiosInstance.post(
        `/api/gpt/generate-routine`,
        { prompt: promptInput },);
  
      if (!res.data || !Array.isArray(res.data)) {
        throw new Error("루틴 형식이 잘못되었습니다.");
      }
  
      const aiRoutine = {
        title: "AI 생성 루틴",
        exercises: res.data.map((item, idx) => ({
          id: Date.now() + idx,
          name: item.name,
          sets: item.sets,
          reps: item.reps,
          isCompleted: false,
        })),
      };
  
      setGeneratedRoutine(aiRoutine);
    } catch (err) {
      console.error("GPT 루틴 생성 실패:", err);
      const message = err.response?.data?.message || "루틴 생성 중 오류가 발생했습니다.";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNewRoutine = () => {
    // 새 루틴 템플릿 생성
    setNewRoutine({
      title: "새 루틴",
      exercises: [{ id: Date.now(), name: "운동 1", sets: 3, reps: 10, isCompleted: false }],
    })
    setIsCreatingNewRoutine(true)
  }

  const handleEditRoutine = (routineId) => {
    const target = savedRoutines.find((r) => r._id === routineId);
    if (target) {
      const clonedExercises = target.exercises.map((ex, idx) => ({
        id: ex._id || ex.id || idx,
        ...ex,
      }));
      setEditingRoutine({ ...target, exercises: clonedExercises });
    }
  };

  const handleUpdateRoutine = async (routine) => {
    try {
      const res = await axiosInstance.put(
        `/api/routines/${routine._id}`,
        {
          title: routine.title,
          exercises: routine.exercises.map(({ name, sets, reps }) => ({ name, sets, reps })),
        });
  
      const updated = savedRoutines.map((r) => (r._id === res.data._id ? res.data : r));
      setSavedRoutines(updated);
      setEditingRoutine(null);
      setGeneratedRoutine(null);
      setIsCreatingNewRoutine(false);
      setPromptInput("");
    } catch (err) {
      console.error("루틴 수정 실패:", err);
      toast.error("루틴 수정 실패, 다시 시도해주세요😥");
    }
  };

  const handleDeleteRoutine = async (routineId) => {
    try {
      await axiosInstance.delete(`/api/routines/${routineId}`);
      setSavedRoutines(savedRoutines.filter((routine) => routine._id !== routineId));
    } catch (err) {
      console.error("루틴 삭제 실패:", err);
      toast.error("루틴 삭제 실패, 다시 시도해주세요😥");
    }
  };

  // 저장 핸들러 라우팅
const handleSaveRoutine = (routine) => {
  if (routine._id) {
    handleUpdateRoutine(routine);
  } else {
    handleCreateRoutine(routine);
  }
};

  // 루틴 저장 (새 루틴용)
const handleCreateRoutine = async (routine) => {
  try {
    const res = await axiosInstance.post(
      `/api/routines`,
      {
        title: routine.title,
        exercises: routine.exercises.map(({ name, sets, reps }) => ({ name, sets, reps })),
      });

    setSavedRoutines([res.data, ...savedRoutines]);
    setGeneratedRoutine(null);
    setNewRoutine(null);
    setIsCreatingNewRoutine(false);
    setPromptInput("");
    navigate("/main");
  } catch (err) {
    console.error("루틴 저장 실패:", err);
    toast.error("루틴 저장 실패, 다시 시도해주세요😥");
  }
};

const handleCancelRoutine = () => {
  setEditingRoutine(null);
  setGeneratedRoutine(null);
  setNewRoutine(null);
  setIsCreatingNewRoutine(false);
  setPromptInput("");
};

const handleRoutineTitleChange = (e, isNew = false) => {
  const updatedTitle = e.target.value;
  if (isNew) {
    setNewRoutine((prev) => ({ ...prev, title: updatedTitle }));
  } else if (editingRoutine) {
    setEditingRoutine((prev) => ({ ...prev, title: updatedTitle }));
  } else {
    setGeneratedRoutine((prev) => ({ ...prev, title: updatedTitle }));
  }
};

  // 운동 수정
  const handleExerciseChange = (exerciseId, field, value, isNew = false) => {
    const updateRoutine = (routine) => {
      const updatedExercises = routine.exercises.map((ex) =>
        (ex.id === exerciseId || ex._id === exerciseId)
          ? { ...ex, [field]: value }
          : ex
      );
      return {
        ...routine,
        exercises: updatedExercises
      };
    };
  
    if (isNew) {
      setNewRoutine(updateRoutine);
    } else if (editingRoutine) {
      setEditingRoutine(updateRoutine);
    } else {
      setGeneratedRoutine(updateRoutine);
    }
  };


  // 운동 삭제
  const handleRemoveExercise = (exerciseId, isNew = false) => {
    const updateRoutine = (routine) => {
      const filteredExercises = routine.exercises.filter(
        (ex) => ex.id !== exerciseId && ex._id !== exerciseId
      );
      return { ...routine, exercises: filteredExercises };
    };
    if (isNew) {
      setNewRoutine((prev) => updateRoutine(prev));
    } else if (editingRoutine) {
      setEditingRoutine((prev) => updateRoutine(prev));
    } else {
      setGeneratedRoutine((prev) => updateRoutine(prev));
    }
  };

  // 운동 추가
  const handleAddExercise = (isNew = false) => {
    const newExercise = {
      id: Date.now(),
      name: "새 운동",
      sets: 3,
      reps: 10,
      isCompleted: false,
    };
  
    if (isNew) {
      setNewRoutine({ ...newRoutine, exercises: [...newRoutine.exercises, newExercise] });
    } else if (editingRoutine) {
      setEditingRoutine({ ...editingRoutine, exercises: [...editingRoutine.exercises, newExercise] });
    } else {
      setGeneratedRoutine({ ...generatedRoutine, exercises: [...generatedRoutine.exercises, newExercise] });
    }
  };

  // 로딩 중이거나 루틴이 생성된 경우 메인 컨텐츠를 표시하지 않음
  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* 헤더 섹션 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-800">루틴 생성</h1>
          <p className="text-gray-600 mt-1">AI가 맞춤형 운동 루틴을 생성하고 있습니다...</p>
        </div>

        {/* 로딩 상태 */}
        <div className="flex flex-col items-center justify-center py-16">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader size={48} className="animate-spin text-[#6ca7af]" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-30">
              <Loader size={64} className="animate-spin text-[#6ca7af] animation-delay-300" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <Loader size={80} className="animate-spin text-[#6ca7af] animation-delay-600" />
            </div>
          </div>
          <p className="mt-6 text-lg font-medium text-gray-700">AI가 루틴을 생성하고 있습니다</p>
          <p className="mt-2 text-sm text-gray-500">잠시만 기다려주세요...</p>
          

        </div>
      </div>
    )
  }

  // AI 생성 루틴 편집 화면
  if (generatedRoutine) {
    return (
      <div className="space-y-8">
        {/* 헤더 섹션 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-800">루틴 생성</h1>
          <p className="text-gray-600 mt-1">생성된 루틴을 확인하고 수정하세요</p>
        </div>

        {/* 루틴 편집기 */}
        {/* <RoutineEditor routine={generatedRoutine} isNew={false} /> */}
        {generatedRoutine && (
  <RoutineEditor
    routine={generatedRoutine}
    isNew={false}
    onChangeTitle={handleRoutineTitleChange}
    onChangeExercise={handleExerciseChange}
    onAddExercise={handleAddExercise}
    onRemoveExercise={handleRemoveExercise}
    onCancel={handleCancelRoutine}
    onSave={handleSaveRoutine}
  />
)}
      </div>
    )
  }

  // 새 루틴 생성 화면
  if (isCreatingNewRoutine && newRoutine) {
    return (
      <div className="space-y-8">
        {/* 헤더 섹션 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-800">새 루틴 만들기</h1>
          <p className="text-gray-600 mt-1">새로운 운동 루틴을 직접 만들어보세요</p>
        </div>

        {/* 루틴 편집기 */}
        {/* 조건부 렌더링: newRoutine이 존재할 때만 렌더 */}
      {newRoutine && (
        <RoutineEditor
          routine={newRoutine}
          isNew={true}
          onChangeTitle={handleRoutineTitleChange}
          onChangeExercise={handleExerciseChange}
          onAddExercise={handleAddExercise}
          onRemoveExercise={handleRemoveExercise}
          onCancel={handleCancelRoutine}
          onSave={handleSaveRoutine}
        />
      )}
      </div>
    )
  }

  if (editingRoutine) {
    return (
      <div className="space-y-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-800">루틴 수정</h1>
          <p className="text-gray-600 mt-1">루틴을 편집하고 저장하세요</p>
        </div>
        <RoutineEditor
  routine={editingRoutine}
  isNew={false}
  onChangeTitle={handleRoutineTitleChange}
  onChangeExercise={handleExerciseChange}
  onAddExercise={handleAddExercise}
  onRemoveExercise={handleRemoveExercise}
  onCancel={handleCancelRoutine}
  onSave={handleSaveRoutine}
/>
      </div>
    );
  }
  
  // 기본 루틴 관리 화면
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
          원하는 운동 루틴을 자연어로 아주 자유롭게 설명해보세요. 예: "상체는 헬스장, 하체는 홈트 루틴으로 섞어서1시간분량 루틴 추천해줘"
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
          onClick={handleCreateNewRoutine}
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
            <div key={routine._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-gray-800">{routine.title}</h3>
                <button
  onClick={() => setRoutineToDelete(routine._id)} // 클릭 시 루틴 ID만 저장
  className="p-1 rounded-full hover:bg-gray-100 text-red-500"
  title="루틴 삭제"
>
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-2">{routine.exercises.length}개 운동</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  {routine.exercises.slice(0, 3).map((exercise) => (
                    <li key={`${exercise.name}-${exercise.sets}-${exercise.reps}`} className="truncate">
                      • {exercise.name} ({exercise.sets}세트 x {exercise.reps}회)
                    </li>
                  ))}
                  {routine.exercises.length > 3 && (
                    <li className="text-gray-400">• 그 외 {routine.exercises.length - 3}개 운동</li>
                  )}
                </ul>
              </div>

              <div className="flex justify-center mt-4">
                <button
                  onClick={() => handleEditRoutine(routine._id)}
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
        {routineToDelete && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 animate-fade-in">
      <div className="flex items-center text-red-500 mb-4">
        <AlertTriangle className="h-6 w-6 mr-2" />
        <h3 className="text-lg font-bold">루틴 삭제 확인</h3>
      </div>

      <p className="text-gray-700 mb-6">
        정말로 이 루틴을 삭제하시겠습니까? 삭제 후 복구는 불가능합니다.
      </p>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => setRoutineToDelete(null)}
          className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          취소
        </button>
        <button
          type="button"
          onClick={async () => {
            await handleDeleteRoutine(routineToDelete);
            setRoutineToDelete(null);
          }}
          className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
        >
          루틴 삭제
        </button>
      </div>
    </div>
  </div>
)}

      </div>
    </div>
  )
}
