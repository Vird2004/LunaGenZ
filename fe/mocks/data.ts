import { LenormandCard, NumerologyReading } from '../types';

export const mockNumerologyReading: NumerologyReading = {
  lifePathNumber: 7,
  missionNumber: 9,
  soulNumber: 11,
  personalYear: 5,
  explanations: {
    lifePath: "Đường đời 7: Nhà thông thái, luôn tìm kiếm chân lý và sự sâu sắc.",
    mission: "Sứ mệnh 9: Người mang tình yêu thương và sự giúp đỡ đến cho nhân loại.",
    soul: "Linh hồn 11: Có trực giác nhạy bén, khả năng thấu hiểu tâm linh sâu sắc.",
    personalYear: "Năm cá nhân 5: Năm của sự thay đổi, tự do và những trải nghiệm mới mẻ."
  }
};

export const mockLenormandDeck: LenormandCard[] = Array.from({ length: 36 }, (_, i) => ({
  id: i + 1,
  name: `Lá bài số ${i + 1}`,
  meaning: {
    love: `Ý nghĩa tình yêu cho lá số ${i + 1}. Sự kết nối tâm giao và những chuyển biến tích cực trong tình cảm.`,
    career: `Ý nghĩa công việc cho lá số ${i + 1}. Cơ hội mới đang mở ra, cần nắm bắt thời cơ và hành động quyết đoán.`,
    daily: `Ý nghĩa hàng ngày cho lá số ${i + 1}. Một ngày bình yên, hãy dành thời gian chăm sóc bản thân.`
  }
}));

// Provide some specific names for the first few cards to make it realistic
const lenormandNames = [
  "Người Đưa Thư (Rider)", "Cỏ Ba Lá (Clover)", "Con Tàu (Ship)", "Ngôi Nhà (House)", 
  "Cái Cây (Tree)", "Đám Mây (Clouds)", "Con Rắn (Snake)", "Cỗ Quan Tài (Coffin)", 
  "Bó Hoa (Bouquet)", "Cái Lưỡi Hái (Scythe)"
];

mockLenormandDeck.forEach((card, index) => {
  if (lenormandNames[index]) {
    card.name = lenormandNames[index];
  }
});
