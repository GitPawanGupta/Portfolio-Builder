import twilio from 'twilio';
import axios from 'axios';
import { config } from '../config/env.js';

class WhatsAppService {
  constructor() {
    this.provider = config.whatsapp.provider;
    
    // Only initialize Twilio if credentials are provided
    if (this.provider === 'twilio' && config.whatsapp.twilio.accountSid && config.whatsapp.twilio.authToken) {
      this.twilioClient = twilio(
        config.whatsapp.twilio.accountSid,
        config.whatsapp.twilio.authToken
      );
    } else {
      console.warn('WhatsApp service not configured. Email will be used as fallback.');
      this.twilioClient = null;
    }
  }

  async sendPortfolioMessage(lead, portfolioUrl) {
    const message = this.getMessageTemplate(lead.name, portfolioUrl);

    try {
      if (!this.twilioClient && this.provider === 'twilio') {
        throw new Error('WhatsApp service not configured. Please set up Twilio credentials.');
      }

      if (this.provider === 'twilio') {
        return await this.sendViaTwilio(lead.phone, message);
      } else if (this.provider === 'meta') {
        return await this.sendViaMeta(lead.phone, message);
      } else {
        throw new Error('Invalid WhatsApp provider');
      }
    } catch (error) {
      console.error('WhatsApp sending failed:', error);
      throw new Error('Failed to send WhatsApp message: ' + error.message);
    }
  }

  async sendViaTwilio(to, message) {
    const result = await this.twilioClient.messages.create({
      from: config.whatsapp.twilio.from,
      to: `whatsapp:${to}`,
      body: message,
    });

    return { success: true, messageId: result.sid };
  }

  async sendViaMeta(to, message) {
    const url = `https://graph.facebook.com/v18.0/${config.whatsapp.meta.phoneNumberId}/messages`;
    
    const response = await axios.post(
      url,
      {
        messaging_product: 'whatsapp',
        to: to,
        type: 'text',
        text: { body: message },
      },
      {
        headers: {
          'Authorization': `Bearer ${config.whatsapp.meta.accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return { success: true, messageId: response.data.messages[0].id };
  }

  getMessageTemplate(name, portfolioUrl) {
    return `Hi ${name}! 🎉

Your professional portfolio is ready to view! ✅

View your portfolio here:
${portfolioUrl}

If you have any questions or need revisions, feel free to reach out.

Best regards,
${config.companyName}`;
  }
}

export default new WhatsAppService();
