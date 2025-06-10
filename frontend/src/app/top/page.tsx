'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import ProtectedPage from '@/components/ProtectedPage'
import { Search, Heart, TrendingUp, MapPin } from 'lucide-react'

interface ClockButtonProps {
  icon: React.ReactNode
  title: string
  subtitle: string
  position: 'top' | 'right' | 'bottom' | 'left'
  isHovered: boolean
  onClick: () => void
}

const ClockButton = ({ icon, title, subtitle, position, isHovered, onClick }: ClockButtonProps) => {
  const positionClasses = {
    top: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2',
    right: 'right-0 top-1/2 translate-x-1/2 -translate-y-1/2',
    bottom: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2',
    left: 'left-0 top-1/2 -translate-x-1/2 -translate-y-1/2'
  }

  const textPositionClasses = {
    top: 'bottom-full mb-3',
    right: 'left-full ml-3 top-1/2 -translate-y-1/2',
    bottom: 'top-full mt-3',
    left: 'right-full mr-3 top-1/2 -translate-y-1/2'
  }

  return (
    <div className={`absolute ${positionClasses[position]} group`}>
      <button
        onClick={onClick}
        className={`
          relative w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm border-2 border-primary/20
          shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110
          flex items-center justify-center text-primary hover:bg-primary hover:text-white
          ${isHovered ? 'scale-110 bg-primary text-white' : ''}
        `}
      >
        {icon}
        
        {/* ツールチップ */}
        <div className={`
          absolute ${textPositionClasses[position]} opacity-0 group-hover:opacity-100
          transition-opacity duration-300 pointer-events-none z-10
        `}>
          <div className="bg-slate-800 text-white px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
            <div className="font-semibold text-sm">{title}</div>
            <div className="text-xs text-slate-300">{subtitle}</div>
          </div>
        </div>
      </button>
    </div>
  )
}

const TopPageContent = () => {
  const { user, isLoading } = useAuth()
  const [hoveredButton, setHoveredButton] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showInstruction, setShowInstruction] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    
    // 現在時刻の更新
    const clockTimer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // 10秒後にインストラクションを表示
    const instructionTimer = setTimeout(() => {
      setShowInstruction(true)
    }, 10000)

    return () => {
      clearInterval(clockTimer)
      clearTimeout(instructionTimer)
    }
  }, [])

  // 時計の針の角度を計算
  const getClockAngles = (time: Date) => {
    const hours = time.getHours() % 12
    const minutes = time.getMinutes()
    const seconds = time.getSeconds()
    
    // 時針: 30度 × 時間 + 0.5度 × 分
    const hourAngle = (hours * 30) + (minutes * 0.5)
    // 分針: 6度 × 分 + 0.1度 × 秒
    const minuteAngle = (minutes * 6) + (seconds * 0.1)
    
    return { hourAngle, minuteAngle }
  }

  const { hourAngle, minuteAngle } = getClockAngles(currentTime)

  const clockButtons = [
    {
      id: 'search',
      icon: <Search className="w-6 h-6" />,
      title: 'お店を探す',
      subtitle: 'レストランを検索',
      position: 'top' as const,
      action: () => window.location.href = '/restaurants'
    },
    {
      id: 'favorites',
      icon: <Heart className="w-6 h-6" />,
      title: '保存したお店',
      subtitle: 'お気に入りリスト',
      position: 'right' as const,
      action: () => window.location.href = '/favorites'
    },
    {
      id: 'ranking',
      icon: <TrendingUp className="w-6 h-6" />,
      title: '人気ランキング',
      subtitle: '評価の高いお店',
      position: 'bottom' as const,
      action: () => window.location.href = '/ranking'
    },
    {
      id: 'situation',
      icon: <MapPin className="w-6 h-6" />,
      title: '目的で選ぶ',
      subtitle: 'シチュエーション別',
      position: 'left' as const,
      action: () => window.location.href = '/situations'
    }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/10 to-emerald-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-secondary/10 to-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <div className="relative z-10 pt-12 pb-8">
        <div className="container mx-auto px-4 text-center">
          <div className={`transform transition-all duration-1000 ease-out ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <div className="relative inline-block mb-6">
              <div className="flex items-center justify-center gap-2 text-4xl md:text-5xl font-bold">
                <span className="text-primary">🍴</span>
                <span className="bg-gradient-to-r from-primary via-emerald-600 to-secondary bg-clip-text text-transparent">
                  TOKIEATS
                </span>
                <span className="text-secondary">🍽️</span>
              </div>
            </div>
            <p className="text-lg md:text-xl text-muted-foreground mb-2">
              社内で共有する、オフィス周辺のグルメ情報プラットフォーム
            </p>
            <div className="flex flex-col items-center gap-2">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 shadow-sm border border-white/50 max-w-md">
                <p className="text-sm font-medium text-slate-700">チームでランチの情報交換をしましょう</p>
                <p className="text-xs text-slate-500 mt-1">オフィス周辺の隠れた名店を見つけよう</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clock Interface */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className={`transform transition-all duration-1000 ease-out delay-300 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div 
            className="relative"
            onMouseEnter={() => setHoveredButton('clock')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            {/* Main Clock Circle */}
            <div className="relative w-96 h-96 md:w-[28rem] md:h-[28rem]">
              {/* Outer ring with hour marks */}
              <div className="absolute inset-0 rounded-full border-4 border-primary/20">
                {/* Hour marks */}
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-6 bg-primary/30 rounded-full"
                    style={{
                      top: '8px',
                      left: '50%',
                      transformOrigin: '50% 184px',
                      transform: `translateX(-50%) rotate(${i * 30}deg)`
                    }}
                  />
                ))}
              </div>

              {/* Inner circle */}
              <div className="absolute inset-8 rounded-full bg-white/40 backdrop-blur-sm border-2 border-white/50 shadow-inner">
                {/* Center dot */}
                <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-lg" />
                
                {/* Clock hands showing current time */}
                <div 
                  className="absolute top-1/2 left-1/2 w-1 h-20 md:h-24 bg-primary/80 rounded-full origin-bottom transform -translate-x-1/2 -translate-y-full transition-transform duration-1000 ease-in-out"
                  style={{ transform: `translateX(-50%) translateY(-100%) rotate(${hourAngle}deg)` }}
                />
                <div 
                  className="absolute top-1/2 left-1/2 w-0.5 h-24 md:h-28 bg-secondary/80 rounded-full origin-bottom transform -translate-x-1/2 -translate-y-full transition-transform duration-300 ease-in-out"
                  style={{ transform: `translateX(-50%) translateY(-100%) rotate(${minuteAngle}deg)` }}
                />
              </div>

              {/* Clock Buttons */}
              {clockButtons.map((button) => (
                <ClockButton
                  key={button.id}
                  icon={button.icon}
                  title={button.title}
                  subtitle={button.subtitle}
                  position={button.position}
                  isHovered={hoveredButton === button.id}
                  onClick={button.action}
                />
              ))}
            </div>

            {/* Interactive instruction with arrow pointing to search button */}
            {showInstruction && (
              <div className="absolute -top-24 left-0 ml-20">
                {/* Animated arrow pointing to search button */}
                <div className="relative">
                  <svg 
                    className="w-20 h-20 text-primary/60 animate-pulse" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                      className="animate-pulse"
                    />
                  </svg>
                </div>
                
                {/* Instruction text */}
                <div className="absolute top-full left-0 mt-2 animate-in slide-in-from-bottom-4 duration-700">
                  <div className="group bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 border border-primary/20 shadow-lg hover:shadow-xl hover:bg-white transition-all duration-500 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-2 h-2 bg-primary/60 rounded-full group-hover:bg-primary transition-colors duration-300"></div>
                      </div>
                      <p className="text-sm font-medium text-slate-700 group-hover:text-slate-800 transition-colors duration-300 whitespace-nowrap">
                        お店を探すボタンをクリックしてみましょう！
                      </p>
                      <div className="text-primary/60 group-hover:text-primary transition-all duration-300 group-hover:translate-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="relative z-10 pb-12"></div>

      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-primary rounded-full animate-ping delay-300" />
      <div className="absolute top-40 right-20 w-3 h-3 bg-secondary rounded-full animate-pulse delay-700" />
      <div className="absolute bottom-20 left-20 w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-1000" />
    </div>
  )
}

const TopPage = () => (
  <ProtectedPage redirectTo="/auth/error?error=AccessDenied">
    <TopPageContent />
  </ProtectedPage>
)

export default TopPage
