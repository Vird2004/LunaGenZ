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
        const response = await fetch('http://localhost:8080/api/numerology', {
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

  return { data, loading, error };
}