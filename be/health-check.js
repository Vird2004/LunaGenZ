require('dotenv').config();
const axios = require('axios');

const checkHealth = async () => {
  const prompt = "Say hi";
  console.log("🚀 Đang gửi ping đến 5 nền tảng AI...\n");

  const platforms = [
    {
      name: "1. Google AI Studio (Gemini 3.1 Flash-Lite)",
      request: async () => {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`;
        return axios.post(url, {
          contents: [{ parts: [{ text: prompt }] }]
        });
      }
    },
    {
      name: "2. GitHub Models (gpt-4o-mini)",
      request: async () => {
        const url = "https://models.inference.ai.azure.com/chat/completions";
        return axios.post(url, {
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }]
        }, {
          headers: {
            'Authorization': `Bearer ${process.env.GITHUB_MODEL_API_KEY}`
          }
        });
      }
    },
    {
      name: "3. OpenRouter (tencent/hy3:free)",
      request: async () => {
        const url = "https://openrouter.ai/api/v1/chat/completions";
        return axios.post(url, {
          model: "tencent/hy3:free",
          messages: [{ role: "user", content: prompt }]
        }, {
          headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`
          }
        });
      }
    },
    {
      name: "4. Cohere (command-r-plus-08-2024)",
      request: async () => {
        const url = "https://api.cohere.com/v1/chat";
        return axios.post(url, {
          model: "command-r-plus-08-2024",
          message: prompt
        }, {
          headers: {
            'Authorization': `Bearer ${process.env.COHERE_API_KEY}`
          }
        });
      }
    },
    {
      name: "5. Cerebras (gpt-oss-120b)",
      request: async () => {
        const url = "https://api.cerebras.ai/v1/chat/completions";
        return axios.post(url, {
          model: "gpt-oss-120b",
          messages: [{ role: "user", content: prompt }]
        }, {
          headers: {
            'Authorization': `Bearer ${process.env.CEREBRAS_API_KEY}`
          }
        });
      }
    }
  ];

  const results = await Promise.allSettled(
    platforms.map(async (platform) => {
      const startTime = performance.now();
      try {
        const response = await platform.request();
        const endTime = performance.now();
        const ping = Math.round(endTime - startTime);

        return {
          Platform: platform.name,
          Status: "✅ ĐANG SỐNG",
          StatusCode: response.status,
          Ping: `${ping} ms`
        };
      } catch (error) {
        const endTime = performance.now();
        const ping = Math.round(endTime - startTime);

        let statusStr = "❌ LỖI / TIMEOUT";
        if (error.response?.status === 429) statusStr = "⚠️ QUÁ TẢI (429)";
        if (error.response?.status >= 500) statusStr = "🔥 LỖI SERVER (500)";

        return {
          Platform: platform.name,
          Status: statusStr,
          StatusCode: error.response?.status || error.message,
          Ping: `${ping} ms`
        };
      }
    })
  );

  const tableData = results.map(r => r.status === 'fulfilled' ? r.value : r.reason);
  console.table(tableData);
};

checkHealth();
