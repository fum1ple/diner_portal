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
    right: 'right-full mr-3 top-1/2 -translate-y-1/2',
    bottom: 'top-full mt-3',
    left: 'left-full ml-3 top-1/2 -translate-y-1/2'
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

  useEffect(() => {
    setIsVisible(true)
  }, [])

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
            <p className="text-sm text-slate-600">
              お疲れさまです！ <span className="font-semibold text-primary">{user?.email}</span> さん
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
            <div className="relative w-80 h-80 md:w-96 md:h-96">
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
                      transformOrigin: '50% 152px',
                      transform: `translateX(-50%) rotate(${i * 30}deg)`
                    }}
                  />
                ))}
              </div>

              {/* Inner circle */}
              <div className="absolute inset-8 rounded-full bg-white/40 backdrop-blur-sm border-2 border-white/50 shadow-inner">
                {/* Center dot */}
                <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-lg" />
                
                {/* Clock hands pointing to 12 o'clock */}
                <div className="absolute top-1/2 left-1/2 w-1 h-16 bg-primary/80 rounded-full origin-bottom transform -translate-x-1/2 -translate-y-full rotate-0" />
                <div className="absolute top-1/2 left-1/2 w-0.5 h-20 bg-secondary/80 rounded-full origin-bottom transform -translate-x-1/2 -translate-y-full rotate-90" />
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

            {/* Center instruction text */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 shadow-sm border border-white/50">
                <p className="text-sm font-medium text-slate-700">チームでランチの情報交換をしましょう</p>
                <p className="text-xs text-slate-500 mt-1">オフィス周辺の隠れた名店を見つけよう</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="relative z-10 pb-12">
        <div className="container mx-auto px-4 text-center">
          <div className={`transform transition-all duration-1000 ease-out delay-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <p className="text-sm text-slate-600">
              時計のボタンをクリックしてナビゲーション
            </p>
          </div>
        </div>
      </div>

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
