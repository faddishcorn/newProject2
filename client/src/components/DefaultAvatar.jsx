import { User } from "lucide-react";

// 이름에 기반한 일관된 색상을 생성하는 함수
const getColorFromUsername = (username) => {
  if (!username) return "#6ca7af"; // 기본 앱 색상

  // 이름의 각 문자 코드를 합산하여 색상 결정
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }

  // 색상 배열 - 앱의 디자인과 어울리는 파스텔 색상들
  const colors = [
    "#6ca7af", // 기본 앱 색상
    "#7fb9c2",
    "#8fd3dc",
    "#a5d8e6",
    "#c2e0e5",
    "#d5e8e6",
    "#e6f2f2",
    "#f0f7f7",
    "#e0f0e3",
    "#c2e0c6",
    "#a5d6a7",
    "#8bc34a",
    "#cddc39",
    "#ffeb3b",
    "#ffc107",
    "#ff9800",
    "#ff5722",
    "#f44336",
    "#e91e63",
    "#9c27b0",
    "#673ab7",
    "#3f51b5",
    "#2196f3",
    "#03a9f4",
    "#00bcd4",
    "#009688",
  ];

  // 해시값을 사용하여 색상 배열에서 색상 선택
  const colorIndex = Math.abs(hash) % colors.length;
  return colors[colorIndex];
};

export default function DefaultAvatar({
  username,
  size = "md",
  className = "",
}) {
  const backgroundColor = getColorFromUsername(username);

  // 크기 클래스 결정
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-20 h-20",
  };

  const sizeClass = sizeClasses[size] || sizeClasses.md;

  return (
    <div
      className={`rounded-full flex items-center justify-center ${sizeClass} ${className}`}
      style={{ backgroundColor }}
    >
      <User className="w-1/2 h-1/2 text-white" />
    </div>
  );
}
