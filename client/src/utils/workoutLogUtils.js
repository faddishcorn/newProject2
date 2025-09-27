// 로컬 스토리지에서 운동 기록 관련 작업을 처리하는 유틸리티 함수들

// YYYY-MM-DD 형식으로 날짜를 변환하는 함수
const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 운동 기록 저장
export const saveWorkoutLog = (workoutLog) => {
  const logs = getWorkoutLogs();
  logs.push({
    ...workoutLog,
    id: Date.now(),
    date: formatDate(new Date()),
  });
  localStorage.setItem('workoutLogs', JSON.stringify(logs));
};

// 운동 기록 가져오기
export const getWorkoutLogs = () => {
  const logs = localStorage.getItem('workoutLogs');
  return logs ? JSON.parse(logs) : [];
};

// 서버로 운동 기록 동기화 (로그인 후 사용)
export const syncWorkoutLogsToServer = async (axiosInstance) => {
  const logs = getWorkoutLogs();
  if (logs.length === 0) return;

  try {
    await Promise.all(logs.map(log => 
      axiosInstance.post('/api/routines/history', {
        title: log.title,
        exercises: log.exercises,
        date: log.date, // 이미 YYYY-MM-DD 형식으로 저장된 날짜 사용
      })
    ));
    // 동기화 후 로컬 기록 삭제
    localStorage.removeItem('workoutLogs');
    return true;
  } catch (error) {
    console.error('Failed to sync workout logs:', error);
    return false;
  }
};