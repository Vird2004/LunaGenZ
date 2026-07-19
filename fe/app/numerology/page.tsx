"use client";

import { useRouter } from 'next/navigation';
import { useCosmicStore } from '@/store/useCosmicStore';
import { useNumerology } from '@/hooks/useNumerology';
import { GlassCard } from '@/components/ui/GlassCard';
import { CosmicButton } from '@/components/ui/CosmicButton';
import { Modal } from '@/components/ui/Modal';
import { motion } from 'framer-motion';
import { Sparkles, Star, Loader2, Download, Mail } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function NumerologyPage() {
  const router = useRouter();
  const { userProfile } = useCosmicStore();
  
  // 1. Quản lý State Loading: dùng alias isLoading
  const { data, loading: isLoading, error, sendEmail } = useNumerology(userProfile?.name || '', userProfile?.dob || '', userProfile?.email || '');
  
  const [selectedStat, setSelectedStat] = useState<any>(null);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [emailValue, setEmailValue] = useState(userProfile?.email || '');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSentSuccess, setEmailSentSuccess] = useState(false);

  const handleSendEmail = async () => {
    if (!emailValue) return;
    setSendingEmail(true);
    const success = await sendEmail(emailValue);
    setSendingEmail(false);
    if (success) {
      setEmailSentSuccess(true);
      setTimeout(() => {
        setShowEmailInput(false);
        setEmailSentSuccess(false);
      }, 3000);
    } else {
      alert("Có lỗi xảy ra khi gửi email.");
    }
  };


  const statExplanations: Record<string, string> = {
    lifePath: "Số chủ đạo (Life Path) là con số quan trọng nhất, cho biết mục đích sống, bài học chính bạn cần học và những cơ hội/thử thách trên đường đời.",
    soul: "Số tâm hồn (Soul Urge) đại diện cho khát khao ẩn sâu bên trong, động lực thực sự thôi thúc bạn hành động và những gì bạn cần để cảm thấy mãn nguyện.",
    personality: "Số tính cách (Personality) phản ánh cách bạn thể hiện bản thân ra bên ngoài và ấn tượng đầu tiên bạn để lại trong mắt người khác.",
    destiny: "Số định mệnh (Destiny / Expression) cho thấy sứ mệnh của bạn trong kiếp này, những tài năng bạn mang theo và cách bạn đóng góp cho thế giới.",
    balance: "Chỉ số cân bằng (Balance) hướng dẫn bạn cách tìm lại sự bình yên và cân bằng khi đối mặt với khó khăn, thử thách.",
    attitude: "Chỉ số thái độ (Attitude) cho thấy cách phản ứng tự nhiên và thái độ của bạn trước các tình huống trong cuộc sống, đặc biệt là khi mới tiếp xúc.",
    naturalAbility: "Chỉ số năng lực tự nhiên (Natural Ability) bật mí những tài năng thiên bẩm, những điểm mạnh mà bạn có thể dễ dàng phát huy.",
    approachMotivation: "Chỉ số động lực tiếp cận (Approach Motivation) là nguồn năng lượng thôi thúc bạn khi bắt đầu một dự án mới hay một mối quan hệ mới.",
    approachAbility: "Chỉ số năng lực tiếp cận (Approach Ability) thể hiện cách thức và khả năng bạn dùng để giải quyết và tiếp cận vấn đề.",
    karmicDebt: "Chỉ số nợ nghiệp (Karmic Debt) chỉ ra những bài học chưa hoàn thành từ quá khứ mà bạn cần đối mặt và vượt qua trong kiếp này.",
    outerPersonality: "Chỉ số nhân cách (Outer Personality) tương tự số tính cách, là lớp vỏ bọc bạn dùng để giao tiếp với xã hội.",
    maturity: "Chỉ số trưởng thành (Maturity) tiết lộ những tiềm năng và định hướng sẽ nở rộ khi bạn bước vào nửa sau của cuộc đời (sau 35 tuổi).",
    personalMonth: "Tháng cá nhân (Personal Month) dự báo năng lượng, xu hướng và những sự kiện có khả năng xảy ra với bạn trong tháng hiện tại."
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  
  if (!userProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <h2 className="text-3xl font-bold">Chưa có Hồ Sơ Vũ Trụ</h2>
        <p className="text-white/60">Vui lòng tạo hồ sơ của bạn để xem Thần Số Học.</p>
        <CosmicButton onClick={() => router.push('/')}>Tạo Hồ Sơ</CosmicButton>
      </div>
    );
  }

  // Đoạn hiển thị Loading cũ đã được di dời xuống dưới để giữ Header
  // Xóa bỏ block if (loading) return <Loader2 /> ở đây

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center">
        <h2 className="text-3xl font-bold text-red-500">Lỗi Kết Nối</h2>
        <p className="text-white/80 max-w-md">{error}</p>
        <p className="text-white/60 text-sm mt-4 italic">
          (Nếu bạn đang gọi API local hoặc AWS, hãy chắc chắn đã chạy backend hoặc đã khởi động lại frontend "npm run dev" để nạp biến môi trường mới nhất)
        </p>
        <CosmicButton onClick={() => router.push('/')} className="mt-6">Quay Lại</CosmicButton>
      </div>
    );
  }

  const calculated = data?.calculatedNumbers;
  const pdfUrl = data?.pdfUrl;

  const numerologyStats = calculated ? [
    { id: 'lifePath', label: "Số chủ đạo", value: calculated.lifePath, color: "bg-red-500" },
    { id: 'soul', label: "Số tâm hồn", value: calculated.soul, color: "bg-purple-500" },
    { id: 'personality', label: "Số tính cách", value: calculated.personality, color: "bg-green-600" },
    { id: 'destiny', label: "Số định mệnh", value: calculated.destiny, color: "bg-yellow-500" },
    
    { id: 'balance', label: "Chỉ số cân bằng", value: calculated.balance, color: "bg-blue-500" },
    { id: 'attitude', label: "Chỉ số thái độ", value: calculated.attitude, color: "bg-emerald-400" },
    { id: 'naturalAbility', label: "Chỉ số năng lực tự nhiên", value: calculated.naturalAbility, color: "bg-rose-900" },
    { id: 'approachMotivation', label: "Chỉ số động lực tiếp cận", value: calculated.approachMotivation, color: "bg-red-500" },
    
    { id: 'approachAbility', label: "Chỉ số năng lực tiếp cận", value: calculated.approachAbility, color: "bg-fuchsia-600" },
    { id: 'karmicDebt', label: "Chỉ số nợ nghiệp", value: calculated.karmicDebt, color: "bg-cyan-400" },
    { id: 'outerPersonality', label: "Chỉ số nhân cách", value: calculated.outerPersonality, color: "bg-orange-500" },
    { id: 'maturity', label: "Chỉ số trưởng thành", value: calculated.maturity, color: "bg-teal-500" },
    
    { id: 'personalMonth', label: "Tháng cá nhân", value: calculated.personalMonth, color: "bg-purple-400" }
  ] : [];

  const renderChartGrid = (chart: any) => {
    if (!chart) return null;
    const gridLayout = [
      [3, 6, 9],
      [2, 5, 8],
      [1, 4, 7]
    ];
    return (
      <div className="grid grid-cols-3 gap-0 border border-white/20 w-48 bg-white/5 relative">
        {gridLayout.flat().map((num) => {
          const count = chart[num] || 0;
          let color = "text-white/20";
          if (count > 0) {
            const colors = ["", "text-green-400", "text-blue-300", "text-orange-400", "text-indigo-400", "text-red-400", "text-teal-400", "text-pink-400", "text-cyan-400", "text-yellow-400"];
            color = colors[num] || "text-white";
          }
          return (
            <div key={num} className="aspect-square border border-white/10 flex items-center justify-center relative">
              <span className={`text-2xl font-bold ${color}`}>{count > 0 ? Array(count).fill(num).join('') : ''}</span>
              {count === 0 && <span className="text-[10px] font-bold text-white/10 absolute bottom-1 right-1">{num}</span>}
            </div>
          );
        })}
      </div>
    );
  };

  const renderPyramid = (pinnacles: any[]) => {
    if (!pinnacles) return null;
    return (
      <div className="flex flex-col items-center my-10">
        <svg width="340" height="260" viewBox="0 0 340 260" className="overflow-visible">
          <path d="M 50 200 L 170 80 L 290 200" stroke="#ec4899" strokeWidth="4" fill="none" />
          <path d="M 110 140 L 170 200 L 230 140" stroke="#a855f7" strokeWidth="4" fill="none" />
          <path d="M 30 180 L 170 40 L 310 180" stroke="#555" strokeWidth="3" fill="none" />
  
          {/* Base */}
          <circle cx="50" cy="200" r="14" fill="#6d28d9" />
          <circle cx="170" cy="200" r="14" fill="#6d28d9" />
          <circle cx="290" cy="200" r="14" fill="#6d28d9" />
  
          {/* Peak 1 */}
          <circle cx="110" cy="140" r="16" fill="#a855f7" />
          <text x="110" y="145" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="bold">{pinnacles[0].value}</text>
          <circle cx="75" cy="140" r="14" fill="none" stroke="#fff" />
          <text x="75" y="144" textAnchor="middle" fill="#fff" fontSize="10">{pinnacles[0].age}</text>
          
          {/* Peak 2 */}
          <circle cx="230" cy="140" r="16" fill="#ec4899" />
          <text x="230" y="145" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="bold">{pinnacles[1].value}</text>
          <circle cx="265" cy="140" r="14" fill="none" stroke="#fff" />
          <text x="265" y="144" textAnchor="middle" fill="#fff" fontSize="10">{pinnacles[1].age}</text>
  
          {/* Peak 3 */}
          <circle cx="170" cy="80" r="18" fill="#d946ef" />
          <text x="170" y="86" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="bold">{pinnacles[2].value}</text>
          <circle cx="130" cy="80" r="16" fill="none" stroke="#fff" />
          <text x="130" y="84" textAnchor="middle" fill="#fff" fontSize="10">{pinnacles[2].age}</text>
  
          {/* Peak 4 */}
          <circle cx="170" cy="30" r="18" fill="#8b5cf6" />
          <text x="170" y="36" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="bold">{pinnacles[3].value}</text>
          <circle cx="210" cy="30" r="16" fill="none" stroke="#fff" />
          <text x="210" y="34" textAnchor="middle" fill="#fff" fontSize="10">{pinnacles[3].age}</text>
        </svg>
        <h4 className="font-semibold text-white/90 mt-2 uppercase tracking-widest text-sm">Biểu đồ kim tự tháp đỉnh cao của đời người</h4>
        <CosmicButton className="mt-4 bg-pink-500 hover:bg-pink-600 border-none" onClick={() => scrollTo('reading-pinnacles')}>XEM GIẢI MÃ</CosmicButton>
      </div>
    );
  };

  const renderYearlyCycle = (cycle: any[]) => {
    if (!cycle || cycle.length === 0) return null;
    const width = 600;
    const height = 220;
    const paddingX = 30;
    const paddingY = 40;
    
    const stepX = (width - 2 * paddingX) / (cycle.length - 1);
    const pts = cycle.map((pt, i) => {
      const x = paddingX + i * stepX;
      const y = paddingY + (9 - pt.value) * ((height - 2 * paddingY) / 8);
      return { x, y, val: pt.value, year: pt.year };
    });
  
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const curr = pts[i];
      const next = pts[i+1];
      const ctrl1X = curr.x + stepX / 2;
      const ctrl1Y = curr.y;
      const ctrl2X = next.x - stepX / 2;
      const ctrl2Y = next.y;
      d += ` C ${ctrl1X} ${ctrl1Y}, ${ctrl2X} ${ctrl2Y}, ${next.x} ${next.y}`;
    }
  
    return (
      <div className="flex flex-col items-center my-10 overflow-x-auto w-full pb-4">
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="min-w-[600px] overflow-visible">
          <path d={d} stroke="#d946ef" strokeWidth="4" fill="none" />
          {pts.map((pt, i) => (
            <g key={i}>
              <circle cx={pt.x} cy={pt.y} r="8" fill="#d946ef" />
              <text x={pt.x} y={pt.y - 14} textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">{pt.val}</text>
              <text x={pt.x} y={height - 5} textAnchor="middle" fill="#aaa" fontSize="12">{pt.year}</text>
            </g>
          ))}
        </svg>
        <h4 className="font-semibold text-white/90 mt-6 uppercase tracking-widest text-sm">Chu kỳ vận số 9 năm</h4>
        <CosmicButton className="mt-4 bg-pink-500 hover:bg-pink-600 border-none" onClick={() => scrollTo('reading-yearly')}>XEM GIẢI MÃ</CosmicButton>
      </div>
    );
  };

  // Hàm dọn dẹp placeholder rác "undefined" hoặc "Đang cập nhật..."
  const cleanText = (text: string | undefined | null) => {
    if (!text || text === "Đang cập nhật...") return "";
    return text.replace(/undefined/g, "").trim();
  };

  const markdownComponents = {
    p: ({node, ...props}: any) => <p className="mb-4" {...props} />,
    strong: ({node, ...props}: any) => <strong className="text-accent font-bold" {...props} />,
    h1: ({node, ...props}: any) => <h1 className="text-2xl font-bold mt-6 mb-3 text-white" {...props} />,
    h2: ({node, ...props}: any) => <h2 className="text-xl font-bold mt-5 mb-2 text-white" {...props} />,
    h3: ({node, ...props}: any) => <h3 className="text-lg font-bold mt-4 mb-2 text-white/90" {...props} />,
    h4: ({node, ...props}: any) => <h4 className="text-base font-bold mt-3 mb-2 text-white/90" {...props} />,
    ul: ({node, ...props}: any) => <ul className="list-disc pl-6 mb-4 space-y-1" {...props} />,
    ol: ({node, ...props}: any) => <ol className="list-decimal pl-6 mb-4 space-y-1" {...props} />,
    li: ({node, ...props}: any) => <li className="pl-1" {...props} />,
  };

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

      {/* 2. LOGIC ẨN/HIỆN UI DỰA TRÊN STATE LOADING */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
          <Loader2 className="w-12 h-12 text-accent animate-spin" />
          <p className="text-xl animate-pulse text-white/80">Vũ trụ đang gửi tín hiệu... Vui lòng đợi</p>
        </div>
      ) : (
        !isLoading && data && (
          <>
            {/* LƯỚI CÁC CHỈ SỐ */}
            <div className="pt-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 justify-items-center max-w-4xl mx-auto">
                {numerologyStats.slice(0, 12).map((stat, idx) => (
                  <motion.div
                    key={idx}
                    onClick={() => setSelectedStat(stat)}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: idx * 0.05, type: "spring", stiffness: 100 }}
                    className="flex flex-col items-center justify-start gap-3 w-full cursor-pointer hover:scale-105 transition-transform"
                  >
                    <span className="text-sm font-bold text-white/90 text-center tracking-wide h-10 flex items-end">{stat.label}</span>
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center border-2 border-dashed border-white/40 p-1">
                      <div className={`w-full h-full rounded-full flex items-center justify-center ${stat.color} shadow-lg`}>
                        <span className="text-3xl md:text-4xl font-black text-white drop-shadow-sm">
                          {stat.value}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="flex justify-center mt-10">
                {numerologyStats.slice(12).map((stat, idx) => (
                  <motion.div
                    key={idx}
                    onClick={() => setSelectedStat(stat)}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 12 * 0.05, type: "spring", stiffness: 100 }}
                    className="flex flex-col items-center justify-start gap-3 w-40 cursor-pointer hover:scale-105 transition-transform"
                  >
                    <span className="text-sm font-bold text-white/90 text-center tracking-wide h-10 flex items-end">{stat.label}</span>
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center border-2 border-dashed border-white/40 p-1">
                      <div className={`w-full h-full rounded-full flex items-center justify-center ${stat.color} shadow-lg`}>
                        <span className="text-3xl md:text-4xl font-black text-white drop-shadow-sm">
                          {stat.value}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* KHU VỰC CÁC BIỂU ĐỒ (VISUAL CHARTS) */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="py-8">
              {data?.pinnacles && renderPyramid(data.pinnacles)}
              {data?.birthChart && data?.nameChart && (
                <div className="flex flex-col md:flex-row justify-center gap-12 my-16">
                  <div className="flex flex-col items-center">
                    {renderChartGrid(data.birthChart)}
                    <h4 className="font-semibold text-white/90 mt-6 uppercase tracking-widest text-sm">Biểu đồ ngày sinh</h4>
                    <CosmicButton className="mt-4 bg-pink-500 hover:bg-pink-600 border-none" onClick={() => scrollTo('reading-charts')}>XEM GIẢI MÃ</CosmicButton>
                  </div>
                  <div className="flex flex-col items-center">
                    {renderChartGrid(data.nameChart)}
                    <h4 className="font-semibold text-white/90 mt-6 uppercase tracking-widest text-sm">Biểu đồ họ tên</h4>
                    <CosmicButton className="mt-4 bg-pink-500 hover:bg-pink-600 border-none" onClick={() => scrollTo('reading-charts')}>XEM GIẢI MÃ</CosmicButton>
                  </div>
                </div>
              )}
              {data?.yearlyCycle && renderYearlyCycle(data.yearlyCycle)}
            </motion.div>

            {/* KHU VỰC GIẢI MÃ (TEXT READINGS) */}
            {data?.readings && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="space-y-8"
              >
                {cleanText(data.readings.overview) && (
                  <GlassCard className="bg-gradient-to-r from-accent/10 to-purple-500/10 border-accent/30" id="reading-overview">
                    <div className="flex items-center gap-2 text-accent mb-3">
                      <Sparkles size={24} />
                      <h3 className="text-xl font-bold uppercase tracking-wider">Tổng Quan</h3>
                    </div>
                    <div className="text-white/80 leading-relaxed text-justify mt-6">
                      <ReactMarkdown components={markdownComponents}>{cleanText(data.readings.overview)}</ReactMarkdown>
                    </div>
                  </GlassCard>
                )}

                {cleanText(data.readings.pinnacles) && (
                  <GlassCard className="bg-white/[0.02] border-white/10" id="reading-pinnacles">
                    <div className="flex items-center gap-2 text-pink-400 mb-3">
                      <Star size={24} />
                      <h3 className="text-xl font-bold uppercase tracking-wider">Giải Mã Kim Tự Tháp Đỉnh Cao</h3>
                    </div>
                    <div className="text-white/80 leading-relaxed text-justify mt-6">
                      <ReactMarkdown components={markdownComponents}>{cleanText(data.readings.pinnacles)}</ReactMarkdown>
                    </div>
                  </GlassCard>
                )}

                {cleanText(data.readings.charts) && (
                  <GlassCard className="bg-white/[0.02] border-white/10" id="reading-charts">
                    <div className="flex items-center gap-2 text-blue-400 mb-3">
                      <Star size={24} />
                      <h3 className="text-xl font-bold uppercase tracking-wider">Giải Mã Mũi Tên Sức Mạnh</h3>
                    </div>
                    <div className="text-white/80 leading-relaxed text-justify mt-6">
                      <ReactMarkdown components={markdownComponents}>{cleanText(data.readings.charts)}</ReactMarkdown>
                    </div>
                  </GlassCard>
                )}

                {cleanText(data.readings.yearly) && (
                  <GlassCard className="bg-white/[0.02] border-white/10" id="reading-yearly">
                    <div className="flex items-center gap-2 text-purple-400 mb-3">
                      <Star size={24} />
                      <h3 className="text-xl font-bold uppercase tracking-wider">Giải Mã Chu Kỳ Cá Nhân</h3>
                    </div>
                    <div className="text-white/80 leading-relaxed text-justify mt-6">
                      <ReactMarkdown components={markdownComponents}>{cleanText(data.readings.yearly)}</ReactMarkdown>
                    </div>
                  </GlassCard>
                )}
              </motion.div>
            )}
          </>
        )
      )}

      {/* 4. MODAL GIẢI THÍCH CHI TIẾT TỪNG CHỈ SỐ */}
      <Modal isOpen={!!selectedStat} onClose={() => setSelectedStat(null)}>
        {selectedStat && (
          <div className="space-y-4 text-center mt-4">
            <h3 className="text-2xl font-bold uppercase tracking-wider" style={{ color: selectedStat.color.replace('bg-', '') }}>
              {selectedStat.label}: {selectedStat.value}
            </h3>
            <div className="w-16 h-1 bg-white/30 mx-auto rounded-full" />
            <p className="text-white/80 leading-relaxed text-lg pt-2 text-justify">
              {statExplanations[selectedStat.id] || "Đang cập nhật ý nghĩa..."}
            </p>
            <CosmicButton onClick={() => setSelectedStat(null)} className="mt-6">
              Đóng
            </CosmicButton>
          </div>
        )}
      </Modal>

      {/* 5. NÚT TẢI PDF & GỬI EMAIL */}
      {pdfUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col items-center mt-12 pb-12 gap-6"
          id="pdf-download"
        >
          <div className="flex flex-wrap justify-center gap-4">
            <CosmicButton 
              className="text-lg py-4 px-8 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-lg shadow-pink-500/30 flex items-center gap-2"
              onClick={() => window.open(pdfUrl, '_blank')}
            >
              <Download size={24} />
              Tải Báo Cáo PDF
            </CosmicButton>
            
            <CosmicButton 
              className="text-lg py-4 px-8 bg-white/10 hover:bg-white/20 border border-white/20 flex items-center gap-2"
              onClick={() => setShowEmailInput(!showEmailInput)}
            >
              <Mail size={24} />
              Gửi qua Email
            </CosmicButton>
          </div>

          {showEmailInput && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex flex-col items-center gap-3 bg-white/5 p-6 rounded-2xl border border-white/10 w-full max-w-md overflow-hidden"
            >
              <p className="text-white/80 text-sm">Nhập email để nhận bản PDF báo cáo:</p>
              <input
                type="email"
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                placeholder="Email của bạn..."
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-accent transition-colors"
              />
              <CosmicButton 
                className="w-full mt-2" 
                onClick={handleSendEmail}
                disabled={sendingEmail}
              >
                {sendingEmail ? 'Đang gửi...' : 'Xác nhận gửi'}
              </CosmicButton>
              {emailSentSuccess && (
                <p className="text-green-400 text-sm mt-2">Đã gửi báo cáo thành công!</p>
              )}
            </motion.div>
          )}
        </motion.div>
      )}

      {/* POPUP (MODAL) */}
      {selectedStat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedStat(null)}>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#1a1f35] border border-accent/50 p-6 md:p-8 rounded-2xl max-w-md w-full shadow-[0_0_30px_rgba(45,27,78,0.8)] relative"
            onClick={e => e.stopPropagation()}
          >
            <button onClick={() => setSelectedStat(null)} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors">✕</button>
            <h3 className="text-xl font-bold mb-4 text-accent">{selectedStat.label} = {selectedStat.value}</h3>
            <p className="text-white/80 leading-relaxed text-justify">
              {statExplanations[selectedStat.id] || "Đang cập nhật thông tin giải mã chi tiết..."}
            </p>
            <div className="mt-8">
              <CosmicButton onClick={() => setSelectedStat(null)} className="w-full">Đóng</CosmicButton>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}