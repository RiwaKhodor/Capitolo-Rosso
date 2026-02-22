import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  // Enable CORS
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, subject, message } = request.body;

  if (!name || !email || !message) {
    return response.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Create transporter using SMTP
    // Environment variables must be set in Vercel Dashboard:
    // SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
      console.error('Missing SMTP environment variables');
      return response.status(500).json({ 
        error: 'Email service not configured. Please set SMTP environment variables.',
      });
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort),
      secure: parseInt(smtpPort) === 465, // true for 465 (SSL), false for 587 (TLS)
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // Email content
    const emailSubject = subject && subject.trim() ? subject : 'No Subject';
    const mailOptions = {
      from: `"${name}" <Info@capitolo-rosso.de>`,
      to: 'Info@capitolo-rosso.de',
      replyTo: email,
      subject: `Contact Form: ${emailSubject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
        ${subject && subject.trim() ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
      text: `
        New Contact Form Submission
        
        Name: ${name}
        Email: ${email}
        ${phone ? `Phone: ${phone}` : ''}
        ${subject && subject.trim() ? `Subject: ${subject}` : ''}
        
        Message:
        ${message}
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return response.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return response.status(500).json({ 
      error: 'Failed to send email',
      details: error.message 
    });
  }
}
