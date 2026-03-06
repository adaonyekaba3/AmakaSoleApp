import { create } from 'zustand';
import { ordersApi } from '../api/orders.queries';

interface CartState {
  selectedDesignId: string | null;
  shippingAddress: Record<string, string> | null;
  clientSecret: string | null;
  orderId: string | null;

  setSelectedDesign: (designId: string) => void;
  setShippingAddress: (address: Record<string, string>) => void;
  createPaymentIntent: () => Promise<void>;
  reset: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  selectedDesignId: null,
  shippingAddress: null,
  clientSecret: null,
  orderId: null,

  setSelectedDesign: (designId) => set({ selectedDesignId: designId }),

  setShippingAddress: (address) => set({ shippingAddress: address }),

  createPaymentIntent: async () => {
    const { selectedDesignId, shippingAddress } = get();
    if (!selectedDesignId || !shippingAddress) throw new Error('Missing design or address');
    const result = await ordersApi.createPaymentIntent(selectedDesignId, shippingAddress);
    set({ clientSecret: result.data.clientSecret, orderId: result.data.orderId });
  },

  reset: () => set({ selectedDesignId: null, shippingAddress: null, clientSecret: null, orderId: null }),
}));
