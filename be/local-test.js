const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') }); // Load từ thư mục gốc

// Hoặc nạp thủ công (như cũ) nếu dotenv không load được:
const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            const value = match[2].trim();
            if (value) process.env[key] = value;
        }
    });
} else {
    console.warn("Cảnh báo: Không tìm thấy file .env ở thư mục gốc.");
}

const { handler } = require('./handlers/aiHandler');

async function runTest() {
    console.log("=== Bắt đầu test AI Handler ===");

    // 1. Mock Event cho Numerology
    const mockNumerologyEvent = {
        body: JSON.stringify({
            serviceType: "numerology",
            userInputs: {
                lifePath: 5,
                personalYear: 8
            },
            bookContext: "Số 5 đại diện cho sự tự do, linh hoạt, và trải nghiệm. Số 8 đại diện cho thành tựu, tiền bạc, và quyền lực độc lập."
        }),
        headers: { "Content-Type": "application/json" }
    };

    // 2. Mock Event cho Lenormand
    const mockLenormandEvent = {
        body: JSON.stringify({
            serviceType: "lenormand",
            userInputs: {
                cards: ["Stork (Con Cò)", "Rider (Kỵ Sĩ)"],
                question: "Sự nghiệp tháng tới của tôi sẽ ra sao?"
            },
            bookContext: "Lá Stork tượng trưng cho sự thay đổi tích cực, di chuyển hoặc chuyển giao. Lá Rider tượng trưng cho tin tức mới, khởi đầu hoặc một người mang tin đến."
        }),
        headers: { "Content-Type": "application/json" }
    };

    console.log("\n--- Đang gọi AI (Numerology) vui lòng đợi ---");
    try {
        const responseNum = await handler(mockNumerologyEvent);
        console.log(`[Numerology] Status: ${responseNum.statusCode}`);
        console.log(`[Numerology] Response:\n`, JSON.parse(responseNum.body).data || responseNum.body);
    } catch (e) {
        console.error("Lỗi test Numerology:", e);
    }

    console.log("\n--- Đang gọi AI (Lenormand) vui lòng đợi ---");
    try {
        const responseLen = await handler(mockLenormandEvent);
        console.log(`[Lenormand] Status: ${responseLen.statusCode}`);
        console.log(`[Lenormand] Response:\n`, JSON.parse(responseLen.body).data || responseLen.body);
    } catch (e) {
        console.error("Lỗi test Lenormand:", e);
    }
}

runTest();
