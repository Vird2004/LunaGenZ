import 'dotenv/config'; // Hoặc require('dotenv').config(); tùy cú pháp em đang dùng

async function getAvailableModels() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.log("Chưa tìm thấy API Key!");
        return;
    }

    try {
        console.log("Đang quét danh sách model từ Google...");
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        console.log("\n=== CÁC MODEL HỖ TRỢ GENERATE CONTENT ===");
        data.models.forEach(model => {
            if (model.supportedGenerationMethods && model.supportedGenerationMethods.includes("generateContent")) {
                // Xóa chữ 'models/' ở đầu đi để lấy đúng cái tên cần điền vào .env
                console.log(`👉 ${model.name.replace('models/', '')}`);
            }
        });
        console.log("===========================================\n");
    } catch (error) {
        console.error("Lỗi:", error);
    }
}

getAvailableModels();