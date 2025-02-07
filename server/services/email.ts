
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendConsultationEmail(to: string, name: string) {
  const message = {
    from: process.env.SMTP_FROM,
    to,
    subject: 'Book Your Consultation Session',
    text: `Hello ${name},\n\nThank you for your interest in our consultation service. To schedule your session, please click the following link:\n\n[Your booking link will be here]\n\nBest regards,\nThe Team`,
    html: `
      <h2>Hello ${name},</h2>
      <p>Thank you for your interest in our consultation service.</p>
      <p>To schedule your session, please click the following link:</p>
      <p><a href="[Your booking link will be here]">Schedule Your Session</a></p>
      <p>Best regards,<br>The Team</p>
    `,
  };

  return transporter.sendMail(message);
}
