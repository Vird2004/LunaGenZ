import { useState, useEffect } from 'react';
import { LenormandCard } from '../types';
import { mockLenormandDeck } from '../mocks/data';

export function useLenormand() {
  const [deck, setDeck] = useState<LenormandCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Simulate backend shuffling and processing
      setDeck([...mockLenormandDeck].sort(() => Math.random() - 0.5));
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return { deck, loading };
}
