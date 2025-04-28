import axios from 'axios';
import { toast } from 'react-toastify';

// axios.defaults.withCredentials = true;

// ✅ axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
});

// ✅ 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ 응답 인터셉터 (토큰 만료 감지 및 자동 로그아웃)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const message = error.response.data?.message;

      if (message === "유효하지 않은 토큰입니다" || message === "인증 토큰이 없습니다") {
        localStorage.removeItem('token');

        toast.error("세션이 만료되었습니다. 다시 로그인해주세요.", {
          autoClose: 3000,
        });

        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
