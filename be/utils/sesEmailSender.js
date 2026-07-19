const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

// Create SES client
const sesClient = new SESClient({ region: process.env.AWS_REGION || "us-east-1" });

/**
 * Tạo giao diện HTML cho email
 */
const generateEmailTemplate = (numerologyData, aiText) => {
  // Loại bỏ các cú pháp Markdown cơ bản từ aiText để email trông sạch hơn nếu cần, 
  // nhưng ở đây ta bọc trong thẻ pre hoặc giữ nguyên định dạng.
  // Xử lý markdown đơn giản sang HTML:
  const formattedAiText = aiText
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>');

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body {
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        background-color: #0f1225;
        color: #ffffff;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        background: linear-gradient(145deg, #1a1f35 0%, #0f1225 100%);
        padding: 40px 30px;
        border-radius: 12px;
        border: 1px solid #2d1b4e;
      }
      .header {
        text-align: center;
        padding-bottom: 30px;
        border-bottom: 1px solid rgba(255,255,255,0.1);
      }
      .header h1 {
        color: #ffd700;
        margin: 0;
        font-size: 28px;
        text-transform: uppercase;
        letter-spacing: 2px;
      }
      .header p {
        color: #c084fc;
        margin-top: 10px;
        font-size: 14px;
        letter-spacing: 1px;
      }
      .content {
        padding: 30px 0;
      }
      .stats-grid {
        display: flex;
        justify-content: space-between;
        margin-bottom: 40px;
        flex-wrap: wrap;
      }
      .stat-box {
        background-color: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 20px;
        text-align: center;
        width: 30%;
        box-sizing: border-box;
      }
      .stat-title {
        font-size: 12px;
        color: #a78bfa;
        text-transform: uppercase;
        margin-bottom: 10px;
        font-weight: bold;
      }
      .stat-value {
        font-size: 32px;
        color: #ffd700;
        font-weight: 900;
      }
      .ai-reading {
        background-color: rgba(236, 72, 153, 0.05);
        border-left: 4px solid #ec4899;
        padding: 20px;
        border-radius: 4px;
        line-height: 1.6;
        color: #e2e8f0;
      }
      .footer {
        text-align: center;
        padding-top: 30px;
        border-top: 1px solid rgba(255,255,255,0.1);
        color: #64748b;
        font-size: 12px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>LunaGenZ</h1>
        <p>BẢN MẬT MÃ VŨ TRỤ CỦA BẠN</p>
      </div>
      
      <div class="content">
        <p style="font-size: 16px; margin-bottom: 30px;">Chào bạn,</p>
        <p style="font-size: 16px; margin-bottom: 30px;">Vũ trụ đã hồi đáp tín hiệu của bạn. Dưới đây là những chỉ số quan trọng nhất trong bản đồ Thần số học của bạn:</p>
        
        <div class="stats-grid">
          <div class="stat-box">
            <div class="stat-title">Số Chủ Đạo</div>
            <div class="stat-value">${numerologyData.lifePath || '?'}</div>
          </div>
          <div class="stat-box">
            <div class="stat-title">Số Tâm Hồn</div>
            <div class="stat-value" style="color: #60a5fa;">${numerologyData.soul || '?'}</div>
          </div>
          <div class="stat-box">
            <div class="stat-title">Số Sứ Mệnh</div>
            <div class="stat-value" style="color: #ec4899;">${numerologyData.destiny || '?'}</div>
          </div>
        </div>

        <h3 style="color: #ec4899; text-transform: uppercase; letter-spacing: 1px;">🔮 Thông điệp từ Vũ Trụ</h3>
        <div class="ai-reading">
          ${formattedAiText}
        </div>
      </div>
      
      <div class="footer">
        <p>Gửi từ hệ thống tự động của LunaGenZ.</p>
        <p>© 2026 LunaGenZ. Chúc bạn một ngày tràn đầy năng lượng tích cực.</p>
      </div>
    </div>
  </body>
  </html>
  `;
};

/**
 * Hàm gửi email
 */
const sendResultEmail = async (userEmail, numerologyData, aiText) => {
  const fromEmail = process.env.SES_FROM_EMAIL || "admin@lunagenz.sbs";
  
  const htmlBody = generateEmailTemplate(numerologyData, aiText);

  const command = new SendEmailCommand({
    Source: fromEmail,
    Destination: {
      ToAddresses: [userEmail],
    },
    Message: {
      Subject: {
        Data: "🔮 LunaGenZ - Kết Quả Giải Mã Thần Số Học Của Bạn",
        Charset: "UTF-8",
      },
      Body: {
        Html: {
          Data: htmlBody,
          Charset: "UTF-8",
        }
      },
    },
  });

  try {
    const result = await sesClient.send(command);
    console.log("Email sent successfully. MessageId:", result.MessageId);
    return result;
  } catch (error) {
    console.error("Error sending SES email:", error);
    throw error;
  }
};

module.exports = { sendResultEmail };
