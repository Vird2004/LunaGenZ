import { create } from 'zustand';
import { UserProfile } from '../types';

interface CosmicState {
  userProfile: UserProfile | null;
  partnerProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile) => void;
  setPartnerProfile: (profile: UserProfile) => void;
  clearUserProfile: () => void;
}

export const useCosmicStore = create<CosmicState>((set) => ({
  userProfile: null,
  partnerProfile: null,
  setUserProfile: (profile) => set({ userProfile: profile }),
  setPartnerProfile: (profile) => set({ partnerProfile: profile }),
  clearUserProfile: () => set({ userProfile: null, partnerProfile: null }),
}));
