function buildPrompt(userInfo, retrievedData) {
  return `Act as a Gen-Z advisor.
Here is the user's information:
${JSON.stringify(userInfo, null, 2)}

Here is the retrieved context data:
${JSON.stringify(retrievedData, null, 2)}

Based on this information, provide advice.
You MUST return ONLY a JSON object with this exact structure (no markdown, no extra text):
{
  "vibe": "a short gen-z slang description of the vibe",
  "summary": "a brief summary of the reading",
  "advice": "actionable advice in a gen-z tone"
}`;
}

const axios = require('axios');

const googleAdapter = async (prompt) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`;
  const response = await axios.post(url, {
    contents: [{ parts: [{ text: prompt }] }]
  });
  return response.data.candidates[0].content.parts[0].text;
};

const githubAdapter = async (prompt) => {
  const url = "https://models.inference.ai.azure.com/chat/completions";
  const response = await axios.post(url, {
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }]
  }, {
    headers: { 'Authorization': `Bearer ${process.env.GITHUB_MODEL_API_KEY}` }
  });
  return response.data.choices[0].message.content;
};

const openRouterAdapter = async (prompt) => {
  const url = "https://openrouter.ai/api/v1/chat/completions";
  const response = await axios.post(url, {
    model: "tencent/hy3:free",
    messages: [{ role: "user", content: prompt }]
  }, {
    headers: { 'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}` }
  });
  return response.data.choices[0].message.content;
};

const cohereAdapter = async (prompt) => {
  const url = "https://api.cohere.com/v1/chat";
  const response = await axios.post(url, {
    model: "command-r-plus-08-2024",
    message: prompt
  }, {
    headers: { 'Authorization': `Bearer ${process.env.COHERE_API_KEY}` }
  });
  return response.data.text;
};

const cerebrasAdapter = async (prompt) => {
  const url = "https://api.cerebras.ai/v1/chat/completions";
  const response = await axios.post(url, {
    model: "gpt-oss-120b",
    messages: [{ role: "user", content: prompt }]
  }, {
    headers: { 'Authorization': `Bearer ${process.env.CEREBRAS_API_KEY}` }
  });
  return response.data.choices[0].message.content;
};

const generateReading = async (prompt) => {
  try {
    const result = await googleAdapter(prompt);
    console.log("✅ Thành công lấy phản hồi từ: Google AI");
    return result;
  } catch (error) {
    console.warn(`⚠️ [FALLBACK 1] Google AI lỗi (${error.message}). Chuyển hướng sang GitHub Models...`);
  }

  try {
    const result = await githubAdapter(prompt);
    console.log("✅ Thành công lấy phản hồi từ: GitHub Models");
    return result;
  } catch (error) {
    console.warn(`⚠️ [FALLBACK 2] GitHub Models lỗi (${error.message}). Chuyển hướng sang OpenRouter...`);
  }

  try {
    const result = await openRouterAdapter(prompt);
    console.log("✅ Thành công lấy phản hồi từ: OpenRouter");
    return result;
  } catch (error) {
    console.warn(`⚠️ [FALLBACK 3] OpenRouter lỗi (${error.message}). Chuyển hướng sang Cohere...`);
  }

  try {
    const result = await cohereAdapter(prompt);
    console.log("✅ Thành công lấy phản hồi từ: Cohere");
    return result;
  } catch (error) {
    console.warn(`⚠️ [FALLBACK 4] Cohere lỗi (${error.message}). Chuyển hướng sang Cerebras (Last Resort)...`);
  }

  try {
    const result = await cerebrasAdapter(prompt);
    console.log("✅ Thành công lấy phản hồi từ: Cerebras");
    return result;
  } catch (error) {
    console.error(`❌ [CRITICAL] Toàn bộ 5 nền tảng AI đều sập. Yêu cầu giương cờ trắng!`);
    throw new Error("Dịch vụ AI hiện tại đang bảo trì hoặc quá tải. Vui lòng thử lại sau.");
  }
};

module.exports = {
  buildPrompt,
  generateReading
};
