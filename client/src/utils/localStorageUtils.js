// 로컬 스토리지에서 루틴 관련 작업을 처리하는 유틸리티 함수들

// 로컬 스토리지에서 모든 루틴 가져오기
export const getLocalRoutines = () => {
  const routines = localStorage.getItem('routines');
  return routines ? JSON.parse(routines) : [];
};

// 로컬 스토리지에 루틴 저장
export const saveLocalRoutine = (routine) => {
  const routines = getLocalRoutines();
  const newRoutine = {
    ...routine,
    id: Date.now(), // 고유 ID 생성
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  routines.push(newRoutine);
  localStorage.setItem('routines', JSON.stringify(routines));
  return newRoutine;
};

// 로컬 스토리지의 루틴 수정
export const updateLocalRoutine = (routineId, updatedRoutine) => {
  const routines = getLocalRoutines();
  const index = routines.findIndex(r => r.id === routineId);
  if (index !== -1) {
    routines[index] = {
      ...updatedRoutine,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem('routines', JSON.stringify(routines));
    return routines[index];
  }
  return null;
};

// 로컬 스토리지에서 루틴 삭제
export const deleteLocalRoutine = (routineId) => {
  const routines = getLocalRoutines();
  const filteredRoutines = routines.filter(r => r.id !== routineId);
  localStorage.setItem('routines', JSON.stringify(filteredRoutines));
};

// 로컬 루틴을 서버로 동기화 (로그인 후 사용)
export const syncLocalRoutinesToServer = async (axiosInstance) => {
  const localRoutines = getLocalRoutines();
  if (localRoutines.length === 0) return;

  try {
    // 각 로컬 루틴을 서버에 저장
    await Promise.all(localRoutines.map(routine => 
      axiosInstance.post('/api/routines', routine)
    ));
    // 동기화 후 로컬 루틴 삭제
    localStorage.removeItem('routines');
    return true;
  } catch (error) {
    console.error('Failed to sync local routines:', error);
    return false;
  }
};