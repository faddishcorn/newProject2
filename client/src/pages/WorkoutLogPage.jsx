"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "react-router-dom"
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Send,
  CheckCircle,
  Circle,
  Lock,
  Trash2,
  Edit2,
  Save,
  X,
  RefreshCw,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import DefaultAvatar from "../components/DefaultAvatar"
import axios from "axios";

export default function WorkoutLogPage() {
  const { userId } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [user, setUser] = useState(null)
  const [isOwnProfile, setIsOwnProfile] = useState(false)
  const [hasAccess, setHasAccess] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [dailyRoutines, setDailyRoutines] = useState([])
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState("")
  const [datesWithWorkouts, setDatesWithWorkouts] = useState([])
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editedCommentText, setEditedCommentText] = useState("")
  const [isYearPickerOpen, setIsYearPickerOpen] = useState(false)
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false)
  const [isLoadingComments, setIsLoadingComments] = useState(false)
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [currentUserId, setCurrentUserId] = useState(null);

  const commentInputRef = useRef(null)

  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
  
        // ✅ 무조건 내 정보 가져오기
        const resMe = await axios.get(`/api/auth/me`);
        const meData = resMe.data;
        setCurrentUserId(meData._id);
  
        if (userId) {
          // ✅ 타인 프로필 조회
          const resUser = await axios.get(`/api/users/${userId}`);
  
          const userData = resUser.data;
          userData.id = userData._id; // id 세팅
          setUser(userData);
          setIsOwnProfile(false);
  
          const canAccess = userData.isFollowing || !userData.isPrivate;
          setHasAccess(canAccess);
  
          if (canAccess) {
            fetchDatesWithWorkouts(userId);
            fetchComments(userId);
          }
        } else {
          // ✅ 내 프로필
          meData.id = meData._id; // id 세팅
          setUser(meData);
          setIsOwnProfile(true);
          setHasAccess(true);
  
          fetchDatesWithWorkouts(meData._id);
          fetchComments(meData._id);
        }
  
        setIsLoading(false);
      } catch (error) {
        console.error('WorkoutLogPage 초기화 오류:', error);
        setIsLoading(false);
      }
    };
  
    init();
  }, [userId]);
  
  useEffect(() => {
    const fetchRoutinesOnDateChange = async () => {
      try {
        if (!user) return; // 아직 유저 정보 없으면 패스
        const formattedDate = formatDate(selectedDate);
        const targetId = userId || user._id;
  
        const res = await axios.get(`/api/workout-logs/${targetId}/${formattedDate}`);
  
        setDailyRoutines(res.data);
      } catch (error) {
        console.error('선택 날짜 운동 기록 조회 실패', error);
        setDailyRoutines([]);
      }
    };
  
    if (hasAccess && user && user._id) {
      fetchRoutinesOnDateChange();
    }
  }, [selectedDate, user, hasAccess]);
  
  const fetchDatesWithWorkouts = async (targetId) => {
    try {
      const res = await axios.get(`/api/workout-logs/dates/${targetId}`);
      setDatesWithWorkouts(res.data);
    } catch (error) {
      console.error("운동 날짜 조회 실패", error);
    }
  };

  // 선택한 날짜의 운동 기록 가져오기
  const fetchDailyRoutines = async (date, targetId) => {
    try {
      const formattedDate = formatDate(date);
      const res = await axios.get(`/api/workout-logs/${targetId}/${formattedDate}`);
      setDailyRoutines(res.data);
    } catch (error) {
      console.error("운동 기록 조회 실패", error);
      setDailyRoutines([]);
    }
  };

  // 댓글 가져오기
  const fetchComments = async (targetId) => {
    try {
      setIsLoadingComments(true);
      const res = await axios.get(`/api/workout-logs/${targetId}/comments`);
      setComments(res.data);
      setIsLoadingComments(false);
    } catch (error) {
      console.error("댓글 조회 실패", error);
      setIsLoadingComments(false);
    }
  };

  // 날짜 선택 처리
  const handleDateSelect = (date) => {
    setSelectedDate(date)
    if (hasAccess) {
      fetchDailyRoutines(date, user.id)
    }
  }

  // 댓글 작성 처리
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
  
    try {
      setIsSubmittingComment(true);
  
      const res = await axios.post(
        `/api/workout-logs/${user._id}/comments`,
        { content: newComment }
      );
      setComments([...comments, res.data]);
      setNewComment("");
    } catch (error) {
      console.error("댓글 작성 실패", error);
    } finally {
      setIsSubmittingComment(false);
    }
  };
  


  // 댓글 수정 시작
  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id)
    setEditedCommentText(comment.content)

    // 다음 렌더링 후 포커스 설정
    setTimeout(() => {
      if (commentInputRef.current) {
        commentInputRef.current.focus()
      }
    }, 0)
  }

  // 댓글 수정 취소
  const handleCancelEdit = () => {
    setEditingCommentId(null)
    setEditedCommentText("")
  }

  // 댓글 수정 저장
  const handleSaveEdit = async (commentId) => {
    if (!editedCommentText.trim()) return;
    try {
      setIsSubmittingComment(true);
      await axios.put(
        `/api/workout-logs/comments/${commentId}`,
        { content: editedCommentText }
      );

      const updated = comments.map((comment) =>
        comment.id === commentId ? { ...comment, content: editedCommentText } : comment
      );
      setComments(updated);
      setEditingCommentId(null);
      setEditedCommentText("");
      setIsSubmittingComment(false);
    } catch (error) {
      console.error("댓글 수정 실패", error);
      setIsSubmittingComment(false);
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;
    try {
      setIsLoadingComments(true);
      await axios.delete(`/api/workout-logs/comments/${commentId}`);
      setComments(comments.filter((c) => c.id !== commentId));
      setIsLoadingComments(false);
    } catch (error) {
      console.error("댓글 삭제 실패", error);
      setIsLoadingComments(false);
    }
  };

  // 날짜 포맷 함수 (YYYY-MM-DD)
  const formatDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  // 이전 달로 이동
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  // 다음 달로 이동
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  // 이전 년도로 이동
  const prevYear = () => {
    const newYear = currentMonth.getFullYear() - 1
    setCurrentMonth(new Date(newYear, currentMonth.getMonth(), 1))
    setCurrentYear(newYear)
  }

  // 다음 년도로 이동
  const nextYear = () => {
    const newYear = currentMonth.getFullYear() + 1
    setCurrentMonth(new Date(newYear, currentMonth.getMonth(), 1))
    setCurrentYear(newYear)
  }

  // 특정 년도로 이동
  const goToYear = (year) => {
    setCurrentMonth(new Date(year, currentMonth.getMonth(), 1))
    setCurrentYear(year)
    setIsYearPickerOpen(false)
  }

  // 특정 월로 이동
  const goToMonth = (month) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), month, 1))
    setIsMonthPickerOpen(false)
  }

  // 년도 선택기 토글
  const toggleYearPicker = () => {
    setIsYearPickerOpen(!isYearPickerOpen)
    setIsMonthPickerOpen(false)
  }

  // 월 선택기 토글
  const toggleMonthPicker = () => {
    setIsMonthPickerOpen(!isMonthPickerOpen)
    setIsYearPickerOpen(false)
  }

  // 년도 선택기 렌더링
  const renderYearPicker = () => {
    const currentYear = currentMonth.getFullYear()
    const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i)

    return (
      <div className="absolute top-full left-0 mt-1 bg-white rounded-md shadow-lg z-10 p-2 w-full max-h-48 overflow-y-auto">
        <div className="grid grid-cols-3 gap-1">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => goToYear(year)}
              className={`p-2 text-sm rounded-md ${
                year === currentMonth.getFullYear() ? "bg-[#6ca7af] text-white" : "hover:bg-gray-100"
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>
    )
  }

  // 월 선택기 렌더링
  const renderMonthPicker = () => {
    const months = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]

    return (
      <div className="absolute top-full left-0 mt-1 bg-white rounded-md shadow-lg z-10 p-2 w-full">
        <div className="grid grid-cols-3 gap-1">
          {months.map((month, index) => (
            <button
              key={month}
              onClick={() => goToMonth(index)}
              className={`p-2 text-sm rounded-md ${
                index === currentMonth.getMonth() ? "bg-[#6ca7af] text-white" : "hover:bg-gray-100"
              }`}
            >
              {month}
            </button>
          ))}
        </div>
      </div>
    )
  }

  // 달력 렌더링
  const renderCalendar = () => {
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
    const startDate = new Date(monthStart)
    const endDate = new Date(monthEnd)

    // 달력의 시작일을 일요일로 맞추기
    startDate.setDate(startDate.getDate() - startDate.getDay())

    // 달력의 마지막일을 토요일로 맞추기
    if (endDate.getDay() < 6) {
      endDate.setDate(endDate.getDate() + (6 - endDate.getDay()))
    }

    // 요일 헤더
    const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"]
    const daysHeader = daysOfWeek.map((day) => (
      <div key={day} className="text-center font-medium py-2 text-xs sm:text-sm">
        {day}
      </div>
    ))

    // 날짜 생성
    const rows = []
    let days = []
    let day = new Date(startDate)

    // 주 단위로 날짜 생성
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = new Date(day)
        const formattedDay = formatDate(cloneDay)
        const isCurrentMonth = day.getMonth() === currentMonth.getMonth()
        const isToday = formatDate(day) === formatDate(new Date())
        const isSelected = formatDate(day) === formatDate(selectedDate)
        const hasWorkout = datesWithWorkouts.includes(formattedDay)

        days.push(
          <div
            key={formattedDay}
            className={`relative p-1 sm:p-2 text-center cursor-pointer transition-colors
              ${!isCurrentMonth ? "text-gray-300" : isToday ? "font-bold" : ""}
              ${isSelected ? "bg-[#e1eff1] text-[#6ca7af] rounded-md" : ""}
              ${hasWorkout && isCurrentMonth ? "bg-[#f0f7f7]" : ""}
            `}
            onClick={() => handleDateSelect(new Date(cloneDay))}
          >
            <span className="text-xs sm:text-sm">{day.getDate()}</span>
            {hasWorkout && isCurrentMonth && (
              <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#6ca7af]"></div>
            )}
          </div>,
        )

        // 다음 날짜로 이동
        day = new Date(day)
        day.setDate(day.getDate() + 1)
      }

      // 한 주가 완성되면 행 추가
      rows.push(
        <div key={`week-${rows.length}`} className="grid grid-cols-7 gap-1">
          {days}
        </div>,
      )
      days = []
    }

    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between mb-4 relative">
          <div className="flex items-center">
            <button onClick={prevYear} className="p-1 rounded-full hover:bg-gray-100 mr-1">
              <ChevronsLeft size={18} />
            </button>
            <button onClick={prevMonth} className="p-1 rounded-full hover:bg-gray-100">
              <ChevronLeft size={18} />
            </button>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={toggleYearPicker}
              className="px-2 py-1 rounded-md hover:bg-gray-100 font-medium text-sm sm:text-base"
            >
              {currentMonth.getFullYear()}년
            </button>
            <button
              onClick={toggleMonthPicker}
              className="px-2 py-1 rounded-md hover:bg-gray-100 font-medium text-sm sm:text-base"
            >
              {currentMonth.getMonth() + 1}월
            </button>
          </div>

          <div className="flex items-center">
            <button onClick={nextMonth} className="p-1 rounded-full hover:bg-gray-100">
              <ChevronRight size={18} />
            </button>
            <button onClick={nextYear} className="p-1 rounded-full hover:bg-gray-100 ml-1">
              <ChevronsRight size={18} />
            </button>
          </div>

          {isYearPickerOpen && renderYearPicker()}
          {isMonthPickerOpen && renderMonthPicker()}
        </div>

        <div className="grid grid-cols-7 gap-1 text-xs sm:text-sm text-gray-500">{daysHeader}</div>
        <div className="space-y-1 mt-1">{rows}</div>
      </div>
    )
  }

  // 운동 기록 렌더링
  const renderWorkoutLogs = () => {
    if (dailyRoutines.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center justify-center h-full">
          <Calendar className="h-12 w-12 text-gray-300 mb-2" />
          <p className="text-gray-500">선택한 날짜에 운동 기록이 없습니다.</p>
        </div>
      )
    }

    return (
      <div className="bg-white rounded-lg shadow-sm p-4 h-full overflow-auto">
        <h2 className="text-lg font-semibold mb-4">
          {selectedDate.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })} 운동 기록
        </h2>
        <div className="space-y-4">
          {dailyRoutines.map((routine) => (
            <div key={routine.id} className="border rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-2">{routine.title}</h3>
              <div className="space-y-2">
                {routine.exercises.map((exercise) => (
                  <div key={exercise.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      {exercise.isCompleted ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-300 mr-2" />
                      )}
                      <span className={exercise.isCompleted ? "text-gray-800" : "text-gray-500"}>{exercise.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {exercise.sets} 세트 x {exercise.reps} 회
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // 댓글 섹션 렌더링
  const renderComments = () => {
    return (
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
              comments.map((comment) => {
                return (
                <div key={comment.id} className="flex space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden">
                    {comment.avatar ? (
                      <img
                        src={comment.avatar || "/placeholder.svg"}
                        alt={comment.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <DefaultAvatar username={comment.username} size="sm" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <span className="font-medium text-gray-800 text-sm">{comment.username}</span>
                      <span className="text-xs text-gray-500 ml-2">
                        {new Date(comment.createdAt).toLocaleDateString("ko-KR")}
                      </span>
                    </div>

                    {editingCommentId === comment.id ? (
                      <div className="flex items-center space-x-2">
                        <input
                          ref={commentInputRef}
                          type="text"
                          value={editedCommentText}
                          onChange={(e) => setEditedCommentText(e.target.value)}
                          className="flex-1 px-3 py-1 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6ca7af] focus:border-transparent"
                        />
                        <button
                          onClick={() => handleSaveEdit(comment.id)}
                          disabled={isSubmittingComment}
                          className="p-1 rounded-full hover:bg-gray-100 text-[#6ca7af]"
                        >
                          <Save size={16} />
                        </button>
                        <button onClick={handleCancelEdit} className="p-1 rounded-full hover:bg-gray-100 text-gray-500">
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between">
                        <p className="text-gray-700 text-sm">{comment.content}</p>

                        {/* 댓글 작성자이거나 프로필 소유자, 나의 댓글인 경우에만 수정/삭제 버튼 표시 */}
                        {currentUserId && (String(comment.userId) === String(currentUserId) || String(user.id) === String(currentUserId)) && (
                          <div className="flex space-x-1 ml-2">
                            {comment.userId === currentUserId && (
                              <button
                                onClick={() => handleEditComment(comment)}
                                className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
                              >
                                <Edit2 size={14} />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="p-1 rounded-full hover:bg-gray-100 text-red-500"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )})
            ) : (
              <p className="text-center text-gray-500 py-4">아직 댓글이 없습니다.</p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmitComment} className="flex space-x-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요..."
            className="flex-1 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6ca7af] focus:border-transparent"
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
            작성
          </button>
        </form>
      </div>
    )
  }

  // 비공개 계정 메시지 렌더링
  const renderPrivateAccountMessage = () => {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 flex flex-col items-center justify-center">
        <div className="bg-gray-100 p-4 rounded-full mb-4">
          <Lock className="h-8 w-8 text-gray-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">비공개 계정입니다</h2>
        <p className="text-gray-600 text-center">이 사용자의 운동 기록을 보려면 팔로우 요청을 보내세요.</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6ca7af]"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">사용자를 찾을 수 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 프로필 헤더 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full overflow-hidden">
            {user.avatar ? (
              <img src={user.avatar || "/placeholder.svg"} alt={user.username} className="w-full h-full object-cover" />
            ) : (
              <DefaultAvatar username={user.username} size="lg" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{user.username}의 운동 기록</h1>
            {user.isPrivate && !isOwnProfile && !user.isFollowing && (
              <div className="flex items-center text-gray-500 mt-1">
                <Lock className="h-4 w-4 mr-1" />
                <span className="text-sm">비공개 계정</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {hasAccess ? (
        <>
          {/* 메인 콘텐츠 영역 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 왼쪽: 달력 */}
            <div>{renderCalendar()}</div>

            {/* 오른쪽: 운동 기록 */}
            <div>{renderWorkoutLogs()}</div>
          </div>

          {/* 댓글 영역 */}
          {renderComments()}
        </>
      ) : (
        renderPrivateAccountMessage()
      )}
    </div>
  )
}
