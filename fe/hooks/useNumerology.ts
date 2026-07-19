import { useState, useEffect } from 'react';
import { NumerologyReading } from '../types';

export function useNumerology(name: string, dob: string, initialEmail?: string) {
  const [data, setData] = useState<NumerologyReading | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Không gọi API nếu thiếu data đầu vào
    if (!name || !dob) {
      setLoading(false);
      return;
    }

    const fetchNumerologyData = async () => {
      setLoading(true);
      setError(null);

      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
        
        // 1. Fetch các chỉ số tính toán và biểu đồ từ Backend (DynamoDB)
        const response = await fetch(`${baseUrl}/api/numerology`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, dob }),
        });

        if (!response.ok) {
          throw new Error(`Lỗi Server: ${response.status}`);
        }
        // Ép kiểu dữ liệu trả về theo đúng Interface NumerologyReading của em
        const result = await response.json();
        
        // Cập nhật giao diện NGAY LẬP TỨC để người dùng không phải chờ lâu
        setData(result);
        setLoading(false); // Tắt màn hình loading ngay khi có dữ liệu cơ bản

        // 2. Gọi thêm API AI Handler ngầm (Non-blocking) để lấy bài phân tích siêu chi tiết chuẩn Gen-Z
        fetch(`${baseUrl}/api/aiHandler`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            serviceType: "numerology",
            userInputs: result.calculatedNumbers,
            bookContext: "Hãy phân tích cực kỳ chuyên sâu, dễ hiểu và dài theo văn phong Gen Z. Đặc biệt tập trung vào Life Path, Personal Year và Destiny.",
            email: initialEmail // Sẽ tự động gửi mail nếu user có nhập email ở trang chủ
          })
        })
        .then(aiRes => aiRes.json())
        .then(aiData => {
          if (aiData.data) {
            // Cập nhật lại state với bài phân tích của AI một cách mượt mà
            setData((prevData: any) => {
              if (!prevData) return prevData;
              return {
                ...prevData,
                readings: {
                  ...prevData.readings,
                  overview: aiData.data
                }
              };
            });
          }
        })
        .catch(aiErr => {
          console.error("Lỗi khi gọi AI Handler:", aiErr);
        });

      } catch (err: any) {
        console.error("Lỗi khi gọi API Thần số học:", err);
        setError(err.message || "Lỗi kết nối đến máy chủ vũ trụ");
        setLoading(false);
      }
    };

    fetchNumerologyData();

  }, [name, dob]);

  const sendEmail = async (emailAddress: string) => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
        // Để gửi lại email có kèm bài luận AI, ta gọi lại aiHandler
        // (Sẽ tốn thêm 1 lượt generate AI, nhưng đảm bảo email đầy đủ nội dung)
        const response = await fetch(`${baseUrl}/api/aiHandler`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            serviceType: "numerology",
            userInputs: data?.calculatedNumbers, 
            bookContext: "Hãy phân tích cực kỳ chuyên sâu, dễ hiểu và dài theo văn phong Gen Z.",
            email: emailAddress 
          }),
        });
        if (!response.ok) throw new Error("Lỗi Server khi gửi email");
        return true;
      } catch (err) {
        console.error("Lỗi khi gửi email:", err);
        return false;
      }
    };
  
    return { data, loading, error, sendEmail };
  }