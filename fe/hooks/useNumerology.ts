import { useState, useEffect } from 'react';
import { NumerologyReading } from '../types';

export function useNumerology(name: string, dob: string) {
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
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        const response = await fetch(`${baseUrl}/api/numerology`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, dob }),
        });

        if (!response.ok) {
          throw new Error(`Lỗi Server: ${response.status}`);
        }

        // Ép kiểu dữ liệu trả về theo đúng Interface NumerologyReading của em
        const result: NumerologyReading = await response.json();
        setData(result);

      } catch (err: any) {
        console.error("Lỗi khi gọi API Thần số học:", err);
        setError(err.message || "Lỗi kết nối đến máy chủ vũ trụ");
      } finally {
        setLoading(false);
      }
    };

    fetchNumerologyData();

  }, [name, dob]);

  const sendEmail = async (emailAddress: string) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const response = await fetch(`${baseUrl}/api/numerology`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, dob, email: emailAddress }),
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