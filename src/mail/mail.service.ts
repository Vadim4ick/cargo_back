import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendInvitation(email: string, inviteLink: string): Promise<void> {
    const mailOptions = {
      from: process.env.MAIL_FROM || 'noreply@example.com',
      to: email,
      subject: 'Приглашение на регистрацию',
      text: `Вас приглашают зарегистрироваться. Перейдите по ссылке: ${inviteLink}`,
      html: `<p>Вас приглашают зарегистрироваться.</p><p><a href="${inviteLink}">Нажмите здесь</a>, чтобы пройти регистрацию.</p>`,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      Logger.log(`Письмо отправлено: ${info.response}`);
    } catch (error) {
      Logger.error('Ошибка при отправке письма', error);
      throw error;
    }
  }
}
