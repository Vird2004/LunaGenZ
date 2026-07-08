"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { CosmicButton } from '@/components/ui/CosmicButton';
import { useCosmicStore } from '@/store/useCosmicStore';
import { Sparkles, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const router = useRouter();
  const { setUserProfile } = useCosmicStore();
  const [showDonatePopup, setShowDonatePopup] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    gender: 'Nam',
    dob: '',
    email: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.dob) {
      setUserProfile(formData);
      router.push('/numerology');
    }
  };

  return (
    <div className="flex flex-col gap-24">
      {/* Hero Section */}
      <section className="relative flex flex-col lg:flex-row items-center justify-between gap-12 mt-12">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 space-y-6"
        >
          <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight">
            Khám phá <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent via-purple-400 to-pink-500">
              Vũ Trụ Của Bạn
            </span>
          </h1>
          <p className="text-xl text-white/70 max-w-lg">
            Sử dụng trí tuệ nhân tạo để giải mã các thông điệp từ Thần số học và bài Lenormand dành riêng cho bạn.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 w-full max-w-md"
        >
          <GlassCard className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-accent/10 z-0" />
            <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="text-accent" /> Hồ Sơ Vũ Trụ
              </h2>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Họ và Tên</label>
                <input 
                  type="text" 
                  required
                  placeholder="Nhập tên của bạn"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-accent transition-colors"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Giới Tính</label>
                <select 
                  className="w-full px-4 py-3 rounded-xl bg-[#1a1f35] border border-white/10 text-white focus:outline-none focus:border-accent transition-colors"
                  value={formData.gender}
                  onChange={e => setFormData({ ...formData, gender: e.target.value })}
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Ngày Sinh</label>
                <input 
                  type="date" 
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#1a1f35] border border-white/10 text-white focus:outline-none focus:border-accent transition-colors"
                  value={formData.dob}
                  onChange={e => setFormData({ ...formData, dob: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Email <span className="text-white/40 text-xs">(Tùy chọn - để nhận báo cáo PDF)</span></label>
                <input 
                  type="email" 
                  placeholder="Nhập email của bạn"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-accent transition-colors"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <CosmicButton type="submit" className="w-full mt-4">
                Tạo Lá Số Vũ Trụ
              </CosmicButton>
            </form>
          </GlassCard>
        </motion.div>
      </section>

      {/* Donate Section */}
      <section className="flex flex-col items-center justify-center space-y-6 text-center my-20">
        <h2 className="text-3xl font-bold">Ủng Hộ Tác Giả</h2>
        <p className="text-white/60 max-w-lg">
          Dự án được duy trì hoàn toàn miễn phí. Nếu ứng dụng mang lại giá trị cho bạn và bạn có lòng hảo tâm, xin ly cà phê để nhóm có thêm động lực duy trì và phát triển nhé! ☕
        </p>
        <CosmicButton onClick={() => setShowDonatePopup(true)} className="px-8 py-3 text-lg bg-gradient-to-r from-pink-500 to-purple-600">
          Mời Ly Cà Phê ☕
        </CosmicButton>
      </section>

      {/* Donate Popup */}
      {showDonatePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowDonatePopup(false)}>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#1a1f35] border border-accent/50 p-6 md:p-8 rounded-2xl max-w-sm w-full shadow-[0_0_30px_rgba(45,27,78,0.8)] relative text-center flex flex-col items-center"
            onClick={e => e.stopPropagation()}
          >
            <button onClick={() => setShowDonatePopup(false)} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors">✕</button>
            <h3 className="text-2xl font-bold mb-2 text-accent">Cảm ơn bạn! 💖</h3>
            <p className="text-white/80 mb-6 text-sm">
              Mỗi đóng góp của bạn đều là nguồn động viên to lớn để dự án tiếp tục ra mắt thêm nhiều tính năng mới!
            </p>
            
            <div className="bg-white p-2 rounded-xl mb-4 w-full aspect-[3/4] flex items-center justify-center overflow-hidden">
              <img src="/donate-qr.jpg" alt="Donate QR Code" className="w-full h-full object-contain" />
            </div>
            
            <p className="font-bold text-white/90">NGUYỄN QUỐC VƯỢNG</p>
            <p className="text-white/50 text-sm">MoMo / VietQR</p>
            
            <div className="mt-6 w-full">
              <CosmicButton onClick={() => setShowDonatePopup(false)} className="w-full">Đóng</CosmicButton>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
