"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { Search, UserPlus, UserMinus, UserCheck, X, Check, ExternalLink } from "lucide-react"
import DefaultAvatar from "../components/DefaultAvatar"

export default function SocialPage() {
  const [activeTab, setActiveTab] = useState("following")
  const [searchQuery, setSearchQuery] = useState("")
  const [hasSearched, setHasSearched] = useState(false)
  const [followings, setFollowings] = useState([])
  const [sentRequests, setSentRequests] = useState([])
  const [followers, setFollowers] = useState([])
  const [receivedRequests, setReceivedRequests] = useState([])
  const [searchResults, setSearchResults] = useState([]) //
  const navigate = useNavigate();

  const token = localStorage.getItem("token")
  const authHeader = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  useEffect(() => {
    fetchAll()
  }, [])
  
  const fetchAll = async () => {
    try {
      const [fRes, frRes, srRes, rrRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_BASE}/api/social/followings`, authHeader),
        axios.get(`${import.meta.env.VITE_API_BASE}/api/social/followers`, authHeader),
        axios.get(`${import.meta.env.VITE_API_BASE}/api/social/requests/sent`, authHeader),
        axios.get(`${import.meta.env.VITE_API_BASE}/api/social/requests/received`, authHeader),
      ])
      setFollowings(fRes.data)
      setFollowers(frRes.data)
      setSentRequests(srRes.data)
      setReceivedRequests(rrRes.data)
    } catch (err) {
      console.error("소셜 데이터 로딩 실패", err)
    }
  }

  // 언팔로우 처리
  const handleUnfollow = async (userId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE}/api/social/unfollow/${userId}`, authHeader)
      fetchAll()
    } catch (err) {
      console.error("언팔로우 실패", err)
    }
  }

  // 요청 취소 처리
  const handleCancelRequest = async (userId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE}/api/social/request/${userId}`, authHeader)
      fetchAll()
    } catch (err) {
      console.error("요청 취소 실패", err)
    }
  }

  // 팔로워 삭제 처리
  const handleRemoveFollower = async (userId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE}/api/social/followers/${userId}`, authHeader);
      setFollowers(followers.filter((user) => user._id !== userId)); // ✅ user.id -> user._id
    } catch (err) {
      console.error("팔로워 삭제 실패", err);
    }
  }

  // 팔로워 요청 수락 처리
  const handleAcceptRequest = async (userId) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE}/api/social/request/${userId}/accept`, {}, authHeader)
      fetchAll()
    } catch (err) {
      console.error("요청 수락 실패", err)
    }
  }

  // 팔로워 요청 거절 처리
  const handleRejectRequest = async (userId) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE}/api/social/request/${userId}/reject`, {}, authHeader)
      fetchAll()
    } catch (err) {
      console.error("요청 거절 실패", err)
    }
  }

  // 검색 처리
  const handleSearch = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE}/api/social/search?q=${searchQuery}`, authHeader)
      setSearchResults(res.data)
      setHasSearched(true)
    } catch (err) {
      console.error("검색 실패", err)
    }
  }

  // 팔로우 상태 변경 처리
  const handleToggleFollow = async (userId, status) => {
    try {
      if (status === "none") {
        await axios.post(`${import.meta.env.VITE_API_BASE}/api/social/request`, { targetId: userId }, authHeader)
      } else if (status === "requested") {
        await axios.delete(`${import.meta.env.VITE_API_BASE}/api/social/request/${userId}`, authHeader)
      } else if (status === "following") {
        await axios.delete(`${import.meta.env.VITE_API_BASE}/api/social/unfollow/${userId}`, authHeader)
      }
      if (activeTab === "find") {
        handleSearch({ preventDefault: () => {} });
      } 
      fetchAll();
    } catch (err) {
      console.error("팔로우 상태 변경 실패", err)
    }
  }

  // 방문 처리
  const handleVisit = (user) => {
    const userId = user._id || user.id; // 둘 중 하나라도 있으면 사용
    if (!userId) {
      console.error("방문하려는 유저의 ID가 없습니다.", user);
      return;
    }
    navigate(`/workout-logs/${userId}`);
  };

  // 팔로우 버튼 렌더링
  const renderFollowButton = (user) => {
    const userId = user.id || user._id; // ✅ 여기서 id 정리
    if (user.status === "following") {
      return (
        <button
          onClick={() => handleToggleFollow(userId, user.status)}
          className="flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-[#6ca7af] text-white hover:bg-[#5a8f96] transition-colors"
        >
          <UserCheck size={16} className="mr-1.5" />
          팔로잉
        </button>
      )
    } else if (user.status === "requested") {
      return (
        <button
          onClick={() => handleToggleFollow(userId, user.status)}
          className="flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
        >
          <Check size={16} className="mr-1.5" />
          전송됨
        </button>
      )
    } else {
      return (
        <button
          onClick={() => handleToggleFollow(userId, user.status)}
          className="flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-[#6ca7af] text-white hover:bg-[#5a8f96] transition-colors"
        >
          <UserPlus size={16} className="mr-1.5" />
          팔로우
        </button>
      )
    }
  }

  // 프로필 이미지 렌더링 (사용자 지정 이미지 또는 기본 아바타)
  const renderProfileImage = (user) => {
    if (user.avatar) {
      return (
        <img
          src={user.avatar || "/placeholder.svg"}
          alt={`${user.username}의 프로필`}
          className="w-full h-full object-cover"
        />
      )
    } else {
      return <DefaultAvatar username={user.username} />
    }
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800">소셜</h1>
        <p className="text-gray-600 mt-1">친구들과 운동 루틴을 공유하고 소통하세요</p>
      </div>

      {/* 탭 네비게이션 */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="flex border-b">
          <button
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              activeTab === "following"
                ? "text-[#6ca7af] border-b-2 border-[#6ca7af]"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("following")}
          >
            팔로잉
          </button>
          <button
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              activeTab === "followers"
                ? "text-[#6ca7af] border-b-2 border-[#6ca7af]"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("followers")}
          >
            팔로워
          </button>
          <button
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              activeTab === "find" ? "text-[#6ca7af] border-b-2 border-[#6ca7af]" : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("find")}
          >
            친구찾기
          </button>
        </div>

        {/* 팔로잉 탭 */}
        {activeTab === "following" && (
          <div className="p-6 space-y-8">
            {/* 팔로잉 목록 섹션 */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">팔로잉</h2>

              {followings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {followings.map((user) => (
                    <div key={user.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-12 h-12 rounded-full overflow-hidden cursor-pointer"
                          onClick={() => handleVisit(user)}
                        >
                          {renderProfileImage(user)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800">{user.username}</h3>
                        </div>
                      </div>

                      <div className="flex justify-between mt-4">
                        <button
                          onClick={() => handleVisit(user)}
                          className="flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                        >
                          <ExternalLink size={16} className="mr-1.5" />
                          방문
                        </button>
                        <button
                          onClick={() => handleUnfollow(user._id)}
                          className="flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                        >
                          <UserMinus size={16} className="mr-1.5" />
                          언팔로우
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                  <p>팔로잉이 없습니다.</p>
                </div>
              )}
            </div>

            {/* 보낸 요청 섹션 */}
            {sentRequests.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">보낸 요청</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sentRequests.map((user) => (
                    <div key={user.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-12 h-12 rounded-full overflow-hidden cursor-pointer"
                          onClick={() => handleVisit(user)}
                        >
                          {renderProfileImage(user)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800">{user.username}</h3>
                        </div>
                      </div>

                      <div className="flex justify-between mt-4">
                        <button
                          onClick={() => handleVisit(user)}
                          className="flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                        >
                          <ExternalLink size={16} className="mr-1.5" />
                          방문
                        </button>
                        <button
                          onClick={() => handleCancelRequest(user._id)}
                          className="flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                        >
                          <X size={16} className="mr-1.5" />
                          취소
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 팔로워 탭 */}
        {activeTab === "followers" && (
          <div className="p-6 space-y-8">
            {/* 팔로워 목록 섹션 */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">팔로워</h2>

              {followers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {followers.map((user) => {
  // status 계산
  let status = "none";
  if (followings.some(f => f._id === user._id)) {
    status = "following";
  } else if (sentRequests.some(r => r._id === user._id)) {
    status = "requested";
  }

  return (
    <div key={user._id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-center space-x-3">
        <div
          className="w-12 h-12 rounded-full overflow-hidden cursor-pointer"
          onClick={() => handleVisit(user)}
        >
          {renderProfileImage(user)}
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-800">{user.username}</h3>
        </div>
      </div>

      <div className="flex justify-between mt-4">
        <button
          onClick={() => handleVisit(user)}
          className="flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
        >
          <ExternalLink size={16} className="mr-1.5" />
          방문
        </button>
        <div className="flex space-x-2">
          {renderFollowButton({...user, status})} {/* ✅ status 주입 */}
          <button
            onClick={() => handleRemoveFollower(user._id)}
            className="flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            <X size={16} className="mr-1.5" />
            삭제
          </button>
        </div>
      </div>
    </div>
  )
})}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                  <p>팔로워가 없습니다.</p>
                </div>
              )}
            </div>

            {/* 받은 요청 섹션 */}
            {receivedRequests.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">받은 요청</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {receivedRequests.map((user) => (
                    <div key={user.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-12 h-12 rounded-full overflow-hidden cursor-pointer"
                          onClick={() => handleVisit(user)}
                        >
                          {renderProfileImage(user)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800">{user.username}</h3>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <button
                          onClick={() => handleVisit(user)}
                          className="flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                        >
                          <ExternalLink size={16} className="mr-1.5" />
                          방문
                        </button>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {console.log('Accept button clicked, user:', user);handleAcceptRequest(user._id)}}
                            className="flex items-center px-2 py-1.5 rounded-md text-sm font-medium bg-[#6ca7af] text-white hover:bg-[#5a8f96] transition-colors"
                          >
                            <Check size={14} className="mr-1" />
                            수락
                          </button>
                          <button
                            onClick={() => handleRejectRequest(user._id)}
                            className="flex items-center px-2 py-1.5 rounded-md text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                          >
                            <X size={14} className="mr-1" />
                            거절
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 친구찾기 탭 */}
        {activeTab === "find" && (
          <div className="p-6 space-y-6">
            {/* 검색 폼 */}
            <form onSubmit={handleSearch} className="flex space-x-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="이름으로 검색"
                className="flex-1 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6ca7af] focus:border-transparent"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-[#6ca7af] text-white hover:bg-[#5a8f96] transition-colors"
              >
                <Search size={18} />
              </button>
            </form>

            {/* 검색 결과 */}
            {hasSearched && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">검색 결과</h2>

                {searchResults.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {searchResults.map((user) => (
                      <div key={user._id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-12 h-12 rounded-full overflow-hidden cursor-pointer"
                            onClick={() => handleVisit(user)}
                          >
                            {renderProfileImage(user)}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-800">{user.username}</h3>
                          </div>
                        </div>

                        <div className="flex justify-between mt-4">
                          <button
                            onClick={() => handleVisit(user)}
                            className="flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                          >
                            <ExternalLink size={16} className="mr-1.5" />
                            방문
                          </button>
                          {renderFollowButton(user)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                    <p>검색 결과가 없습니다.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
