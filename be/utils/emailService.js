const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const nodemailer = require('nodemailer');

// Khởi tạo SES Client (Sử dụng region mặc định là us-east-1 hoặc từ biến môi trường)
const sesClient = new SESClient({ region: process.env.AWS_REGION || 'us-east-1' });

/**
 * Ưu tiên 1: Gửi email thông qua AWS SES
 */
const sendViaSES = async (to, subject, text, html) => {
  const params = {
    Destination: { ToAddresses: [to] },
    Message: {
      Body: {
        Text: { Data: text },
        ...(html && { Html: { Data: html } }), // Nếu có HTML thì đính kèm
      },
      Subject: { Data: subject },
    },
    Source: process.env.SES_SENDER_EMAIL,
  };
  
  const command = new SendEmailCommand(params);
  return await sesClient.send(command);
};

/**
 * Ưu tiên 2 (Fallback): Gửi email thông qua Nodemailer (Gmail SMTP)
 */
const sendViaNodemailer = async (to, subject, text, html) => {
  // Cấu hình transporter với Gmail
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER, // Phải khớp với email chứng thực
    to: to,
    subject: subject,
    text: text,
    html: html,
  };

  return await transporter.sendMail(mailOptions);
};

/**
 * Hàm chính để gửi email, tích hợp cơ chế Fallback đa lớp
 * @param {Object} options - Chứa { to, subject, text, html }
 * @returns {Object} - Kết quả: { success, provider, messageId, error }
 */
const sendEmail = async ({ to, subject, text, html }) => {
  try {
    // Thử gửi bằng SES trước
    console.log(`[EmailService] Bắt đầu gửi email tới ${to} qua AWS SES...`);
    const sesResponse = await sendViaSES(to, subject, text, html);
    
    console.log(`[EmailService] SES Gửi thành công! MessageId: ${sesResponse.MessageId}`);
    return {
      success: true,
      provider: 'SES',
      messageId: sesResponse.MessageId,
      error: null
    };

  } catch (sesError) {
    // SES thất bại (có thể do Sandbox, chưa verify email, IAM Role...)
    console.warn(`[EmailService] CẢNH BÁO: SES gửi thất bại: ${sesError.message}`);
    console.warn(`[EmailService] -> Chuyển sang Fallback dùng Nodemailer (Gmail)...`);
    
    try {
      // Fallback bằng Nodemailer
      const nodemailerResponse = await sendViaNodemailer(to, subject, text, html);
      
      console.log(`[EmailService] Nodemailer Gửi thành công! MessageId: ${nodemailerResponse.messageId}`);
      return {
        success: true,
        provider: 'Nodemailer',
        messageId: nodemailerResponse.messageId,
        error: null
      };
      
    } catch (nodemailerError) {
      // Cả 2 đều thất bại, bắt buộc phải trả về lỗi để hệ thống/controller biết
      console.error(`[EmailService] LỖI NGHIÊM TRỌNG: Cả SES và Nodemailer đều thất bại.`);
      console.error(`SES Error: ${sesError.message}`);
      console.error(`Nodemailer Error: ${nodemailerError.message}`);
      
      return {
        success: false,
        provider: 'None',
        messageId: null,
        error: nodemailerError.message
      };
    }
  }
};

module.exports = {
  sendEmail,
  sendViaSES,
  sendViaNodemailer
};
