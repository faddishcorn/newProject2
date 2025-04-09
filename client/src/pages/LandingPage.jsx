import { Play, CheckCircle, Users, Brain, Calendar, ArrowRight } from "lucide-react"
import Button from "../components/Button"
import logo from "../assets/logo.png"
import { useNavigate } from "react-router-dom"

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-6 md:gap-10">
            <a href="/" className="flex items-center space-x-2">
              <img src={logo} alt="로고" className="h-20 w-25 mt-2" />
            </a>
            <nav className="hidden gap-6 md:flex">
              <a
                href="#features"
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                기능들
              </a>
              <a
                href="#demo"
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                데모
              </a>
              <a
                href="#testimonials"
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                후기들
              </a>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <Button onClick={() => navigate('/login')} variant="ghost" size="sm">
                로그인
              </Button>
              <Button size="sm">시작하기</Button>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    알아서 딱 준비되는 운동루틴
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    "오늘 운동은 뭐해야지?" 더이상 고민할 필요가 없습니다. ai를 통해 루틴을 짜고 계획달성 여부를 간편히
                    기록하여 사람들과 소통해보세요.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button onClick={() => navigate('/login')} className="bg-green-600 hover:bg-green-700">
                    지금 시작해보세요
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline">Learn More</Button>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>신체별 맞춤 루틴</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>AI-Driven</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>커뮤니티 기능</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative aspect-video overflow-hidden rounded-xl border bg-muted md:w-full">
                  <img src="/placeholder.jpg" alt="App screenshot" className="object-cover w-full h-full" />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
              <div className="inline-block rounded-lg px-3 py-1 text-sm" style={{ backgroundColor: "#e1eff1", color: "#6ca7af" }}>Features</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  성공적인 운동을 위해 필요한 기능만 담았습니다.
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Our AI-powered platform provides personalized health routines, intelligent recommendations, and a
                  supportive community.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              <div className="flex flex-col justify-center space-y-4 rounded-lg border bg-background p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full"style={{ backgroundColor: "#e1eff1"}}>
                  <Brain className="h-6 w-6"style={{color: "#6ca7af" }} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">AI기반 맞춤 추천</h3>
                  <p className="text-muted-foreground">
                    사용자의 데이터 분석 및 자유로운 대화 형식으로 까다로운 요구사항도 반영한 최적의 운동루틴을 간편히
                    만들 수 있습니다. 
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4 rounded-lg border bg-background p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full"style={{ backgroundColor: "#e1eff1"}}>
                  <Calendar className="h-6 w-6"style={{ color: "#6ca7af" }} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">루틴 및 운동기록 관리</h3>
                  <p className="text-muted-foreground">
                    계획이 세워진 날엔 해당일의 운동루틴을 잘 수행하였는지 체크할 수 있습니다. 추후 얼마나 목표를
                    달성했는지 확인해보세요.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4 rounded-lg border bg-background p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full "style={{ backgroundColor: "#e1eff1"}}>
                  <Users className="h-6 w-6 " style={{color: "#6ca7af" }}/>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">커뮤니티 제공</h3>
                  <p className="text-muted-foreground">원하는 회원과 친구를 맺을 수 있습니다. 커뮤니티 기능을 통해 자유롭게 각자의 운동기록 및 루틴을 공유하고 의견을 나눠보세요.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="demo" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg  px-3 py-1 text-sm"style={{ backgroundColor: "#e1eff1", color: "#6ca7af" }}>Demo</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">시연영상</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  원하는 사항을 자유롭게 입력만 하면 됩니다. 가령 홈트레이닝, 헬스장 등 장소를 섞거나 집중하고 싶은
                  부분, 특이사항 등을 편하게 입력해보세요.
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-4xl py-12">
              <div className="relative aspect-video overflow-hidden rounded-xl border bg-muted">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-20 w-20 rounded-full bg-background/80 backdrop-blur"
                  >
                    <Play className="h-8 w-8" />
                    <span className="sr-only">Play demo video</span>
                  </Button>
                </div>
                <img src="/placeholder.jpg" alt="Demo video thumbnail" className="object-cover w-full h-full" />
              </div>
            </div>
          </div>
        </section>
        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg px-3 py-1 text-sm"style={{ backgroundColor: "#e1eff1", color: "#6ca7af" }}>
                  Testimonials
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">사용후기</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  바디플랜을 통해 성공적으로 운동루틴을 수행중인 사람들의 이야기들
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
              <div className="flex flex-col justify-between space-y-4 rounded-lg border bg-background p-6 shadow-sm">
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    "헬스장과 홈 트레이닝 두 장소 번갈아가면서 수행할 수 있도록 계획을 짜줘서 편했어요"
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-muted">
                    <img
                      src="/placeholder.jpg"
                      width={40}
                      height={40}
                      alt="User avatar"
                      className="rounded-full w-10 h-10"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">김민수</p>
                    <p className="text-xs text-muted-foreground">돈많은 백수</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-between space-y-4 rounded-lg border bg-background p-6 shadow-sm">
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    "친구의 운동기록을 보거나 저의 운동기록을 공유해서 서로간의 피드백을 통해 방향을 잘 잡을 수 있어
                    좋네요"
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-muted">
                    <img
                      src="/placeholder.jpg"
                      width={40}
                      height={40}
                      alt="User avatar"
                      className="rounded-full w-10 h-10"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">홍길동</p>
                    <p className="text-xs text-muted-foreground">대학생</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-between space-y-4 rounded-lg border bg-background p-6 shadow-sm">
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    "까다로운 요구사항도 반영해줘서 좋고 무엇보다 루틴관리 및 커뮤니티 기능이 매우 맘에 들었어요!"
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-muted">
                    <img
                      src="/placeholder.jpg"
                      width={40}
                      height={40}
                      alt="User avatar"
                      className="rounded-full w-10 h-10"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">이다혜</p>
                    <p className="text-xs text-muted-foreground">회사원</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t bg-background py-6 md:py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row md:gap-8">
          <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
            <a href="/" className="flex items-center space-x-2">
              <span className="inline-block font-bold">바디플랜</span>
            </a>
            <nav className="flex gap-4 md:gap-6">
              <a href="#" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
                Terms
              </a>
              <a href="#" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
                Privacy
              </a>
              <a href="#" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
                Cookies
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="text-muted-foreground hover:text-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
              <span className="sr-only">Facebook</span>
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
              <span className="sr-only">Twitter</span>
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
              <span className="sr-only">Instagram</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
