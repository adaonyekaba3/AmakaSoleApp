// Expo push notification service
const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

interface PushMessage {
  to: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

export const notificationService = {
  async sendPushNotification(message: PushMessage) {
    try {
      const res = await fetch(EXPO_PUSH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message),
      });
      return res.json();
    } catch (error) {
      console.error('Push notification failed:', error);
    }
  },

  async sendScanCompleteNotification(pushToken: string, scanId: string) {
    return this.sendPushNotification({
      to: pushToken,
      title: 'Scan Complete!',
      body: 'Your foot scan has been processed. Tap to view results.',
      data: { type: 'SCAN_COMPLETE', scanId },
    });
  },

  async sendOrderShippedNotification(pushToken: string, orderId: string) {
    return this.sendPushNotification({
      to: pushToken,
      title: 'Order Shipped!',
      body: 'Your custom orthotics are on the way.',
      data: { type: 'ORDER_SHIPPED', orderId },
    });
  },
};
