import { create } from 'zustand';
import { orthoticsApi } from '../api/orthotics.queries';

export const useOrthoticStore = create((set) => ({
  designs: [],
  currentDesign: null,
  isGenerating: false,

  generate: async (params) => {
    set({ isGenerating: true });
    try {
      const result = await orthoticsApi.generate(params);
      set({ currentDesign: result.data, isGenerating: false });
      return result.data;
    } catch (error) {
      set({ isGenerating: false });
      throw error;
    }
  },

  loadDesigns: async (page = 1) => {
    const result = await orthoticsApi.listOrthotics(page);
    set({ designs: result.data });
  },

  loadDesign: async (orthoticId) => {
    const result = await orthoticsApi.getOrthotic(orthoticId);
    set({ currentDesign: result.data });
  },

  confirmDesign: async (orthoticId) => {
    await orthoticsApi.confirmOrthotic(orthoticId);
    set((state) => ({
      currentDesign: state.currentDesign
        ? { ...state.currentDesign, status: 'CONFIRMED' }
        : null,
    }));
  },
}));
