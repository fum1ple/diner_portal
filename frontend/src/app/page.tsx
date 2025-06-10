'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, Utensils, Users, Star, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'

const Home = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/20 to-emerald-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-secondary/20 to-primary/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Main content */}
      <main className="relative z-10 container mx-auto px-4 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo/Icon */}
          <div className={`transform transition-all duration-1000 ease-out ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <div className="relative inline-block mb-8">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg flex items-center justify-center transform rotate-3 hover:rotate-6 transition-transform duration-300">
                <Utensils className="w-10 h-10 text-white" aria-hidden="true" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-400 rounded-full animate-bounce delay-500" />
            </div>
          </div>

          {/* Main title */}
          <div className={`transform transition-all duration-1000 ease-out delay-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-primary via-emerald-600 to-secondary bg-clip-text text-transparent">
              TOKIEATS
            </h1>
          </div>

          {/* Subtitle */}
          <div className={`transform transition-all duration-1000 ease-out delay-500 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed max-w-2xl mx-auto">
              社内で共有する、<br className="md:hidden" />
              <span className="font-semibold text-foreground">オフィス周辺のグルメ情報プラットフォーム</span>
            </p>
          </div>

          {/* CTA Button */}
          <div className={`transform transition-all duration-1000 ease-out delay-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 group"
              asChild
            >
              <a href="/auth/signin" className="inline-flex items-center gap-3">
                ログインして始める
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
            </Button>
          </div>

          {/* Feature highlights */}
          <div className={`mt-20 transform transition-all duration-1000 ease-out delay-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="group">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50 hover:shadow-md transition-all duration-300 hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">社内コミュニティ</h3>
                  <p className="text-sm text-muted-foreground">同僚とグルメ情報を共有</p>
                </div>
              </div>

              <div className="group">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50 hover:shadow-md transition-all duration-300 hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                    <Star className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">レビュー機能</h3>
                  <p className="text-sm text-muted-foreground">信頼できる評価システム</p>
                </div>
              </div>

              <div className="group">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50 hover:shadow-md transition-all duration-300 hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400/20 to-emerald-400/10 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">オフィス周辺</h3>
                  <p className="text-sm text-muted-foreground">アクセスしやすい立地</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-primary rounded-full animate-ping delay-300" />
      <div className="absolute top-40 right-20 w-3 h-3 bg-secondary rounded-full animate-pulse delay-700" />
      <div className="absolute bottom-20 left-20 w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-1000" />
    </div>
  )
}

export default Home
