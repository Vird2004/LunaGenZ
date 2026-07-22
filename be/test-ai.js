const axios = require('axios');

async function testOpenRouter() {
    // Dán cái key sk-or-v1-... em vừa copy vào giữa 2 dấu nháy kép bên dưới
    const apiKey = "sk-or-YOUR_API_KEY_HERE";

    console.log("Đang gọi con AI... chờ xíu nhé!");

    try {
        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "tencent/hy3:free", // Gọi thẳng model Free
                messages: [
                    { role: "user", content: "Chào bạn, hãy tóm tắt ý nghĩa con số 7 trong thần số học bằng 1 câu ngắn gọn." }
                ]
            },
            {
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("✅ THÀNH CÔNG! Kết quả trả về:");
        console.log("-----------------------------------");
        console.log(response.data.choices[0].message.content);
        console.log("-----------------------------------");

    } catch (error) {
        console.log("❌ TOANG RỒI LỖI ĐÂY:");
        console.log(error.response ? error.response.data : error.message);
    }
}

testOpenRouter();