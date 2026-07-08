import { LenormandCard, NumerologyReading } from '../types';

export const mockNumerologyReading: NumerologyReading = {
  calculatedNumbers: {
    lifePath: 8,
    soul: 8,
    personality: 6,
    destiny: 5,
    balance: 8,
    attitude: 2,
    naturalAbility: 5,
    approachMotivation: 8,
    approachAbility: 7,
    karmicDebt: 0,
    outerPersonality: 6,
    maturity: 4,
    personalMonth: 9
  },
  birthChart: { 1: 1, 2: 0, 3: 0, 4: 1, 5: 1, 6: 0, 7: 1, 8: 0, 9: 1 },
  nameChart: { 1: 2, 2: 0, 3: 1, 4: 1, 5: 2, 6: 0, 7: 1, 8: 0, 9: 1 },
  pinnacles: [
    { age: 29, year: 2029, value: 5 },
    { age: 38, year: 2038, value: 7 },
    { age: 47, year: 2047, value: 3 },
    { age: 56, year: 2056, value: 9 }
  ],
  yearlyCycle: [
    { year: 2023, value: 9 },
    { year: 2024, value: 1 },
    { year: 2025, value: 2 },
    { year: 2026, value: 3 },
    { year: 2027, value: 4 },
    { year: 2028, value: 5 },
    { year: 2029, value: 6 },
    { year: 2030, value: 7 },
    { year: 2031, value: 8 },
    { year: 2032, value: 9 },
    { year: 2033, value: 1 }
  ],
  aiReading: {
    overview: "Bạn là một người có khả năng lãnh đạo, tư duy logic...",
    pinnacles: "Giai đoạn 29 tuổi (năm 2029) mang năng lượng số 5, báo hiệu sự thay đổi...",
    charts: "Biểu đồ ngày sinh thiếu mũi tên hành động nhưng bù lại có mũi tên quyết tâm...",
    yearly: "Năm 2026 mang năng lượng số 3, là lúc thích hợp để tỏa sáng..."
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

const lenormandNames = [
  "Người Đưa Thư (Rider)", "Cỏ Ba Lá (Clover)", "Con Tàu (Ship)", "Ngôi Nhà (House)", 
  "Cái Cây (Tree)", "Đám Mây (Clouds)", "Con Rắn (Snake)", "Cỗ Quan Tài (Coffin)", 
  "Bó Hoa (Bouquet)", "Cái Lưỡi Hái (Scythe)", "Cái Roi/Chổi (Whip)", "Con Chim (Birds)",
  "Đứa Trẻ (Child)", "Con Cáo (Fox)", "Con Gấu (Bear)", "Ngôi Sao (Stars)",
  "Con Cò (Stork)", "Con Chó (Dog)", "Ngọn Tháp (Tower)", "Khu Vườn (Garden)",
  "Ngọn Núi (Mountain)", "Ngã Ba Đường (Crossroads)", "Con Chuột (Mice)", "Trái Tim (Heart)",
  "Chiếc Nhẫn (Ring)", "Cuốn Sách (Book)", "Bức Thư (Letter)", "Người Đàn Ông (Man)",
  "Người Phụ Nữ (Woman)", "Hoa Ly (Lily)", "Mặt Trời (Sun)", "Mặt Trăng (Moon)",
  "Chìa Khóa (Key)", "Con Cá (Fish)", "Mỏ Neo (Anchor)", "Cây Thánh Giá (Cross)"
];

mockLenormandDeck.forEach((card, index) => {
  if (lenormandNames[index]) {
    card.name = lenormandNames[index];
  }
});
