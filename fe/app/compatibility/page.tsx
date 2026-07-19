"use client";

import { useRouter } from 'next/navigation';
import { useCosmicStore } from '@/store/useCosmicStore';
import { useCompatibility } from '@/hooks/useCompatibility';
import { GlassCard } from '@/components/ui/GlassCard';
import { CosmicButton } from '@/components/ui/CosmicButton';
import { motion } from 'framer-motion';
import { Heart, Loader2, Sparkles } from 'lucide-react';

export default function CompatibilityPage() {
  const router = useRouter();
  const { userProfile, partnerProfile } = useCosmicStore();
  
  const { data, loading, error } = useCompatibility(userProfile, partnerProfile);

  if (!userProfile || !partnerProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <h2 className="text-3xl font-bold">Chưa có đủ Thông tin 2 người</h2>
        <CosmicButton onClick={() => router.push('/')}>Trở về Trang Chủ</CosmicButton>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center">
        <h2 className="text-3xl font-bold text-red-500">Lỗi Kết Nối</h2>
        <p className="text-white/80 max-w-md">{error}</p>
        <CosmicButton onClick={() => router.push('/')} className="mt-6">Quay Lại</CosmicButton>
      </div>
    );
  }

  const cleanText = (text: string | undefined | null) => {
    if (!text) return "";
    return text.replace(/undefined/g, "").trim();
  };

  return (
    <div className="space-y-12 max-w-5xl mx-auto pb-20 pt-8 px-4">
      
      {/* HEADER */}
      <motion.div 
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center space-y-4"
      >
        <p className="text-pink-400 uppercase tracking-widest text-xs md:text-sm font-semibold flex items-center justify-center gap-2">
          <Heart size={16} /> Phân Tích Độ Tương Hợp <Heart size={16} />
        </p>
        <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-wide">
          <span className="text-accent">{userProfile.name}</span> & <span className="text-purple-400">{partnerProfile.name}</span>
        </h1>
      </motion.div>

      {/* STATE LOADING */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-6">
          <div className="relative">
            <Loader2 className="w-16 h-16 text-pink-500 animate-spin absolute" />
            <Heart className="w-8 h-8 text-purple-400 animate-pulse absolute top-4 left-4" />
          </div>
          <p className="text-xl animate-pulse text-white/80 pt-10">Vũ trụ đang kết nối tần số của hai bạn...</p>
        </div>
      ) : (
        !loading && data && (
          <div className="space-y-16">
            
            {/* THÔNG TIN CHỈ SỐ CƠ BẢN 2 NGƯỜI VÀ % TƯƠNG HỢP Ở GIỮA */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 relative">
              
              {/* Người 1 */}
              <motion.div 
                initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                className="w-full md:w-1/3 flex flex-col items-center"
              >
                <div className="w-32 h-32 rounded-full bg-accent/20 border-4 border-accent flex flex-col items-center justify-center shadow-[0_0_20px_rgba(255,215,0,0.3)]">
                  <span className="text-sm text-white/80 uppercase tracking-wider">Số Chủ Đạo</span>
                  <span className="text-5xl font-black text-accent drop-shadow-md">
                    {data.person1?.calculatedNumbers?.lifePath || '?'}
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-bold text-white/90 uppercase">{userProfile.name}</h3>
                <div className="mt-2 text-white/60 text-sm space-y-1 text-center">
                  <p>Linh hồn: {data.person1?.calculatedNumbers?.soul || '?'}</p>
                  <p>Tính cách: {data.person1?.calculatedNumbers?.personality || '?'}</p>
                  <p>Sứ mệnh: {data.person1?.calculatedNumbers?.destiny || '?'}</p>
                </div>
              </motion.div>

              {/* Phần trăm ở giữa */}
              <motion.div 
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: 'spring' }}
                className="w-48 h-48 md:w-56 md:h-56 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 border-8 border-[#1a1f35] flex flex-col items-center justify-center shadow-[0_0_40px_rgba(236,72,153,0.5)] z-10 my-8 md:my-0"
              >
                <Heart className="text-white/80 mb-2 animate-pulse" size={32} />
                <span className="text-5xl md:text-6xl font-black text-white drop-shadow-lg">
                  {data.percentage}
                </span>
                <span className="text-xs text-white/80 mt-2 uppercase tracking-widest">Độ Hòa Hợp</span>
              </motion.div>

              {/* Người 2 */}
              <motion.div 
                initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                className="w-full md:w-1/3 flex flex-col items-center"
              >
                <div className="w-32 h-32 rounded-full bg-purple-500/20 border-4 border-purple-400 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(192,132,252,0.3)]">
                  <span className="text-sm text-white/80 uppercase tracking-wider">Số Chủ Đạo</span>
                  <span className="text-5xl font-black text-purple-400 drop-shadow-md">
                    {data.person2?.calculatedNumbers?.lifePath || '?'}
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-bold text-white/90 uppercase">{partnerProfile.name}</h3>
                <div className="mt-2 text-white/60 text-sm space-y-1 text-center">
                  <p>Linh hồn: {data.person2?.calculatedNumbers?.soul || '?'}</p>
                  <p>Tính cách: {data.person2?.calculatedNumbers?.personality || '?'}</p>
                  <p>Sứ mệnh: {data.person2?.calculatedNumbers?.destiny || '?'}</p>
                </div>
              </motion.div>
            </div>

            {/* BÀI PHÂN TÍCH AI */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <GlassCard className="bg-gradient-to-br from-pink-500/5 to-purple-600/5 border-pink-500/20">
                <div className="flex items-center gap-2 text-pink-400 mb-6 border-b border-pink-500/20 pb-4">
                  <Sparkles size={24} />
                  <h3 className="text-2xl font-bold uppercase tracking-wider">Thông điệp từ Vũ Trụ</h3>
                </div>
                <div className="text-white/80 leading-relaxed text-justify whitespace-pre-wrap prose prose-invert prose-pink max-w-none prose-headings:text-pink-400 prose-a:text-purple-400">
                  {cleanText(data.reading)}
                </div>
              </GlassCard>
            </motion.div>
            
          </div>
        )
      )}
    </div>
  );
}
