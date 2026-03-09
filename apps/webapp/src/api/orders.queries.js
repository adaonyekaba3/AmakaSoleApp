import apiClient from './apiClient';

export const ordersApi = {
  createPaymentIntent: (orthoticDesignId, shippingAddress) =>
    apiClient.post('/orders/payment-intent', { orthoticDesignId, shippingAddress }),
  listOrders: () =>
    apiClient.get('/orders'),
  getOrder: (id) =>
    apiClient.get(`/orders/${id}`),
  cancelOrder: (id) =>
    apiClient.post(`/orders/${id}/cancel`),
  createSubscription: (paymentMethodId) =>
    apiClient.post('/subscriptions', { paymentMethodId }),
};
