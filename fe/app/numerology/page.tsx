"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCosmicStore } from '@/store/useCosmicStore';
import { useNumerology } from '@/hooks/useNumerology';
import { GlassCard } from '@/components/ui/GlassCard';
import { CosmicButton } from '@/components/ui/CosmicButton';
import { Modal } from '@/components/ui/Modal';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';

export default function NumerologyPage() {
  const router = useRouter();
  const { userProfile } = useCosmicStore();
  const { data, loading, error } = useNumerology(userProfile?.name || '', userProfile?.dob || '');
  const [selectedCard, setSelectedCard] = useState<{ title: string; desc: string; number: number | string; color: string } | null>(null);

  if (!userProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <h2 className="text-3xl font-bold">Chưa có Hồ Sơ Vũ Trụ</h2>
        <p className="text-white/60">Vui lòng tạo hồ sơ của bạn để xem Thần Số Học.</p>
        <CosmicButton onClick={() => router.push('/')}>Tạo Hồ Sơ</CosmicButton>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <h2 className="text-2xl font-bold text-red-400">Đã xảy ra lỗi từ Vũ Trụ</h2>
        <p className="text-white/60">{error}</p>
        <CosmicButton onClick={() => window.location.reload()}>Thử lại</CosmicButton>
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 text-accent animate-spin" />
        <p className="text-xl animate-pulse text-white/80">Vũ trụ đang tính toán các con số của bạn...</p>
      </div>
    );
  }

  const cards = [
    { title: "Con Số Cốt Lõi", number: (data as any)?.rawContext?.coreNumber || 0, desc: (data as any)?.rawContext?.meaning?.name || 'Không có dữ liệu', color: "from-blue-500 to-cyan-400" },
    { title: "Năng Lượng", number: "✨", desc: (data as any)?.vibe || 'Không có dữ liệu', color: "from-purple-500 to-pink-500" },
    { title: "Tổng Quan", number: "📖", desc: (data as any)?.summary || 'Không có dữ liệu', color: "from-amber-400 to-orange-500" },
    { title: "Lời Khuyên", number: "💡", desc: (data as any)?.advice || 'Không có dữ liệu', color: "from-emerald-400 to-teal-500" },
  ];

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold"
        >
          Bản Đồ Thần Số Học của {userProfile.name}
        </motion.h1>
        <p className="text-white/60">Chạm vào từng thẻ để xem giải mã chi tiết</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard 
              className="h-full cursor-pointer hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(255,215,0,0.15)] transition-all duration-300 group"
              onClick={() => setSelectedCard(card)}
            >
              <div className="flex flex-col items-center justify-center py-8 text-center space-y-6">
                <h3 className="text-xl font-medium text-white/80 group-hover:text-white transition-colors">{card.title}</h3>
                <div className={`w-24 h-24 rounded-full flex items-center justify-center bg-gradient-to-br ${card.color} shadow-lg`}>
                  <span className="text-4xl font-bold text-white drop-shadow-md">{card.number}</span>
                </div>
                <div className="text-sm text-accent opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  Xem chi tiết <ArrowRight size={14} />
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center pt-12">
        <CosmicButton onClick={() => router.push('/lenormand')} variant="secondary">
          Tiếp tục với Trải Bài Lenormand <ArrowRight size={18} />
        </CosmicButton>
      </div>

      <Modal isOpen={!!selectedCard} onClose={() => setSelectedCard(null)}>
        {selectedCard && (
          <div className="space-y-6 text-center pt-4">
            <h2 className="text-2xl font-bold text-accent">{selectedCard.title}</h2>
            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center bg-gradient-to-br ${selectedCard.color} shadow-lg`}>
              <span className="text-3xl font-bold text-white drop-shadow-md">{selectedCard.number}</span>
            </div>
            <p className="text-lg leading-relaxed text-white/90">
              {selectedCard.desc}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
