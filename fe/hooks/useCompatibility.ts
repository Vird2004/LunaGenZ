import { useState, useEffect } from 'react';

export function useCompatibility(user1: { name: string; dob: string } | null, user2: { name: string; dob: string } | null) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user1 || !user2) return;

    let isMounted = true;
    const fetchCompatibility = async () => {
      try {
        setLoading(true);
        setError(null);
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

        // 1. Fetch numerology stats for both users concurrently
        const [res1, res2] = await Promise.all([
          fetch(`${baseUrl}/api/numerology`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user1),
          }),
          fetch(`${baseUrl}/api/numerology`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user2),
          })
        ]);

        if (!res1.ok || !res2.ok) {
          throw new Error('Failed to calculate numerology numbers.');
        }

        const data1 = await res1.json();
        const data2 = await res2.json();

        const person1Metrics = data1?.calculatedNumbers || {};
        const person2Metrics = data2?.calculatedNumbers || {};

        // 2. Fetch AI compatibility reading
        let interpretation = "Chế độ Offline/Lỗi kết nối. Không thể kết nối với Vũ Trụ để phân tích chi tiết.";
        let percentage = "0%";
        try {
          const aiRes = await fetch(`${baseUrl}/api/aiHandler`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              serviceType: 'compatibility',
              userInputs: {
                person1: person1Metrics,
                person2: person2Metrics
              }
            }),
          });

          if (!aiRes.ok) {
            throw new Error('Failed to get universe connection. Gemini API might be overloaded.');
          }

          const aiData = await aiRes.json();
          interpretation = aiData.data || "Không có thông điệp từ vũ trụ.";
          
          // 3. Extract percentage
          const match = interpretation.match(/Phần trăm tương hợp dự kiến:\s*(\d+)%/i);
          if (match) {
            percentage = `${match[1]}%`;
          } else {
            // Fallback if AI didn't follow the exact format
            const fallbackMatch = interpretation.match(/(\d+)%/);
            if (fallbackMatch) percentage = `${fallbackMatch[1]}%`;
          }
        } catch (aiErr) {
          console.warn("AI Fallback:", aiErr);
          const scd1 = person1Metrics.lifePath || "X";
          const scd2 = person2Metrics.lifePath || "Y";
          interpretation = `Tính năng phân tích chi tiết độ tương hợp cần kết nối AI để hoạt động. Hiện tại bạn đang ở chế độ Offline hoặc máy chủ AI bị giới hạn.\n\nTuy nhiên, dựa vào số liệu cơ bản, số Chủ Đạo của bạn là **${scd1}** và của người ấy là **${scd2}**. Hãy tìm hiểu thêm về sự kết hợp giữa 2 con số này để biết mức độ hòa hợp nhé!`;
          percentage = "?%";
        }

        if (isMounted) {
          setData({
            person1: data1,
            person2: data2,
            reading: interpretation,
            percentage
          });
          setLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          console.error(err);
          setError(err.message || 'Lỗi chưa xác định');
          setLoading(false);
        }
      }
    };

    fetchCompatibility();

    return () => {
      isMounted = false;
    };
  }, [user1, user2]);

  return { data, loading, error };
}
