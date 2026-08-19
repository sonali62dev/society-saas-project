const sendEmail = async ({ to, name = '', subject, htmlContent }) => {
  const brevoApiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || 'info@kiaantechnology.com';
  const senderName = process.env.BREVO_SENDER_NAME || 'Kiaan Technology Pvt Ltd';

  if (brevoApiKey) {
    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': brevoApiKey.trim(),
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          sender: {
            name: senderName.trim(),
            email: senderEmail.trim()
          },
          to: [
            { email: to.trim(), name: (name || to).trim() }
          ],
          subject: subject,
          htmlContent: htmlContent
        })
      });

      const resData = await response.json();
      if (response.ok) {
        console.log(`[Brevo Email Sent] Successfully sent email to ${to}. MessageId:`, resData.messageId);
        return { success: true, messageId: resData.messageId };
      } else {
        console.error(`[Brevo Email Error] Failed to send email to ${to}:`, resData);
      }
    } catch (err) {
      console.error('[Brevo Email Exception]:', err.message);
    }
  }

  // Fallback to Nodemailer if SMTP config exists
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  if (smtpUser && smtpPass) {
    try {
      const nodemailer = require('nodemailer');
      const smtpHost = process.env.SMTP_HOST || 'smtp-relay.brevo.com';
      const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);

      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: { user: smtpUser, pass: smtpPass }
      });

      const info = await transporter.sendMail({
        from: `"${senderName}" <${smtpUser}>`,
        to: to,
        subject: subject,
        html: htmlContent
      });

      console.log(`[Nodemailer Email Sent] to ${to}. MessageId:`, info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (err) {
      console.error('[Nodemailer Email Error]:', err.message);
    }
  }

  console.warn('[Email Warning] No email service configured or email sending failed.');
  return { success: false };
};

module.exports = sendEmail;
