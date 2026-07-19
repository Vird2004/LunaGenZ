"use client";

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useLenormand } from '@/hooks/useLenormand';
import { useCosmicStore } from '@/store/useCosmicStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { CosmicButton } from '@/components/ui/CosmicButton';
import { Modal } from '@/components/ui/Modal';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Loader2, RefreshCw, Sparkles } from 'lucide-react';
import { LenormandCard } from '@/types';

export default function LenormandPage() {
  const { deck, loading } = useLenormand();
  const { userProfile } = useCosmicStore();

  // 1. Quản lý bộ bài (Xào bài ngẫu nhiên tại máy khách)
  const [localDeck, setLocalDeck] = useState<LenormandCard[]>([]);

  // 2. Quản lý State cho Form tùy chọn
  const [selectedTheme, setSelectedTheme] = useState('Hàng Ngày');
  const [cardCount, setCardCount] = useState(3);

  // 3. Quản lý State hiển thị kết quả
  const [displaySlots, setDisplaySlots] = useState<(LenormandCard | null)[]>([]);
  const [selectedCardInfo, setSelectedCardInfo] = useState<LenormandCard | null>(null);
  const [interpretation, setInterpretation] = useState<string>('');
  const [loadingInterpretation, setLoadingInterpretation] = useState<boolean>(false);

  // Xác định lá kích hoạt dựa trên chủ đề và quy mô trải bài
  const getTriggerCards = (theme = selectedTheme, count = cardCount): number[] => {
    if (theme === 'Hàng Ngày' || count === 1) return [];
    if (theme === 'Tình Cảm') {
      const gender = userProfile?.gender?.toLowerCase() === 'nam' ? 'nam' : 'nữ';
      return gender === 'nam' ? [28] : [29];
    }
    if (theme === 'Công Việc') {
      return [14, 34]; // Fox or Fish
    }
    return [];
  };

  // HÀM ÚP BÀI VÀ XÀO LẠI (SHUFFLE)
  const resetReading = (theme = selectedTheme, count = cardCount) => {
    setInterpretation(''); // Xoá kết quả AI
    if (!deck || deck.length === 0) return;
    
    const newDeck = [...deck].sort(() => Math.random() - 0.5);
    setLocalDeck(newDeck);
    
    const slots = Array(count).fill(null);
    const triggerCards = getTriggerCards(theme, count);
    
    if (triggerCards.length > 0) {
       const targetTriggerId = triggerCards[Math.floor(Math.random() * triggerCards.length)];
       const triggerCard = newDeck.find(c => c.id === targetTriggerId);
       if (triggerCard) {
          slots[Math.floor(count / 2)] = triggerCard;
       }
    }
    setDisplaySlots(slots);
  };

  // XÀO BÀI LẦN ĐẦU KHI VÀO TRANG HOẶC KHI TẢI XONG BỘ BÀI
  useEffect(() => {
    if (deck && deck.length > 0 && localDeck.length === 0) {
      resetReading(selectedTheme, cardCount);
    }
  }, [deck]);

  // GỌI API KHI RÚT ĐỦ BÀI
  useEffect(() => {
    if (displaySlots.length === cardCount && displaySlots.every(c => c !== null)) {
      const fetchInterpretation = async () => {
        setLoadingInterpretation(true);
        try {
          const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
          const res = await fetch(`${baseUrl}/api/aiHandler`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              serviceType: "lenormand",
              userInputs: {
                topic: selectedTheme,
                spreadType: cardCount,
                cards: displaySlots.map(c => c!.name)
              },
              bookContext: displaySlots.map(c => `- Lá ${c!.name}: ${c!.meaning.daily}`).join('\n')
            })
          });
          const result = await res.json();
          
          if (!res.ok || !result.data) {
            throw new Error('API failed or no data returned');
          }
          
          setInterpretation(result.data);
        } catch (e) {
          const themeKey = selectedTheme === 'Tình Cảm' ? 'love' : selectedTheme === 'Công Việc' ? 'career' : 'daily';
          const fallbackText = "Tính năng phân tích chi tiết bằng AI hiện không khả dụng (Chế độ Offline/Lỗi kết nối).\n\nÝ nghĩa cơ bản của các lá bài bạn vừa bốc:\n\n" + displaySlots.map(c => `- **${c!.name}**: ${c!.meaning[themeKey]}`).join('\n\n');
          setInterpretation(fallbackText);
        } finally {
          setLoadingInterpretation(false);
        }
      };
      fetchInterpretation();
    }
  }, [displaySlots, cardCount, selectedTheme]);

  // HÀM XỬ LÝ KHI NGƯỜI DÙNG TỰ TAY BỐC BÀI TỪ XẤP BÀI ÚP
  const drawCard = (clickedCard: LenormandCard) => {
    setDisplaySlots(prev => {
      // Nếu tất cả các vị trí đã kín thì không bốc thêm
      if (prev.every(c => c !== null)) return prev;
      
      // Chống bấm 2 lần vào cùng 1 lá
      if (prev.some(c => c?.id === clickedCard.id)) return prev;

      const triggerCards = getTriggerCards();
      let finalCardToDraw = clickedCard;
      
      // Tránh vô tình bốc trúng lá chủ thể nếu nó chưa hiển thị (chỉ đề phòng, vì thực tế nó đã được rút trước)
      if (triggerCards.includes(clickedCard.id)) {
        const substitute = localDeck.find(c => !triggerCards.includes(c.id) && !prev.some(d => d?.id === c.id) && c.id !== clickedCard.id);
        if (substitute) finalCardToDraw = substitute;
      }

      // Tìm khe trống đầu tiên
      const firstEmptyIndex = prev.findIndex(c => c === null);
      if (firstEmptyIndex !== -1) {
        const newSlots = [...prev];
        newSlots[firstEmptyIndex] = finalCardToDraw;
        return newSlots;
      }
      return prev;
    });
  };

  if (loading || localDeck.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-accent animate-spin" />
        <p className="text-xl mt-4 text-white/80">Đang xào bài...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20 pt-8 w-full max-w-screen-xl mx-auto overflow-x-hidden">

      <div className="text-center space-y-4 px-4">
        <h1 className="text-4xl font-bold">Trải Bài Lenormand</h1>
        <p className="text-white/60">
          Hãy thiết lập chủ đề bên dưới và tự tay rút {cardCount} lá bài.
        </p>
      </div>

      {/* --- 1. KHU VỰC CỖ BÀI ÚP CHỜ RÚT --- */}
      <div className="relative w-full h-48 flex justify-center items-center py-4 px-2 sm:px-4">
        <div className="flex items-center justify-center">
          {localDeck.map((card, idx) => {
            const isDrawn = displaySlots.some(c => c?.id === card.id);
            if (isDrawn) return null;

            return (
              <motion.div
                key={`deck-${card.id}-${idx}`} // Đảm bảo key đổi khi xào bài để animation mượt
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => drawCard(card)}
                className={`relative w-12 h-20 sm:w-16 sm:h-24 md:w-24 md:h-36 rounded-lg bg-gradient-to-br from-primary to-blue-900 border border-white/20 shadow-[0_4px_10px_rgba(0,0,0,0.4)] flex items-center justify-center cursor-pointer hover:-translate-y-4 hover:border-accent hover:shadow-[0_0_20px_rgba(255,215,0,0.5)] transition-all shrink-0 
                ${idx !== 0 ? '-ml-8 sm:-ml-12 md:-ml-[4.5rem]' : ''}`}
                style={{ zIndex: localDeck.length - idx }}
              >
                <div className="w-8 h-12 sm:w-10 sm:h-16 md:w-16 md:h-24 border border-white/20 rounded-sm opacity-50 flex items-center justify-center">
                  <div className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-full border border-white/30" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* --- 2. KHU VỰC BÀI ĐÃ LẬT --- */}
      <div className="min-h-[350px] flex flex-col items-center gap-8 px-4">
        <div className="flex justify-center gap-4 sm:gap-8 flex-wrap w-full">
          <AnimatePresence mode="popLayout">

            {/* Hiển thị các vị trí lá bài */}
            {displaySlots.map((card, index) => {
              if (card) {
                const triggerCards = getTriggerCards();
                const isTrigger = triggerCards.includes(card.id);

                return (
                  <motion.div
                    key={`drawn-${card.id}`}
                    initial={{ opacity: 0, scale: 0.5, rotateY: 180, y: -100 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0, y: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                    className={`w-40 h-64 sm:w-48 sm:h-72 cursor-pointer group ${isTrigger ? 'z-10' : ''}`}
                    onClick={() => setSelectedCardInfo(card)}
                  >
                    <GlassCard className={`w-full h-full p-3 sm:p-4 flex flex-col items-center text-center justify-between transition-transform hover:-translate-y-2 relative ${isTrigger ? 'border-accent bg-[#1a1f35]/90 scale-105 shadow-[0_0_20px_rgba(255,215,0,0.2)]' : 'border-white/10 bg-[#1a1f35]/70 hover:border-accent/50'}`}>
                      {isTrigger && <div className="absolute -top-3 bg-accent text-background text-[10px] font-bold px-3 py-1 rounded-full uppercase">Chủ Thể</div>}
                      <div className="text-xs font-bold text-accent">Lá số {card.id}</div>
                      <div className="flex-1 w-full flex items-center justify-center my-3 bg-white/5 rounded-lg border border-white/10 overflow-hidden relative">
                        <img
                          src={`/lenormand/${card.id}.jpg`}
                          alt={card.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <h3 className="font-bold text-sm sm:text-base leading-tight mb-2">{card.name}</h3>
                      <p className="text-[10px] sm:text-xs text-white/50 italic">Nhấn xem chi tiết</p>
                    </GlassCard>
                  </motion.div>
                );
              } else {
                return (
                  <motion.div
                    key={`empty-${index}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-40 h-64 sm:w-48 sm:h-72 rounded-2xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center bg-white/5 text-white/30"
                  >
                    <div className="text-2xl mb-2 opacity-50">👆</div>
                    <span className="text-sm font-medium text-center px-2">
                      Bốc lá {index + 1}
                    </span>
                  </motion.div>
                );
              }
            })}

          </AnimatePresence>
        </div>

        {displaySlots.some(c => c !== null) && (
          <CosmicButton variant="outline" onClick={() => resetReading()}>
            <RefreshCw size={18} /> Úp bài rút lại
          </CosmicButton>
        )}
      </div>


      {/* KHU VỰC BÊN DƯỚI: ĐƯỢC GOM CHUNG VÀO 1 KHUNG ĐỂ THẲNG HÀNG */}
      <div className="w-full max-w-3xl mx-auto px-4 space-y-8 flex flex-col items-center">

        {/* --- 3. TEXT TỔNG QUAN AI --- */}
        <AnimatePresence>
          {displaySlots.length === cardCount && displaySlots.every(c => c !== null) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full p-6 rounded-2xl bg-white/5 border border-accent/20"
            >
              <div className="flex items-center gap-2 mb-3 text-accent justify-center">
                <Sparkles size={20} />
                <h3 className="font-bold text-lg">Thông điệp tổng quan: {selectedTheme}</h3>
                <Sparkles size={20} />
              </div>
              {loadingInterpretation ? (
                <div className="flex justify-center items-center py-4">
                  <Loader2 className="w-8 h-8 text-accent animate-spin" />
                  <span className="ml-3 text-white/80">Đang kết nối vũ trụ...</span>
                </div>
              ) : (
                <div className="text-left max-w-prose mx-auto">
                  <ReactMarkdown
                    components={{
                      p: ({node, ...props}) => <p className="mb-4 text-white/80 leading-relaxed" {...props} />,
                      strong: ({node, ...props}) => <strong className="text-accent font-bold" {...props} />,
                      h1: ({node, ...props}) => <h1 className="text-2xl font-bold mt-6 mb-3 text-white" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-xl font-bold mt-5 mb-2 text-white" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-lg font-bold mt-4 mb-2 text-white/90" {...props} />,
                      h4: ({node, ...props}) => <h4 className="text-base font-bold mt-3 mb-2 text-white/90" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 space-y-1 text-white/80" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4 space-y-1 text-white/80" {...props} />,
                      li: ({node, ...props}) => <li className="pl-1" {...props} />,
                    }}
                  >
                    {interpretation}
                  </ReactMarkdown>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- 4. FORM CHỌN TÙY CHỌN (ĐÃ LÀM LẠI UI) --- */}
        <div className="w-full relative">
          {/* Lớp viền glow mờ ở dưới đáy để tạo cảm giác lơ lửng */}
          <div className="absolute inset-0 bg-accent/5 blur-xl rounded-3xl -z-10"></div>

          <GlassCard className="w-full p-6 sm:p-8 bg-white/[0.02] border-white/10 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
              <Sparkles size={18} className="text-accent" />
              <h3 className="font-semibold text-white/90 tracking-wide uppercase text-sm">Bảng Điều Khiển Vũ Trụ</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white/50 uppercase tracking-wider pl-1">Chủ Đề Trải Bài</label>
                <div className="relative group">
                  <select
                    className="w-full px-4 py-3.5 rounded-xl bg-[#13172c]/80 border border-white/10 text-white/90 text-sm font-medium focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 hover:border-white/30 transition-all cursor-pointer appearance-none"
                    value={selectedTheme}
                    onChange={(e) => { 
                      setSelectedTheme(e.target.value); 
                      resetReading(e.target.value, cardCount); 
                    }}
                  >
                    <option value="Công Việc">💼 Sự Nghiệp & Công Việc</option>
                    <option value="Tình Cảm">❤️ Tình Yêu & Mối Quan Hệ</option>
                    <option value="Hàng Ngày">🌅 Năng Lượng Hằng Ngày</option>
                  </select>
                  {/* Mũi tên giả lập để che đi mũi tên mặc định xấu xí của trình duyệt */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40 group-hover:text-accent transition-colors">
                    ▼
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-white/50 uppercase tracking-wider pl-1">Quy Mô Trải Bài</label>
                <div className="relative group">
                  <select
                    className="w-full px-4 py-3.5 rounded-xl bg-[#13172c]/80 border border-white/10 text-white/90 text-sm font-medium focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 hover:border-white/30 transition-all cursor-pointer appearance-none"
                    value={cardCount}
                    onChange={(e) => { 
                      setCardCount(Number(e.target.value)); 
                      resetReading(selectedTheme, Number(e.target.value)); 
                    }}
                  >
                    <option value={5}>Trải 5 Lá (Toàn cảnh chuyên sâu)</option>
                    <option value={3}>Trải 3 Lá (Phân tích chuyên sâu)</option>
                    <option value={1}>Rút 1 Lá (Thông điệp nhanh)</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40 group-hover:text-accent transition-colors">
                    ▼
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-white/40">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                </span>
                Cuộn lên để bốc bài trực tiếp từ cỗ bài
              </span>
            </div>
          </GlassCard>
        </div>

      </div>

      {/* --- POPUP 1: HIỂN THỊ THÔNG TIN CƠ BẢN LÁ BÀI --- */}
      <Modal isOpen={!!selectedCardInfo} onClose={() => setSelectedCardInfo(null)}>
        {selectedCardInfo && (
          <div className="text-center pt-2 space-y-4">
            <div className="w-20 h-32 mx-auto bg-gradient-to-br from-primary to-blue-900 border-2 border-accent rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(255,215,0,0.3)]">
              <span className="text-4xl text-white/80">✨</span>
            </div>
            <div>
              <p className="text-accent text-sm font-bold uppercase tracking-widest">Lá số {selectedCardInfo.id}</p>
              <h2 className="text-3xl font-bold text-white">{selectedCardInfo.name}</h2>
            </div>
            <div className="bg-white/5 border border-white/10 p-5 rounded-xl text-left">
              <h3 className="font-semibold text-white/90 mb-3 border-b border-white/10 pb-2 flex items-center gap-2">
                <Sparkles size={16} className="text-accent" /> Ý nghĩa: {selectedTheme}
              </h3>
              <p className="text-white/80 text-sm leading-relaxed min-h-[100px]">
                {selectedTheme === 'Tình Cảm' && selectedCardInfo.meaning.love}
                {selectedTheme === 'Công Việc' && selectedCardInfo.meaning.career}
                {selectedTheme === 'Hàng Ngày' && selectedCardInfo.meaning.daily}
                <br /><br />
                <span className="italic text-xs text-white/40">
                  *Đây là ý nghĩa nguyên bản của lá bài. Phân tích kết hợp (AI) nằm ở phần tổng quan bên dưới.
                </span>
              </p>
            </div>
          </div>
        )}
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