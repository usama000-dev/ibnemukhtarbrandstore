import { EmailService } from '@/services/emailService';

const ADMIN_EMAILS = [
  'musama4288921@gmail.com',
  'alirazaicon@gmail.com',
  'noorulhassanofficialll@gmail.com',
  'championhub00@gmail.com',
];

/**
 * Send a stock alert email to all admins
 * @param {Array<{name: string, size?: string, stock: number|string}>} lowStockProducts
 */
export default async function sendStockAlertEmail(lowStockProducts) {
  if (!lowStockProducts || lowStockProducts.length === 0) return;

  const subject = 'Short Stock Alert: Products below 10 in stock';

  // The input structure seems to be handled a bit loosely in the calling function, 
  // sometimes passing an array of objects with name and stock.
  // We can just trust the caller passes a meaningful string or array.
  // In the route.js it calls: await sendStockAlertEmail([{ name: 'Short Stock Alert', stock: message }]);
  // So we handle that.

  const productLines = lowStockProducts.map(
    (p, i) => `${p.name}${p.size ? ` (Size: ${p.size})` : ''} - ${p.stock}`
  ).join('\n');

  const text = `Dear Admin,\n\nThe following products are low in stock (below 10):\n\n${productLines}\n\nPlease restock soon!\n\nThis is an automated alert from your Champion Choice system.`;

  // Simple HTML version
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Short Stock Alert</h2>
      <p>Dear Admin,</p>
      <p>The following items are low in stock:</p>
      <pre style="background: #f4f4f4; padding: 10px; border-radius: 5px;">${productLines}</pre>
      <p>Please restock soon!</p>
    </div>
  `;

  for (const email of ADMIN_EMAILS) {
    try {
      await EmailService.sendEmail(email, subject, html, text);
    } catch (error) {
      console.error(`Failed to send stock alert to ${email}:`, error);
    }
  }
} 