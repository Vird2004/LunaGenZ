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
  const [formData, setFormData] = useState({
    name: '',
    gender: 'Nam',
    dob: ''
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

              <CosmicButton type="submit" className="w-full mt-4">
                Tạo Lá Số Vũ Trụ
              </CosmicButton>
            </form>
          </GlassCard>
        </motion.div>
      </section>

      {/* Pricing Section */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold">Gói Cước Vũ Trụ</h2>
          <p className="text-white/60">Chọn hành trình phù hợp với năng lượng của bạn</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Cơ Bản */}
          <GlassCard className="flex flex-col h-full hover:-translate-y-2 transition-transform duration-300">
            <div className="space-y-4 flex-1">
              <h3 className="text-2xl font-bold text-white/90">Cơ Bản</h3>
              <p className="text-3xl font-bold">Miễn Phí</p>
              <ul className="space-y-3 mt-6 text-white/70">
                <li className="flex items-center gap-2"><Check size={18} className="text-green-400" /> Giải mã đường đời cơ bản</li>
                <li className="flex items-center gap-2"><Check size={18} className="text-green-400" /> Trải 1 lá bài Lenormand</li>
              </ul>
            </div>
            <CosmicButton variant="outline" className="w-full mt-8">Bắt Đầu Ngay</CosmicButton>
          </GlassCard>

          {/* Tiêu Chuẩn */}
          <GlassCard className="flex flex-col h-full relative border-accent/50 scale-105 shadow-[0_0_30px_rgba(45,27,78,0.5)] z-10 hover:-translate-y-2 transition-transform duration-300">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-background px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Phổ Biến Nhất
            </div>
            <div className="space-y-4 flex-1">
              <h3 className="text-2xl font-bold text-accent">Tiêu Chuẩn</h3>
              <p className="text-3xl font-bold">99.000đ<span className="text-lg text-white/50 font-normal">/tháng</span></p>
              <ul className="space-y-3 mt-6 text-white/80">
                <li className="flex items-center gap-2"><Check size={18} className="text-accent" /> Giải mã toàn bộ chỉ số</li>
                <li className="flex items-center gap-2"><Check size={18} className="text-accent" /> Trải bài 3 lá chuyên sâu</li>
                <li className="flex items-center gap-2"><Check size={18} className="text-accent" /> AI Chatbot tư vấn 24/7</li>
              </ul>
            </div>
            <CosmicButton variant="primary" className="w-full mt-8">Nâng Cấp</CosmicButton>
          </GlassCard>

          {/* Cao Cấp */}
          <GlassCard className="flex flex-col h-full hover:-translate-y-2 transition-transform duration-300">
            <div className="space-y-4 flex-1">
              <h3 className="text-2xl font-bold text-purple-400">Cao Cấp</h3>
              <p className="text-3xl font-bold">199.000đ<span className="text-lg text-white/50 font-normal">/tháng</span></p>
              <ul className="space-y-3 mt-6 text-white/70">
                <li className="flex items-center gap-2"><Check size={18} className="text-purple-400" /> Mọi tính năng Tiêu chuẩn</li>
                <li className="flex items-center gap-2"><Check size={18} className="text-purple-400" /> Trải bài Grand Tableau (36 lá)</li>
                <li className="flex items-center gap-2"><Check size={18} className="text-purple-400" /> Gọi trực tiếp chuyên gia</li>
              </ul>
            </div>
            <CosmicButton variant="outline" className="w-full mt-8">Đăng Ký</CosmicButton>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}
