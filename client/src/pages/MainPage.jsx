"use client";

import { useState, useEffect, useRef } from "react";
import { Activity, TrendingUp, ArrowRight, Plus, Send } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import axiosInstance from "../api/axiosInstance";
import { getLocalRoutines } from "../utils/localStorageUtils";

export default function MainPage() {
  const [greeting, setGreeting] = useState("");
  const [userName, setUserName] = useState("운동하는 친구");
  const [userId, setUserId] = useState("");
  const [thisWeekWorkoutDays, setThisWeekWorkoutDays] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [recommendedRoutines, setRecommendedRoutines] = useState([]);
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);
  const [completedRoutineTitle, setCompletedRoutineTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState("");
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const commentInputRef = useRef(null);

  // 오늘 날짜
  const today = new Date();
  const formattedDate = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;

  // 시간에 따른 인사말 설정
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting("좋은 아침이에요");
    } else if (hour >= 12 && hour < 18) {
      setGreeting("좋은 오후에요");
    } else {
      setGreeting("좋은 저녁이에요");
    }
  }, []);

  // 사용자 이름 가져오기
  useEffect(() => {
    const fetchUser = async () => {
      if (isAuthenticated) {
        try {
          const res = await axiosInstance.get(`/api/auth/me`);
          setUserName(res.data.username);
          setUserId(res.data._id);
        } catch (err) {
          console.error("사용자 정보 불러오기 실패", err);
          toast.error("사용자 정보 불러오기 실패, 다시 시도해주세요😥");
        }
      }
    };
    fetchUser();
  }, [isAuthenticated]);

  // 이번 주 운동 기록 가져오기
  useEffect(() => {
    const fetchWorkoutDates = async () => {
      if (!isAuthenticated) {
        // 비회원인 경우 로컬 스토리지에서 운동 기록 확인
        const localWorkoutLogs = JSON.parse(localStorage.getItem('workoutLogs') || '[]');
        
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); // 일요일
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + (6 - today.getDay())); // 토요일
        endOfWeek.setHours(23, 59, 59, 999);

        const uniqueWorkoutDays = new Set(
          localWorkoutLogs
            .map(log => new Date(log.date))
            .filter((date) => date >= startOfWeek && date <= endOfWeek)
            .map((date) => date.toDateString())
        );

        setThisWeekWorkoutDays(uniqueWorkoutDays.size);
        return;
      }

      if (!userId) return; // 회원이지만 아직 userId를 못 불러왔으면 대기

      try {
        const res = await axiosInstance.get(
          `/api/workout-logs/dates/${userId}`,
        );
        const dates = res.data;

        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); // 일요일
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + (6 - today.getDay())); // 토요일
        endOfWeek.setHours(23, 59, 59, 999);

        const uniqueWorkoutDays = new Set(
          dates
            .map((d) => new Date(d))
            .filter((date) => date >= startOfWeek && date <= endOfWeek)
            .map((date) => date.toDateString()),
        );

        setThisWeekWorkoutDays(uniqueWorkoutDays.size);
      } catch (err) {
        console.error("운동 기록 날짜 불러오기 실패", err);
      }
    };

    fetchWorkoutDates();
  }, [userId, isAuthenticated]);

  // 루틴 목록 가져오기
  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        if (isAuthenticated) {
          // 회원인 경우 서버에서 루틴 가져오기
          const res = await axiosInstance.get(`/api/routines`);
          setRecommendedRoutines(res.data);
        } else {
          // 비회원인 경우 로컬 스토리지에서 루틴 가져오기
          const localRoutines = getLocalRoutines();
          setRecommendedRoutines(localRoutines);
        }
      } catch (err) {
        console.error("루틴 목록 불러오기 실패", err);
        toast.error("루틴 목록을 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoutines();
  }, [isAuthenticated]);

  // 루틴 완료 메시지 표시
  useEffect(() => {
    if (location.state?.routineCompleted) {
      setShowCompletionMessage(true);
      setCompletedRoutineTitle(location.state.routineTitle);

      const timer = setTimeout(() => setShowCompletionMessage(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [location]);

  const handleStartRoutine = (routine) => {
    navigate(`/routine-execution/${routine.id}`, {
      state: { routine },
    });
  };

  // 댓글 관련 함수들
  const fetchComments = async () => {
    if (!isAuthenticated || !userId) return;
    
    try {
      setIsLoadingComments(true);
      const res = await axiosInstance.get(`/api/workout-logs/${userId}/comments`);
      setComments(res.data);
    } catch (error) {
      console.error("댓글 조회 실패", error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setIsSubmittingComment(true);
      const res = await axiosInstance.post(`/api/workout-logs/${userId}/comments`, {
        content: newComment,
      });
      setComments([...comments, res.data]);
      setNewComment("");
    } catch (error) {
      console.error("댓글 작성 실패", error);
      toast.error("댓글 작성에 실패했습니다.");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditedCommentText(comment.content);
    setTimeout(() => {
      if (commentInputRef.current) {
        commentInputRef.current.focus();
      }
    }, 0);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditedCommentText("");
  };

  const handleSaveEdit = async (commentId) => {
    if (!editedCommentText.trim()) return;
    try {
      setIsSubmittingComment(true);
      await axiosInstance.put(`/api/workout-logs/comments/${commentId}`, {
        content: editedCommentText,
      });

      const updated = comments.map((comment) =>
        comment.id === commentId
          ? { ...comment, content: editedCommentText }
          : comment
      );
      setComments(updated);
      setEditingCommentId(null);
      setEditedCommentText("");
    } catch (error) {
      console.error("댓글 수정 실패", error);
      toast.error("댓글 수정에 실패했습니다.");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;
    try {
      await axiosInstance.delete(`/api/workout-logs/comments/${commentId}`);
      setComments(comments.filter((c) => c.id !== commentId));
      toast.success("댓글이 삭제되었습니다.");
    } catch (error) {
      console.error("댓글 삭제 실패", error);
      toast.error("댓글 삭제에 실패했습니다.");
    }
  };

  // 댓글 불러오기
  useEffect(() => {
    if (isAuthenticated && userId) {
      fetchComments();
    }
  }, [userId, isAuthenticated]);

  // 로딩 중이면 로딩 스피너 표시
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6ca7af]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {greeting}, {userName}님!
        </h1>
        <p className="text-gray-600 mt-1">{formattedDate}</p>

        {showCompletionMessage && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg animate-fade-in">
            <p className="font-medium">
              "{completedRoutineTitle}" 루틴을 완료했습니다! 🎉
            </p>
            <p className="text-sm">오늘의 운동 기록이 저장되었습니다.</p>
          </div>
        )}
      </div>

      {/* 추천 루틴 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          오늘의 루틴을 골라보세요
        </h2>

        {recommendedRoutines.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendedRoutines.map((routine) => (
              <div
                key={routine.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-gray-800">{routine.title}</h3>
                <p className="text-gray-600 text-sm mt-1">
                  {routine.description}
                </p>
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-2">
                    {routine.exercises.length}개 운동
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {routine.exercises.map((exercise) => (
                      <li key={exercise.id}>
                        • {exercise.name} ({exercise.sets}세트 x {exercise.reps}
                        회)
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
            className="border border-dashed border-gray-300 rounded-lg p-8 text-center items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div key="no-routine">
              <div className="flex justify-center">
                <Plus size={40} className="text-gray-400 mb-4" />
              </div>
              <p className="text-gray-600 font-medium">루틴이 없습니다</p>
              <p className="text-gray-500 text-sm mt-1">
                클릭하여 루틴을 추가해보세요
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1">
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center">
            <div
              className="p-3 rounded-full"
              style={{ backgroundColor: "rgba(108, 167, 175, 0.2)" }}
            >
              <TrendingUp size={24} style={{ color: "#6ca7af" }} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                이번 주 운동일수
              </p>
              <p className="text-2xl font-semibold text-gray-800">
                {thisWeekWorkoutDays}일
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 댓글 섹션 - 로그인한 경우에만 표시 */}
      {isAuthenticated && (
        <div className="bg-white rounded-lg shadow-sm p-4 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">댓글</h2>
          </div>

          {isLoadingComments ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#6ca7af]"></div>
            </div>
          ) : (
            <div className="space-y-4 mb-4 max-h-60 overflow-y-auto">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50"
                  >
                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium text-gray-900">
                            {comment.author?.username || "사용자"}
                          </span>
                          <span className="text-sm text-gray-500 ml-2">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {comment.author?._id === userId && (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEditComment(comment)}
                              className="text-sm text-gray-500 hover:text-gray-700"
                            >
                              수정
                            </button>
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="text-sm text-red-500 hover:text-red-700"
                            >
                              삭제
                            </button>
                          </div>
                        )}
                      </div>
                      {editingCommentId === comment.id ? (
                        <div className="mt-2 flex items-center space-x-2">
                          <input
                            type="text"
                            value={editedCommentText}
                            onChange={(e) => setEditedCommentText(e.target.value)}
                            ref={commentInputRef}
                            className="flex-grow px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6ca7af]"
                          />
                          <button
                            onClick={() => handleSaveEdit(comment.id)}
                            disabled={isSubmittingComment}
                            className="px-3 py-1 bg-[#6ca7af] text-white rounded-md text-sm hover:bg-[#5a8f96]"
                          >
                            저장
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300"
                          >
                            취소
                          </button>
                        </div>
                      ) : (
                        <p className="mt-1 text-gray-700">{comment.content}</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">
                  아직 댓글이 없습니다.
                </p>
              )}
            </div>
          )}

          <form onSubmit={handleSubmitComment} className="flex space-x-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글을 입력하세요..."
              className="min-w-0 flex-1 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6ca7af] focus:border-transparent"
              disabled={isSubmittingComment}
            />
            <button
              type="submit"
              disabled={!newComment.trim() || isSubmittingComment}
              className="px-4 py-2 rounded-md bg-[#6ca7af] text-white font-medium hover:bg-[#5a8f96] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmittingComment ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-1"></div>
              ) : (
                <Send className="h-4 w-4 mr-1" />
              )}
              댓글 작성
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
