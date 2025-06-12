'use client'

import { useState, useEffect } from 'react'
import { Search, Heart, Crown, Users } from 'lucide-react'

interface ClockButtonProps {
  icon: React.ReactNode
  title: string
  subtitle: string
  position: 'top' | 'right' | 'bottom' | 'left'
  isHovered: boolean
  onClick: () => void
  color: string
}

const ClockButton = ({ icon, title, subtitle, position, isHovered, onClick, color }: ClockButtonProps) => {
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
    <div className={`absolute ${positionClasses[position]} group z-50`}>
      <button
        onClick={onClick}
        className={`
          relative w-20 h-20 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110
          flex items-center justify-center text-white
          ${isHovered ? 'scale-110' : ''}
        `}
        style={{ backgroundColor: color }}
      >
        {icon}
        
        {/* ツールチップ */}
        <div className={`
          absolute ${textPositionClasses[position]} opacity-0 group-hover:opacity-100
          transition-opacity duration-300 pointer-events-none z-50
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

export default function TopPageClient() {
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
      icon: <Search className="w-8 h-8" />,
      title: 'お店を探す',
      subtitle: 'レストランを検索',
      position: 'top' as const,
      color: '#4db6ac',
      action: () => window.location.href = '/restaurants'
    },
    {
      id: 'favorites',
      icon: <Heart className="w-8 h-8" />,
      title: '保存したお店',
      subtitle: 'お気に入りリスト',
      position: 'right' as const,
      color: '#26a69a',
      action: () => window.location.href = '/favorites'
    },
    {
      id: 'ranking',
      icon: <Crown className="w-8 h-8" />,
      title: '人気ランキング',
      subtitle: '評価の高いお店',
      position: 'bottom' as const,
      color: '#ff8a65',
      action: () => window.location.href = '/ranking'
    },
    {
      id: 'situation',
      icon: <Users className="w-8 h-8" />,
      title: '目的で選ぶ',
      subtitle: 'シチュエーション別',
      position: 'left' as const,
      color: '#80cbc4',
      action: () => window.location.href = '/situations'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-100 relative overflow-hidden">
      {/* Header */}
      <div className="relative z-10 pt-12 pb-8">
        <div className="container mx-auto px-4 text-center">
          <div className={`transform transition-all duration-1000 ease-out ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <div className="relative inline-block mb-6">
              <div className="flex items-center justify-center gap-2 text-4xl md:text-5xl font-bold">
                <span style={{ color: '#4db6ac' }}>🍴</span>
                <span className="bg-gradient-to-r from-[#4db6ac] via-[#26a69a] to-[#66bb6a] bg-clip-text text-transparent">
                  TOKIEATS
                </span>
                <span style={{ color: '#66bb6a' }}>🍽️</span>
              </div>
            </div>
            <p className="text-lg md:text-xl text-gray-600 mb-2">
              社内で共有する、オフィス周辺のグルメ情報プラットフォーム
            </p>
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
              {/* Outer ring with gradient border */}
              <div className="absolute inset-0 rounded-full shadow-2xl bg-gradient-to-br from-white to-gray-50"
                   style={{
                     background: 'conic-gradient(from 0deg, #4db6ac, #26a69a, #80cbc4, #b2dfdb, #4db6ac)',
                     padding: '8px'
                   }}>
                {/* Inner white circle */}
                <div className="w-full h-full rounded-full bg-gradient-to-br from-white to-gray-50 shadow-inner relative">
                  {/* Hour marks */}
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className={`absolute rounded-full ${
                        i % 3 === 0 ? 'w-1 h-8 bg-teal-600' : 'w-0.5 h-4 bg-teal-400'
                      }`}
                      style={{
                        top: i % 3 === 0 ? '32px' : '40px',
                        left: '50%',
                        transformOrigin: i % 3 === 0 ? '50% 176px' : '50% 168px',
                        transform: `translateX(-50%) rotate(${i * 30}deg)`
                      }}
                    />
                  ))}
                  
                  {/* Clock hands */}
                  <div className="absolute inset-0">
                    {/* Center dot */}
                    <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-teal-600 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-lg border-2 border-white z-30" />
                    
                    {/* Hour hand */}
                    <div 
                      className="absolute top-1/2 left-1/2 w-1.5 h-16 bg-teal-700 rounded-full origin-bottom transform -translate-x-1/2 -translate-y-full transition-transform duration-1000 ease-in-out shadow-lg z-20"
                      style={{ transform: `translateX(-50%) translateY(-100%) rotate(${hourAngle}deg)` }}
                    />
                    
                    {/* Minute hand */}
                    <div 
                      className="absolute top-1/2 left-1/2 w-1 h-20 bg-green-500 rounded-full origin-bottom transform -translate-x-1/2 -translate-y-full transition-transform duration-300 ease-in-out shadow-lg z-20"
                      style={{ transform: `translateX(-50%) translateY(-100%) rotate(${minuteAngle}deg)` }}
                    />
                    
                    {/* Second hand */}
                    <div 
                      className="absolute top-1/2 left-1/2 w-0.5 h-24 bg-red-500 rounded-full origin-bottom transform -translate-x-1/2 -translate-y-full transition-transform duration-75 ease-linear shadow-lg z-30"
                      style={{ transform: `translateX(-50%) translateY(-100%) rotate(${(currentTime.getSeconds() * 6)}deg)` }}
                    />
                  </div>
                </div>
              </div>

              {/* Clock Buttons */}
              {clockButtons.map(button => (
                <ClockButton
                  key={button.id}
                  icon={button.icon}
                  title={button.title}
                  subtitle={button.subtitle}
                  position={button.position}
                  isHovered={hoveredButton === button.id}
                  onClick={button.action}
                  color={button.color}
                />
              ))}
            </div>

            {/* Interactive instruction */}
            {showInstruction && (
              <div className="absolute top-1/2 -left-32 transform -translate-y-1/2 z-0">
                <div className="relative">
                  <svg 
                    className="w-20 h-20 text-teal-500/60 animate-pulse" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M10 19l7-7m0 0l-7-7m7 7H3"
                      className="animate-pulse"
                    />
                  </svg>
                </div>
                
                <div className="absolute top-1/2 right-full mr-4 transform -translate-y-1/2 animate-in slide-in-from-right-4 duration-700">
                  <div className="group bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 border border-teal-200 shadow-lg hover:shadow-xl hover:bg-white transition-all duration-500 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-2 h-2 bg-teal-500/60 rounded-full group-hover:bg-teal-500 transition-colors duration-300"></div>
                      </div>
                      <p className="text-sm font-medium text-gray-700 group-hover:text-gray-800 transition-colors duration-300 whitespace-nowrap">
                        目的で選ぶボタンをクリックしてみましょう！
                      </p>
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

    </div>
  )
}