import sgMail from '@sendgrid/mail';

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@amakasole.com';

export const emailService = {
  async sendOrderConfirmation(to: string, orderId: string, amount: number) {
    await sgMail.send({
      to,
      from: FROM_EMAIL,
      subject: 'AmakaSole - Order Confirmed',
      html: `<h2>Order Confirmed!</h2><p>Your order <strong>${orderId}</strong> for $${(amount / 100).toFixed(2)} has been confirmed. We'll notify you when it ships.</p>`,
    });
  },

  async sendScanComplete(to: string, scanId: string) {
    await sgMail.send({
      to,
      from: FROM_EMAIL,
      subject: 'AmakaSole - Scan Complete',
      html: `<h2>Your Foot Scan is Ready!</h2><p>Scan <strong>${scanId}</strong> has been processed. Open the app to view your results and generate custom orthotics.</p>`,
    });
  },

  async sendShippingUpdate(to: string, orderId: string, trackingNumber: string, carrier: string) {
    await sgMail.send({
      to,
      from: FROM_EMAIL,
      subject: 'AmakaSole - Order Shipped',
      html: `<h2>Your Order Has Shipped!</h2><p>Order <strong>${orderId}</strong> is on its way. Tracking: ${carrier} ${trackingNumber}</p>`,
    });
  },
};
