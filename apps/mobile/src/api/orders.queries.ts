import { apiClient } from './apiClient';

export const ordersApi = {
  createPaymentIntent: (orthoticDesignId: string, shippingAddress: Record<string, string>) =>
    apiClient.post('/orders/create-payment-intent', { orthoticDesignId, shippingAddress }).then(r => r.data),

  createSubscription: (paymentMethodId: string) =>
    apiClient.post('/orders/create-subscription', { paymentMethodId }).then(r => r.data),

  listOrders: (page = 1, limit = 20) =>
    apiClient.get('/orders', { params: { page, limit } }).then(r => r.data),

  getOrder: (orderId: string) =>
    apiClient.get(`/orders/${orderId}`).then(r => r.data),

  cancelOrder: (orderId: string) =>
    apiClient.post(`/orders/${orderId}/cancel`).then(r => r.data),
};
