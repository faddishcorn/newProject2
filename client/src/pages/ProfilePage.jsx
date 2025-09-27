"use client";

import { useState, useEffect, useRef } from "react";
import {
  Camera,
  Save,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Calendar,
  Ruler,
  Weight,
  Users,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import DefaultAvatar from "../components/DefaultAvatar";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";

export default function ProfilePage() {
  const [isAuthenticated] = useState(!!sessionStorage.getItem("token"));
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    newPassword: "",
    confirmPassword: "",
    height: "",
    weight: "",
    gender: "",
    birthdate: "",
    avatar: null,
    isPrivate: true,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const res = await axiosInstance.get(`/api/users/profile`);
        const userData = res.data;
        setUser({
          ...userData,
          newPassword: "",
          confirmPassword: "",
          birthdate:
            userData.birthdate === null
              ? "private"
              : userData.birthdate
                ? userData.birthdate.split("T")[0]
                : "",
          height:
            userData.height === null
              ? "private"
              : userData.height?.toString() || "",
          weight:
            userData.weight === null
              ? "private"
              : userData.weight?.toString() || "",
          gender: userData.gender,
        });
        if (userData.avatar) setImagePreview(userData.avatar);
        setIsLoading(false);
      } catch (error) {
        console.error("사용자 정보를 가져오는 중 오류 발생:", error);
        toast.error("사용자 정보를 가져오는 중 오류 발생");
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, [isAuthenticated]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const togglePrivate = (field) => {
    setUser((prev) => ({
      ...prev,
      [field]: prev[field] === "private" ? "" : "private",
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setUser((prev) => ({
          ...prev,
          avatar: file,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleDeleteImage = () => {
    setImagePreview(null);
    setUser((prev) => ({
      ...prev,
      avatar: null,
    }));
  };

  const handleDeleteAccount = async () => {
    try {
      await axiosInstance.delete(`/api/users/account`);
      sessionStorage.removeItem("token");
      window.location.href = "/login";
    } catch (error) {
      console.error("계정 삭제 중 오류:", error);
      toast.error("계정 삭제 중 오류 발생");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};

    if (!user.username.trim())
      validationErrors.username = "사용자 이름은 필수입니다.";
    if (!user.email.trim() || !/\S+@\S+\.\S+/.test(user.email))
      validationErrors.email = "유효한 이메일을 입력해주세요.";
    if (user.newPassword && user.newPassword.length < 8)
      validationErrors.newPassword = "비밀번호는 최소 8자 이상이어야 합니다.";
    if (user.newPassword !== user.confirmPassword)
      validationErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSaving(true);
      const formData = new FormData();
      formData.append("username", user.username);
      formData.append("email", user.email);
      formData.append("gender", user.gender);
      formData.append(
        "birthdate",
        user.birthdate === "private" || user.birthdate === ""
          ? "null"
          : user.birthdate,
      );
      formData.append(
        "height",
        user.height === "private" || user.height === "" ? "null" : user.height,
      );
      formData.append(
        "weight",
        user.weight === "private" || user.weight === "" ? "null" : user.weight,
      );
      formData.append("isPrivate", user.isPrivate);
      if (user.newPassword) {
        formData.append("password", user.password);
        formData.append("newPassword", user.newPassword);
      }
      if (user.avatar instanceof File) {
        formData.append("avatar", user.avatar);
      } else if (user.avatar === null) {
        formData.append("avatarDelete", true);
      }

      await axiosInstance.put(`/api/users/profile`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("프로필이 업데이트되었습니다.");
      setIsSaving(false);
    } catch (error) {
      console.error("프로필 업데이트 실패:", error);
      toast.error(error.response?.data?.message || "업데이트 중 오류 발생");
      setIsSaving(false);
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-[#6ca7af] rounded-full"></div>
      </div>
    );

  // 비회원용 UI
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 p-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-800">프로필 설정</h1>
          <p className="text-xl text-gray-600">
            로그인하여 더욱 맞춤화된 루틴을 만들어보세요!
          </p>
          <div className="flex flex-col items-center mt-8">
            <DefaultAvatar username="게스트" size="xl" className="w-32 h-32 mb-6" />
            <button
              onClick={() => window.location.href = '/login'}
              className="px-6 py-3 bg-[#6ca7af] hover:bg-[#5a8f96] text-white rounded-lg transition-colors font-semibold text-lg"
            >
              로그인하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800">내 정보</h1>
        <p className="text-gray-600 mt-1">
          개인 정보를 관리하고 업데이트하세요
        </p>
      </div>

      {/* 성공 메시지 */}
      {successMessage && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}

      {/* 서버 오류 메시지 */}
      {errors.submit && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{errors.submit}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 프로필 이미지 섹션 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            프로필 이미지
          </h2>

          <div className="flex flex-col items-center">
            <div
              className="relative w-32 h-32 rounded-full overflow-hidden cursor-pointer mb-4 border-2 border-dashed border-gray-300 hover:border-[#6ca7af] transition-colors"
              onClick={handleImageClick}
            >
              {imagePreview ? (
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="프로필 이미지"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <DefaultAvatar
                    username={user.username}
                    size="xl"
                    className="w-full h-full"
                  />
                </div>
              )}

              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Camera className="h-8 w-8 text-white" />
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleImageClick}
                className="text-sm text-[#6ca7af] hover:text-[#5a8f96] transition-colors"
              >
                이미지 변경
              </button>

              {imagePreview && (
                <button
                  type="button"
                  onClick={handleDeleteImage}
                  className="text-sm text-red-500 hover:text-red-700 transition-colors flex items-center"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  이미지 삭제
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 기본 정보 섹션 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            기본 정보
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 사용자 이름 */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                <User className="inline-block w-4 h-4 mr-1" />
                닉네임
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={user.username}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-md border ${
                  errors.username ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-[#6ca7af] focus:border-transparent`}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
              )}
            </div>

            {/* 이메일 */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                <Mail className="inline-block w-4 h-4 mr-1" />
                이메일
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={user.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-md border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-[#6ca7af] focus:border-transparent`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* 성별 */}
            <div>
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                <Users className="inline-block w-4 h-4 mr-1" />
                성별
              </label>
              <select
                id="gender"
                name="gender"
                value={user.gender}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6ca7af] focus:border-transparent"
              >
                <option value="">선택하세요</option>
                <option value="male">남성</option>
                <option value="female">여성</option>
                <option value="private">비공개</option>
              </select>
            </div>

            {/* 생년월일 */}
            <div>
              <label
                htmlFor="birthdate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                <Calendar className="inline-block w-4 h-4 mr-1" />
                생년월일
              </label>
              <input
                id="birthdate"
                name="birthdate"
                type="date"
                value={user.birthdate === "private" ? "" : user.birthdate}
                onChange={handleChange}
                disabled={user.birthdate === "private"}
                required={user.birthdate !== "private"}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6ca7af] focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => togglePrivate("birthdate")}
                className="text-xs text-gray-500 underline"
              >
                {user.birthdate === "private" ? "입력하기" : "비공개"}
              </button>
            </div>

            {/* 키 */}
            <div>
              <label
                htmlFor="height"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                <Ruler className="inline-block w-4 h-4 mr-1" />키 (cm)
              </label>
              <input
                id="height"
                name="height"
                type="number"
                value={user.height === "private" ? "" : user.height}
                onChange={handleChange}
                disabled={user.height === "private"}
                required={user.height !== "private"}
                className={`w-full px-4 py-2 rounded-md border ${errors.height ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-[#6ca7af] focus:border-transparent`}
                placeholder="예: 175"
              />
              <button
                type="button"
                onClick={() => togglePrivate("height")}
                className="text-xs text-gray-500 underline"
              >
                {user.height === "private" ? "입력하기" : "비공개"}
              </button>
              {errors.height && (
                <p className="mt-1 text-sm text-red-600">{errors.height}</p>
              )}
            </div>

            {/* 몸무게 */}
            <div>
              <label
                htmlFor="weight"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                <Weight className="inline-block w-4 h-4 mr-1" />
                몸무게 (kg)
              </label>
              <input
                id="weight"
                name="weight"
                type="number"
                value={user.weight === "private" ? "" : user.weight}
                onChange={handleChange}
                disabled={user.weight === "private"}
                required={user.weight !== "private"}
                className={`w-full px-4 py-2 rounded-md border ${errors.weight ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-[#6ca7af] focus:border-transparent`}
                placeholder="예: 65"
              />
              <button
                type="button"
                onClick={() => togglePrivate("weight")}
                className="text-xs text-gray-500 underline"
              >
                {user.weight === "private" ? "입력하기" : "비공개"}
              </button>
              {errors.weight && (
                <p className="mt-1 text-sm text-red-600">{errors.weight}</p>
              )}
            </div>

            {/* 프로필 공개 여부 - 토글 스위치 */}
            <div className="md:col-span-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  프로필 비공개 설정 (팔로워만 내 운동기록을 볼 수 있습니다)
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={user.isPrivate}
                  onClick={() =>
                    setUser({ ...user, isPrivate: !user.isPrivate })
                  }
                  className={`${
                    user.isPrivate ? "bg-[#6ca7af]" : "bg-gray-200"
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#6ca7af] focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      user.isPrivate ? "translate-x-6" : "translate-x-1"
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                  <span className="sr-only">프로필 비공개 설정</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 비밀번호 변경 섹션 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            비밀번호 변경
          </h2>

          <div className="space-y-4">
            {/* 현재 비밀번호 */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                <Lock className="inline-block w-4 h-4 mr-1" />
                현재 비밀번호
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={user.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6ca7af] focus:border-transparent pr-10"
                  placeholder="현재 비밀번호를 입력하세요"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* 새 비밀번호 */}
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                <Lock className="inline-block w-4 h-4 mr-1" />새 비밀번호
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={user.newPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-md border ${
                    errors.newPassword ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-[#6ca7af] focus:border-transparent pr-10`}
                  placeholder="새 비밀번호를 입력하세요"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.newPassword}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                비밀번호는 최소 8자 이상이어야 합니다.
              </p>
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                <Lock className="inline-block w-4 h-4 mr-1" />
                비밀번호 확인
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={user.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-md border ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-[#6ca7af] focus:border-transparent`}
                placeholder="새 비밀번호를 다시 입력하세요"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 저장 버튼 */}
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="text-gray-500 hover:text-red-600 transition-colors text-sm flex items-center"
          >
            <Trash2 className="mr-1 h-4 w-4" />
            회원 탈퇴
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center px-6 py-3 rounded-md bg-[#6ca7af] text-white font-medium hover:bg-[#5a8f96] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                저장 중...
              </>
            ) : (
              <>
                <Save className="mr-2 h-5 w-5" />
                변경사항 저장
              </>
            )}
          </button>
        </div>
      </form>
      {/* 계정 삭제 섹션 */}

      {/* 계정 삭제 확인 모달 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 animate-fade-in">
            <div className="flex items-center text-red-500 mb-4">
              <AlertTriangle className="h-6 w-6 mr-2" />
              <h3 className="text-lg font-bold">계정 삭제 확인</h3>
            </div>

            <p className="text-gray-700 mb-6">
              정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없으며, 모든
              데이터가 영구적으로 삭제됩니다.
            </p>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
              >
                계정 삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
