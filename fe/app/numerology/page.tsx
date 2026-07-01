"use client";

import { useRouter } from 'next/navigation';
import { useCosmicStore } from '@/store/useCosmicStore';
import { useNumerology } from '@/hooks/useNumerology';
import { GlassCard } from '@/components/ui/GlassCard';
import { CosmicButton } from '@/components/ui/CosmicButton';
import { motion } from 'framer-motion';
import { Lock, Sparkles, Star, Loader2 } from 'lucide-react';

export default function NumerologyPage() {
  const router = useRouter();
  const { userProfile } = useCosmicStore();
  const { loading } = useNumerology(userProfile?.name || '', userProfile?.dob || '');
  
  if (!userProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <h2 className="text-3xl font-bold">Chưa có Hồ Sơ Vũ Trụ</h2>
        <p className="text-white/60">Vui lòng tạo hồ sơ của bạn để xem Thần Số Học.</p>
        <CosmicButton onClick={() => router.push('/')}>Tạo Hồ Sơ</CosmicButton>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 text-accent animate-spin" />
        <p className="text-xl animate-pulse text-white/80">Vũ trụ đang tính toán các con số của bạn...</p>
      </div>
    );
  }

  // Đã bỏ isMain, tất cả các chỉ số giờ sẽ to bằng nhau. 
  // Thêm borderColor để làm vòng tròn giống web mẫu.
  const numerologyStats = [
    { label: "Số chủ đạo", value: "8", textCol: "text-red-500", borderCol: "border-red-500", bgCol: "bg-red-500/10" },
    { label: "Số tâm hồn", value: "8", textCol: "text-purple-500", borderCol: "border-purple-500", bgCol: "bg-purple-500/10" },
    { label: "Số tính cách", value: "6", textCol: "text-emerald-500", borderCol: "border-emerald-500", bgCol: "bg-emerald-500/10" },
    { label: "Số định mệnh", value: "5", textCol: "text-amber-500", borderCol: "border-amber-500", bgCol: "bg-amber-500/10" },
    { label: "Chỉ số cân bằng", value: "8", textCol: "text-blue-500", borderCol: "border-blue-500", bgCol: "bg-blue-500/10" },
    { label: "Chỉ số thái độ", value: "2", textCol: "text-green-500", borderCol: "border-green-500", bgCol: "bg-green-500/10" },
    { label: "Năng lực tự nhiên", value: "5", textCol: "text-rose-900", borderCol: "border-rose-900", bgCol: "bg-rose-900/10" },
    { label: "Động lực tiếp cận", value: "8", textCol: "text-red-400", borderCol: "border-red-400", bgCol: "bg-red-400/10" },
    { label: "Năng lực tiếp cận", value: "7", textCol: "text-fuchsia-500", borderCol: "border-fuchsia-500", bgCol: "bg-fuchsia-500/10" },
    { label: "Chỉ số nợ nghiệp", value: "0", textCol: "text-sky-400", borderCol: "border-sky-400", bgCol: "bg-sky-400/10" },
    { label: "Chỉ số nhân cách", value: "6", textCol: "text-orange-400", borderCol: "border-orange-400", bgCol: "bg-orange-400/10" },
    { label: "Chỉ số trưởng thành", value: "4", textCol: "text-teal-500", borderCol: "border-teal-500", bgCol: "bg-teal-500/10" },
    { label: "Tháng cá nhân", value: "9", textCol: "text-violet-400", borderCol: "border-violet-400", bgCol: "bg-violet-400/10" },
  ];

  // Tách riêng 12 số đầu (để xếp 4 cột) và số thứ 13 (để căn giữa ở dưới cùng)
  const first12Stats = numerologyStats.slice(0, 12);
  const lastStat = numerologyStats[12];

  return (
    <div className="space-y-12 max-w-5xl mx-auto pb-20 pt-8">
      
      {/* HEADER */}
      <motion.div 
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center space-y-2"
      >
        <p className="text-white/60 uppercase tracking-widest text-xs md:text-sm font-semibold">Dưới đây là những phân tích mật mã về ngày sinh và họ tên của bạn</p>
        <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-wide">
          Chào bạn <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-400">{userProfile.name}</span>, Sinh ngày {userProfile.dob}
        </h1>
      </motion.div>

      {/* 1. LƯỚI CÁC CHỈ SỐ (XẾP CHUẨN 4 CỘT) */}
      <div className="pt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-4">
          {first12Stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: idx * 0.05, type: "spring", stiffness: 100 }}
              className="flex flex-col items-center justify-center gap-3"
            >
              <span className="text-sm font-bold text-white/90">{stat.label}</span>
              <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center border-4 ${stat.borderCol} ${stat.bgCol} shadow-lg`}>
                <span className={`text-4xl font-black ${stat.textCol} drop-shadow-md`}>
                  {stat.value}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CHỈ SỐ THỨ 13 NẰM RIÊNG Ở GIỮA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 12 * 0.05, type: "spring", stiffness: 100 }}
          className="flex flex-col items-center justify-center gap-3 mt-10"
        >
          <span className="text-sm font-bold text-white/90">{lastStat.label}</span>
          <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center border-4 ${lastStat.borderCol} ${lastStat.bgCol} shadow-lg`}>
            <span className={`text-4xl font-black ${lastStat.textCol} drop-shadow-md`}>
              {lastStat.value}
            </span>
          </div>
        </motion.div>
      </div>

      {/* 2. TEXT MỒI NHỬ CHUNG CHUNG */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <GlassCard className="bg-gradient-to-r from-accent/10 to-purple-500/10 border-accent/30 mt-8">
          <div className="flex items-center gap-2 text-accent mb-3">
            <Sparkles size={24} />
            <h3 className="text-xl font-bold uppercase tracking-wider">Tổng quan năng lượng</h3>
          </div>
          <p className="text-white/80 leading-relaxed text-justify">
            Mang trong mình sức mạnh của Số chủ đạo 8, bạn sở hữu tính độc lập và tự chủ cực kì cao. Bạn coi sự tự lập là điều vô cùng quan trọng, không thích làm phiền ai và luôn là chỗ dựa đáng tin cậy. Vũ trụ ban cho bạn sức mạnh, cá tính mạnh mẽ và một tố chất lãnh đạo bẩm sinh. Hãy chuẩn bị sẵn sàng cho những chuyển biến tích cực trong thời gian tới...
          </p>
        </GlassCard>
      </motion.div>

      {/* 3. PHẦN NỘI DUNG CHUYÊN SÂU BỊ LÀM MỜ (PREMIUM GATE) */}
      <div className="relative mt-12 pt-8 border-t border-white/10">
        
        {/* Nội dung ảo bị blur */}
        <div className="blur-[6px] opacity-40 select-none pointer-events-none space-y-12">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">Bốn đỉnh cao đời người</h3>
            <div className="flex justify-center items-end gap-2 h-40">
              <div className="w-16 bg-white/20 h-16 rounded-t-lg"></div>
              <div className="w-16 bg-white/20 h-24 rounded-t-lg"></div>
              <div className="w-16 bg-white/20 h-32 rounded-t-lg"></div>
              <div className="w-16 bg-white/20 h-40 rounded-t-lg"></div>
            </div>
            <p className="bg-white/20 h-4 rounded w-full mt-4"></p>
            <p className="bg-white/20 h-4 rounded w-5/6"></p>
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">Biểu đồ ngày sinh & Mũi tên</h3>
            <div className="grid grid-cols-3 gap-2 w-48 mx-auto">
               {[...Array(9)].map((_, i) => <div key={i} className="aspect-square bg-white/20 rounded-md"></div>)}
            </div>
          </div>
        </div>

        {/* Khung chốt Sale */}
        <div className="absolute inset-0 top-0 flex flex-col items-center justify-start z-10">
          <div className="sticky top-1/3 bg-[#13172c] p-8 rounded-3xl text-center space-y-6 shadow-[0_0_40px_rgba(45,27,78,0.8)] border border-accent/40 max-w-md w-full">
            <div className="w-20 h-20 bg-gradient-to-br from-accent to-orange-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-accent/20">
              <Lock size={36} className="text-background" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Giải Mã Chuyên Sâu</h2>
              <p className="text-white/70 text-sm mb-4">
                Khám phá toàn bộ biểu đồ kim tự tháp 4 đỉnh cao, ý nghĩa trục các mũi tên, phân tích nợ nghiệp và dự báo chi tiết chu kỳ vận số 9 năm.
              </p>
              
              <ul className="text-sm text-left text-white/80 space-y-3 bg-white/5 p-4 rounded-xl border border-white/10">
                <li className="flex items-center gap-2">
                  <Star size={16} className="text-accent" /> <span>Biểu đồ kim tự tháp 4 đỉnh cao</span>
                </li>
                <li className="flex items-center gap-2">
                  <Star size={16} className="text-accent" /> <span>Biểu đồ ngày sinh & Mũi tên</span>
                </li>
                <li className="flex items-center gap-2">
                  <Star size={16} className="text-accent" /> <span>Dự báo chu kỳ vận số 9 năm</span>
                </li>
              </ul>
            </div>
            <CosmicButton className="w-full text-lg py-4">Mở Khóa Hồ Sơ (Chỉ 99k)</CosmicButton>
          </div>
        </div>

      </div>
    </div>
  );
}