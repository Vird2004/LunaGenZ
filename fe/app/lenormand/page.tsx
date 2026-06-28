"use client";

import { useState } from 'react';
import { useLenormand } from '@/hooks/useLenormand';
import { useCosmicStore } from '@/store/useCosmicStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { CosmicButton } from '@/components/ui/CosmicButton';
import { Modal } from '@/components/ui/Modal';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Loader2, RefreshCw } from 'lucide-react';
import { LenormandCard } from '@/types';

type ThemeType = 'Tình Yêu' | 'Công Việc' | 'Hàng Ngày';

export default function LenormandPage() {
  const { deck, loading } = useLenormand();
  const { userProfile } = useCosmicStore();
  const [selectedTheme, setSelectedTheme] = useState<ThemeType>('Hàng Ngày');
  const [drawnCards, setDrawnCards] = useState<LenormandCard[]>([]);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

  const themes: ThemeType[] = ['Tình Yêu', 'Công Việc', 'Hàng Ngày'];

  const drawCard = (card: LenormandCard) => {
    if (drawnCards.length >= 3) return; // Limit to 3 for standard reading
    if (!drawnCards.find(c => c.id === card.id)) {
      setDrawnCards([...drawnCards, card]);
    }
  };

  const resetReading = () => {
    setDrawnCards([]);
  };

  if (loading || deck.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 text-accent animate-spin" />
        <p className="text-xl animate-pulse text-white/80">Đang xào bài Lenormand...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Trải Bài Lenormand</h1>
        <p className="text-white/60">
          {userProfile ? `Xin chào ${userProfile.name}, h` : 'H'}ãy chọn chủ đề và rút 3 lá bài để nhận thông điệp.
        </p>
      </div>

      {/* Theme Selection */}
      <div className="flex flex-wrap justify-center gap-4">
        {themes.map(theme => (
          <button
            key={theme}
            onClick={() => { setSelectedTheme(theme); resetReading(); }}
            className={`px-6 py-2 rounded-full border transition-all duration-300 ${
              selectedTheme === theme 
                ? 'bg-accent text-background border-accent font-semibold shadow-[0_0_15px_rgba(255,215,0,0.4)]'
                : 'bg-transparent text-white/70 border-white/20 hover:border-accent hover:text-accent'
            }`}
          >
            {theme}
          </button>
        ))}
      </div>

      {/* Deck of Face Down Cards */}
      <div className="relative w-full max-w-5xl mx-auto h-48 overflow-x-auto overflow-y-hidden hide-scrollbar py-4 px-8">
        <div className="flex items-center gap-[-20px] absolute left-1/2 -translate-x-1/2">
          {deck.map((card, idx) => {
            const isDrawn = drawnCards.some(c => c.id === card.id);
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: isDrawn ? 0 : 1, y: 0 }}
                transition={{ delay: idx * 0.02 }}
                onClick={() => drawCard(card)}
                className={`relative w-24 h-36 rounded-lg bg-gradient-to-br from-primary to-blue-900 border-2 border-white/10 shadow-[0_4px_15px_rgba(0,0,0,0.5)] flex items-center justify-center cursor-pointer hover:-translate-y-4 hover:border-accent transition-transform shrink-0 ${idx !== 0 ? '-ml-12' : ''}`}
                style={{ zIndex: deck.length - idx }}
              >
                <div className="w-16 h-24 border border-white/20 rounded-sm opacity-50 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full border border-white/30" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Drawn Cards Slots */}
      <div className="min-h-[300px] flex flex-col items-center gap-8">
        <div className="flex justify-center gap-4 sm:gap-8 flex-wrap">
          <AnimatePresence>
            {drawnCards.map((card) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, scale: 0.5, rotateY: 180, y: -100 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0, y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                className="w-48 h-72 [perspective:1000px] group"
              >
                <GlassCard className="w-full h-full p-4 flex flex-col items-center text-center justify-between border-accent/40 shadow-[0_0_20px_rgba(255,215,0,0.15)] bg-[#1a1f35]/80">
                  <div className="text-xs font-bold text-accent">Lá số {card.id}</div>
                  <div className="flex-1 w-full flex items-center justify-center my-4 bg-white/5 rounded-lg border border-white/10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent"></div>
                    {/* Placeholder image representation */}
                    <div className="text-4xl text-white/80 font-serif">✨</div>
                  </div>
                  <h3 className="font-bold text-lg leading-tight mb-2">{card.name}</h3>
                  <p className="text-xs text-white/70 line-clamp-3">
                    {selectedTheme === 'Tình Yêu' && card.meaning.love}
                    {selectedTheme === 'Công Việc' && card.meaning.career}
                    {selectedTheme === 'Hàng Ngày' && card.meaning.daily}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {/* Empty slots for visual cue */}
          {[...Array(Math.max(0, 3 - drawnCards.length))].map((_, i) => (
            <div key={`empty-${i}`} className="w-48 h-72 rounded-2xl border-2 border-dashed border-white/20 flex items-center justify-center bg-white/5">
              <span className="text-white/30 text-sm">Rút lá {drawnCards.length + i + 1}</span>
            </div>
          ))}
        </div>

        {drawnCards.length > 0 && (
          <CosmicButton variant="outline" onClick={resetReading}>
            <RefreshCw size={18} /> Rút Lại
          </CosmicButton>
        )}
      </div>

      {/* Premium Gate */}
      <div className="flex justify-center pt-8">
        <CosmicButton 
          variant="primary" 
          className="bg-gradient-to-r from-amber-500 to-orange-600 border-none shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:scale-105 px-10 py-4 text-lg"
          onClick={() => setIsPremiumModalOpen(true)}
        >
          Trải Bài Grand Tableau (36 Lá) <Lock size={20} className="ml-2" />
        </CosmicButton>
      </div>

      {/* Premium Upgrade Modal */}
      <Modal isOpen={isPremiumModalOpen} onClose={() => setIsPremiumModalOpen(false)}>
        <div className="space-y-6 text-center">
          <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto text-accent">
            <Lock size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Nâng Cấp Cao Cấp</h2>
            <p className="text-white/70">
              Trải bài Grand Tableau (36 lá) yêu cầu năng lượng phân tích khổng lồ. 
              Vui lòng nâng cấp tài khoản để mở khóa tính năng này và nhận sự hỗ trợ trực tiếp từ chuyên gia.
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-xl font-bold text-accent mb-1">Gói Cao Cấp</div>
            <div className="text-3xl font-bold mb-4">199.000đ<span className="text-sm font-normal text-white/50">/tháng</span></div>
            <ul className="text-sm text-left text-white/80 space-y-2 max-w-xs mx-auto mb-6">
              <li>✨ Giải mã chi tiết Grand Tableau 36 lá</li>
              <li>✨ Kết nối chuyên gia định kỳ</li>
              <li>✨ Không giới hạn câu hỏi AI</li>
            </ul>
            <CosmicButton className="w-full">Mở Khóa Ngay</CosmicButton>
          </div>
        </div>
      </Modal>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
