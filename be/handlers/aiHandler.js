/**
 * Bổ sung module gửi email
 */
const { sendResultEmail } = require('../utils/sesEmailSender');

/**
 * Hàm tạo prompt dựa trên serviceType
 */
const generatePrompt = (payload) => {
  const { serviceType, userInputs, bookContext } = payload;
  let systemPrompt = "";
  let userPrompt = "";

  if (serviceType === "numerology") {
    systemPrompt = `Bạn là một chuyên gia Thần số học (Numerology expert) với phong cách nói chuyện thân thiện, trẻ trung, logic và đậm chất Gen-Z.
Nhiệm vụ của bạn là đưa ra bài phân tích sâu sắc, có tính ứng dụng cao dựa trên các chỉ số của người dùng.
ĐẶC BIỆT YÊU CẦU BẮT BUỘC: 
- Trước khi phân tích, HÃY CÓ MỘT ĐOẠN giải thích ngắn gọn bản chất/ý nghĩa của từng loại chỉ số (VD: Số Chủ Đạo mang ý nghĩa gì trong cuộc đời, Số Tâm Hồn đại diện cho điều gì...).
- Sau đó, phân tích cực kì chi tiết Số Chủ Đạo của người dùng (bao gồm: Điểm mạnh, điểm yếu, TƯ VẤN CÔNG VIỆC, TƯ VẤN TÌNH CẢM).
- Tiếp theo giải mã các chỉ số còn lại (Linh hồn, Tính cách...) và Đỉnh cao cuộc đời.
Hãy trình bày rõ ràng, sử dụng markdown để dễ đọc.`;

    userPrompt = `Kiến thức nền tảng (bookContext) để bạn tham khảo:
"""
${bookContext || "Không có dữ liệu nền tảng."}
"""

Các chỉ số cá nhân (userInputs):
"""
${JSON.stringify(userInputs, null, 2)}
"""

Dựa vào kiến thức nền tảng trên, hãy phân tích chuyên sâu các chỉ số của tôi.`;

  } else if (serviceType === "lenormand") {
    systemPrompt = `Bạn là một Reader Lenormand chuyên nghiệp, trực giác nhạy bén nhưng giải bài rất logic và thực tế.
Nhiệm vụ của bạn là giải nghĩa sự kết hợp của các lá bài dựa trên nền tảng ý nghĩa gốc, đưa ra lời khuyên rõ ràng và dễ hiểu.
Hãy trình bày rõ ràng, sử dụng markdown để dễ đọc.`;

    userPrompt = `Kiến thức nền tảng (bookContext) về các lá bài:
"""
${bookContext || "Không có dữ liệu nền tảng."}
"""

Trải bài của tôi (userInputs):
"""
${JSON.stringify(userInputs, null, 2)}
"""

Hãy giải nghĩa trải bài này dựa trên kiến thức nền tảng được cung cấp.`;

  } else if (serviceType === "compatibility") {
    systemPrompt = `Bạn là một chuyên gia Thần số học chuyên tư vấn tình cảm (Numerology Love Expert).
Bạn sẽ nhận được 2 bộ chỉ số Thần số học của 2 người.
Nhiệm vụ của bạn là:
1. Đưa ra một Điểm tương hợp tổng quan (Ví dụ: "Mức độ hòa hợp: 85%").
2. Phân tích sự tương tác giữa 2 Số Chủ Đạo (Điểm mạnh, điểm yếu khi ở bên nhau).
3. Phân tích sự kết nối qua Số Tâm Hồn và Số Biểu Đạt (Tính cách).
4. Đưa ra lời khuyên chân thành để mối quan hệ phát triển tốt hơn.
Trình bày rõ ràng, thân thiện bằng markdown.`;

    userPrompt = `Dữ liệu của Người 1 (Bạn):
${JSON.stringify(userInputs.person1, null, 2)}

Dữ liệu của Người 2 (Người Ấy):
${JSON.stringify(userInputs.person2, null, 2)}

Hãy so sánh độ tương hợp của 2 người này. TRONG CÂU ĐẦU TIÊN CỦA BÀI, bắt buộc phải có format: "Phần trăm tương hợp dự kiến: [Số]%". Sau đó mới trình bày các phân tích chi tiết.`;

  } else {
    throw new Error("Invalid serviceType. Must be 'numerology', 'lenormand', or 'compatibility'.");
  }

  return { systemPrompt, userPrompt };
};

/**
 * Hàm gọi Google Gemini API sử dụng fetch gốc (Có tích hợp Retry)
 */
const callGemini = async ({ systemPrompt, userPrompt, serviceType }, retries = 3) => {
  const getKeys = (prefix) => {
    return Object.keys(process.env)
      .filter(k => k.startsWith(prefix) && process.env[k])
      .map(k => process.env[k]);
  };

  let apiKeys = [];
  if (serviceType === "numerology") {
    apiKeys = getKeys("GEMINI_KEY_NUMEROLOGY");
  } else if (serviceType === "compatibility") {
    apiKeys = getKeys("GEMINI_KEY_COMPATIBILITY");
  } else if (serviceType === "lenormand") {
    apiKeys = getKeys("GEMINI_KEY_LENORMAND");
  }

  let apiKey = process.env.GEMINI_API_KEY; // fallback
  if (apiKeys.length > 0) {
    apiKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];
  }

  if (!apiKey) {
    throw new Error("Missing Gemini API Key for service: " + serviceType);
  }

  // Sử dụng gemini-3.5-flash
  const geminiModel = process.env.GEMINI_MODEL || "gemini-3.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`;

  const payload = {
    contents: [
      {
        role: "user",
        parts: [{ text: systemPrompt + "\n\n" + userPrompt }]
      }
    ],
    generationConfig: {
      temperature: 0.7,
    }
  };

  let delayMs = 1500; // Khởi tạo delay 1.5s
  for (let attempt = 1; attempt <= retries; attempt++) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const data = await response.json();
      const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!replyText) {
        throw new Error("No response content from Gemini.");
      }

      return replyText;
    }

    const errorText = await response.text();
    
    // Nếu bị 503 (Unavailable) hoặc 429 (Too Many Requests) -> thử lại
    if ((response.status === 503 || response.status === 429) && attempt < retries) {
      console.warn(`[Cảnh báo] Gemini API đang quá tải (Lỗi ${response.status}). Đang thử lại lần ${attempt + 1}/${retries} sau ${delayMs}ms...`);
      await new Promise(res => setTimeout(res, delayMs));
      delayMs *= 2; // Tăng thời gian chờ gấp đôi (Exponential backoff)
      continue;
    }

    // Nếu không phải lỗi hệ thống/rate limit, hoặc đã hết số lần thử
    throw new Error(`Gemini API Error (Status ${response.status}): ${errorText}`);
  }
};

/**
 * Handler chính cho AWS Lambda
 */
const handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const { serviceType, userInputs, bookContext, email } = body;

    if (!serviceType || !userInputs) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "Missing required fields: serviceType, userInputs" })
      };
    }

    // 1. Tạo prompts
    const prompts = generatePrompt({ serviceType, userInputs, bookContext });
    
    // 2. Gọi AI (truyền thêm serviceType để chọn đúng key)
    const aiResponse = await callGemini({ ...prompts, serviceType });

    // Gửi email nếu request có chứa email (Và đang ở dịch vụ numerology)
    if (email && serviceType === "numerology") {
      try {
        await sendResultEmail(email, userInputs, aiResponse);
      } catch (err) {
        // Log lỗi nhưng không làm sập luồng API chính để Frontend vẫn nhận được kết quả
        console.error("Gửi email SES thất bại:", err);
      }
    }

    // 3. Trả kết quả
    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        success: true,
        data: aiResponse
      })
    };

  } catch (error) {
    console.error("AI Handler Exception:", error);
    const isClientError = error.message.includes("Invalid serviceType") || error.message.includes("Missing");
    return {
      statusCode: isClientError ? 400 : 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Internal server error", details: error.message })
    };
  }
};

module.exports = {
  generatePrompt,
  callGemini,
  handler
};
