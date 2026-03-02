import nodemailer from 'nodemailer';
import { config } from '../config/env.js';

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.secure,
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });
  }

  async sendPortfolioEmail(lead, portfolioUrl, pdfUrl = null) {
    const mailOptions = {
      from: config.email.from,
      to: lead.email,
      subject: 'Your Portfolio is Ready! 🎉',
      html: this.getEmailTemplate(lead.name, portfolioUrl),
      attachments: pdfUrl ? [
        {
          filename: `${lead.name}-portfolio.pdf`,
          path: pdfUrl,
        },
      ] : [],
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Email sending failed:', error);
      throw new Error('Failed to send email');
    }
  }

  getEmailTemplate(name, portfolioUrl) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Your Portfolio is Ready!</h1>
          </div>
          <div class="content">
            <p>Hi <strong>${name}</strong>,</p>
            <p>Great news! Your professional portfolio is ready to view.</p>
            <p>We've carefully crafted your portfolio to showcase your skills and experience in the best possible way.</p>
            <div style="text-align: center;">
              <a href="${portfolioUrl}" class="button">View Your Portfolio</a>
            </div>
            <p>If you have any questions or need revisions, please don't hesitate to reach out.</p>
            <p>Best regards,<br><strong>${config.companyName}</strong></p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} ${config.companyName}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('Email service is ready');
      return true;
    } catch (error) {
      console.error('Email service error:', error);
      return false;
    }
  }
}

export default new MailService();
