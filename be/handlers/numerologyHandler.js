const { dynamoDb } = require("../utils/dynamoClient");
const { PutCommand } = require("@aws-sdk/lib-dynamodb");
const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");
const PDFDocument = require("pdfkit");
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const s3Client = new S3Client({ region: process.env.AWS_REGION || "ap-southeast-1" });
const sesClient = new SESClient({ region: process.env.AWS_REGION || "ap-southeast-1" });

function reduceToSingleDigitOrMaster(num) {
  let sum = num.toString().split('').reduce((acc, curr) => acc + parseInt(curr), 0);
  if ([11, 22, 33].includes(sum)) return sum;
  if (sum > 9) return reduceToSingleDigitOrMaster(sum);
  return sum;
}

const letterValues = {
  a: 1, j: 1, s: 1,
  b: 2, k: 2, t: 2,
  c: 3, l: 3, u: 3,
  d: 4, m: 4, v: 4,
  e: 5, n: 5, w: 5,
  f: 6, o: 6, x: 6,
  g: 7, p: 7, y: 7,
  h: 8, q: 8, z: 8,
  i: 9, r: 9
};

function calculateMetrics(name, dob) {
  // DOB parsing
  const cleanDob = dob.replace(/[-/]/g, '');
  const lifePath = reduceToSingleDigitOrMaster(cleanDob);

  const cleanName = name.toLowerCase().replace(/[^a-z]/g, '');
  const vowels = ['a', 'e', 'i', 'o', 'u']; // Y is consonant here

  let soulSum = 0;
  let personalitySum = 0;
  
  for (let char of cleanName) {
    const val = letterValues[char] || 0;
    if (vowels.includes(char)) {
      soulSum += val;
    } else {
      personalitySum += val;
    }
  }

  const soul = reduceToSingleDigitOrMaster(soulSum);
  const personality = reduceToSingleDigitOrMaster(personalitySum);
  const outerPersonality = personality;
  const destiny = reduceToSingleDigitOrMaster(soulSum + personalitySum);

  const words = name.toLowerCase().split(/\s+/).filter(w => w.length > 0);
  let naturalAbility = 0, approachMotivation = 0, approachAbility = 0, balance = 0;

  if (words.length > 0) {
    const firstWord = words[0];
    const lastWord = words[words.length - 1];

    let naSum = 0, amSum = 0, aaSum = 0, bSum = 0;
    
    for (let char of firstWord) {
      naSum += letterValues[char] || 0;
      if (vowels.includes(char)) {
        amSum += letterValues[char] || 0;
      }
    }
    
    for (let char of lastWord) {
      aaSum += letterValues[char] || 0;
    }
    
    words.forEach(w => {
      bSum += letterValues[w[0]] || 0;
    });

    naturalAbility = reduceToSingleDigitOrMaster(naSum);
    approachMotivation = reduceToSingleDigitOrMaster(amSum);
    approachAbility = reduceToSingleDigitOrMaster(aaSum);
    balance = reduceToSingleDigitOrMaster(bSum);
  }

  const dobParts = dob.split(/[-/]/);
  const bDay = parseInt(dobParts[0] || '1');
  const bMonth = parseInt(dobParts[1] || '1');
  const bYear = parseInt(dobParts[2] || '2000');

  const attitude = reduceToSingleDigitOrMaster(bDay + bMonth);
  const maturity = reduceToSingleDigitOrMaster(lifePath + destiny);
  const karmicDebt = 0; // Simplified

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const pySum = bDay + bMonth + currentYear;
  const py = reduceToSingleDigitOrMaster(pySum);
  const personalMonth = reduceToSingleDigitOrMaster(py + currentMonth);

  // 3x3 Pythagoras Chart (count digits 1-9 in DOB)
  const chart = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  for (let char of cleanDob) {
    if (char >= '1' && char <= '9') {
      chart[char]++;
    }
  }

  // Name Chart (count digits 1-9 in Name)
  const nameChart = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  for (let char of cleanName) {
    const val = letterValues[char];
    if (val && val >= 1 && val <= 9) {
      nameChart[val]++;
    }
  }

  // Pinnacles (4 peaks)
  const redDay = reduceToSingleDigitOrMaster(bDay);
  const redMonth = reduceToSingleDigitOrMaster(bMonth);
  const redYear = reduceToSingleDigitOrMaster(bYear);

  const peak1 = reduceToSingleDigitOrMaster(redMonth + redDay);
  const peak2 = reduceToSingleDigitOrMaster(redDay + redYear);
  const peak3 = reduceToSingleDigitOrMaster(peak1 + peak2);
  const peak4 = reduceToSingleDigitOrMaster(redMonth + redYear);

  let singleDigitLP = lifePath.toString().split('').reduce((a, c) => a + parseInt(c), 0);
  if (singleDigitLP > 9) singleDigitLP = singleDigitLP.toString().split('').reduce((a, c) => a + parseInt(c), 0);
  const agePeak1 = 36 - singleDigitLP;

  const pinnacles = [
    { age: agePeak1, year: bYear + agePeak1, value: peak1 },
    { age: agePeak1 + 9, year: bYear + agePeak1 + 9, value: peak2 },
    { age: agePeak1 + 18, year: bYear + agePeak1 + 18, value: peak3 },
    { age: agePeak1 + 27, year: bYear + agePeak1 + 27, value: peak4 }
  ];

  // 9-Year Cycle
  const yearlyCycle = [];
  for (let i = -3; i <= 7; i++) {
    const y = currentYear + i;
    const ySum = y.toString().split('').reduce((a, c) => a + parseInt(c), 0);
    let pyYear = redMonth + redDay + ySum;
    while (pyYear > 9 && pyYear !== 11 && pyYear !== 22 && pyYear !== 33) {
      pyYear = pyYear.toString().split('').reduce((a, c) => a + parseInt(c), 0);
    }
    if (pyYear > 9) pyYear = pyYear.toString().split('').reduce((a, c) => a + parseInt(c), 0);
    if (pyYear > 9) pyYear = pyYear.toString().split('').reduce((a, c) => a + parseInt(c), 0);
    yearlyCycle.push({ year: y, value: pyYear });
  }

  return { lifePath, destiny, soul, personality, outerPersonality, attitude, maturity, balance, naturalAbility, approachMotivation, approachAbility, karmicDebt, personalMonth, chart, nameChart, pinnacles, yearlyCycle };
}

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const { name, dob, email } = body;

    if (!name || !dob) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "Missing name or dob" })
      };
    }

    const { lifePath, destiny, soul, personality, outerPersonality, attitude, maturity, balance, naturalAbility, approachMotivation, approachAbility, karmicDebt, personalMonth, chart, nameChart, pinnacles, yearlyCycle } = calculateMetrics(name, dob);

    const calculatedNumbers = {
      lifePath, destiny, soul, personality, outerPersonality, attitude, maturity, balance, naturalAbility, approachMotivation, approachAbility, karmicDebt, personalMonth
    };

    // Construct rich reading from JSON Database
    const dbPath = path.join(__dirname, '../data/numerology_db.json');
    let numerologyDb = { lifePath: {}, arrows: {}, pinnacles: {}, personalYear: {} };
    if (fs.existsSync(dbPath)) {
      numerologyDb = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    }

    let arrowsReading = "";
    const hasArrow = (a, b, c) => chart[a] > 0 && chart[b] > 0 && chart[c] > 0;
    const emptyArrow = (a, b, c) => chart[a] === 0 && chart[b] === 0 && chart[c] === 0;

    if (hasArrow(1,5,9)) arrowsReading += numerologyDb.arrows["159"] + "\n\n";
    if (emptyArrow(1,5,9)) arrowsReading += numerologyDb.arrows["empty_159"] + "\n\n";
    if (hasArrow(3,5,7)) arrowsReading += numerologyDb.arrows["357"] + "\n\n";
    if (emptyArrow(3,5,7)) arrowsReading += numerologyDb.arrows["empty_357"] + "\n\n";
    if (hasArrow(2,5,8)) arrowsReading += numerologyDb.arrows["258"] + "\n\n";
    if (emptyArrow(2,5,8)) arrowsReading += numerologyDb.arrows["empty_258"] + "\n\n";
    if (hasArrow(3,6,9)) arrowsReading += numerologyDb.arrows["369"] + "\n\n";
    if (emptyArrow(3,6,9)) arrowsReading += numerologyDb.arrows["empty_369"] + "\n\n";
    if (hasArrow(4,5,6)) arrowsReading += numerologyDb.arrows["456"] + "\n\n";
    if (emptyArrow(4,5,6)) arrowsReading += numerologyDb.arrows["empty_456"] + "\n\n";
    if (hasArrow(7,8,9)) arrowsReading += numerologyDb.arrows["789"] + "\n\n";
    if (emptyArrow(7,8,9)) arrowsReading += numerologyDb.arrows["empty_789"] + "\n\n";
    if (arrowsReading === "") arrowsReading = "Rất tiếc, không có mũi tên nổi bật nào được tạo nên từ biểu đồ ngày sinh của bạn.\n";

    const lpReading = numerologyDb.lifePath[lifePath.toString()] || "Đang cập nhật...";
    const pyValue = yearlyCycle.find(y => y.year === new Date().getFullYear())?.value;
    const pyReading = numerologyDb.personalYear[pyValue?.toString()] || "Đang cập nhật...";

    let pinnaclesReading = "";
    pinnacles.forEach((p, idx) => {
      pinnaclesReading += `**Đỉnh cao ${idx + 1} (Tuổi ${p.age} - Năm ${p.year}) - Năng lượng số ${p.value}:**\n`;
      pinnaclesReading += (numerologyDb.pinnacles[p.value.toString()] || "Đang cập nhật...") + "\n\n";
    });

    const readingId = crypto.randomUUID();
    const timestamp = new Date().toISOString();
    const ipAddress = event.requestContext?.identity?.sourceIp || "unknown";

    const readings = {
      overview: lpReading,
      charts: arrowsReading,
      pinnacles: pinnaclesReading,
      yearly: pyReading
    };

    const resultData = {
      calculatedNumbers,
      birthChart: chart,
      nameChart,
      pinnacles,
      yearlyCycle,
      readings
    };

    // Save to DynamoDB early
    if (process.env.USERS_TABLE) {
      try {
        await dynamoDb.send(new PutCommand({
          TableName: process.env.USERS_TABLE,
          Item: {
            id: readingId,
            type: "NUMEROLOGY",
            name,
            dob,
            email: email || null,
            ipAddress,
            metrics: resultData,
            createdAt: timestamp
          }
        }));
      } catch (dbErr) {
        console.error("DynamoDB error:", dbErr);
      }
    }

    let pdfUrl = null;
    let emailSent = false;

    // ALWAYS Generate PDF
    const generatePdf = async () => {
      return new Promise((resolve, reject) => {
        try {
          const doc = new PDFDocument({ margin: 50 });
          const buffers = [];
          doc.on('data', buffers.push.bind(buffers));
          doc.on('end', () => resolve(Buffer.concat(buffers)));
          
          doc.fontSize(24).text('Bản Báo Cáo Thần Số Học', { align: 'center' });
          doc.moveDown();
          doc.fontSize(16).text(`Tên: ${name}`);
          doc.text(`Ngày sinh: ${dob}`);
          doc.moveDown();
          
          doc.fontSize(14).text(`Đường đời: ${lifePath}`);
          doc.text(`Sứ mệnh: ${destiny}`);
          doc.text(`Linh hồn: ${soul}`);
          doc.text(`Nhân cách: ${personality}`);
          doc.text(`Trưởng thành: ${maturity}`);
          doc.text(`Thái độ: ${attitude}`);
          
          doc.moveDown();
          doc.fontSize(12).text(lpReading);
          
          doc.moveDown();
          doc.fontSize(14).text('Các Mũi Tên Sức Mạnh:');
          doc.fontSize(12).text(arrowsReading);
          
          doc.moveDown();
          doc.fontSize(14).text('Bốn Đỉnh Cao:');
          doc.fontSize(12).text(pinnaclesReading);
          
          doc.moveDown();
          doc.fontSize(14).text(`Năm cá nhân (${new Date().getFullYear()}):`);
          doc.fontSize(12).text(pyReading);
          
          doc.end();
        } catch (err) {
          reject(err);
        }
      });
    };

    try {
      const pdfBuffer = await generatePdf();
      const pdfKey = `numerology-${readingId}.pdf`;
      
      // Upload to S3
      await s3Client.send(new PutObjectCommand({
        Bucket: process.env.PDF_BUCKET_NAME,
        Key: pdfKey,
        Body: pdfBuffer,
        ContentType: "application/pdf"
      }));
      
      // Generate Presigned URL
      const getCmd = new GetObjectCommand({
        Bucket: process.env.PDF_BUCKET_NAME,
        Key: pdfKey
      });
      pdfUrl = await getSignedUrl(s3Client, getCmd, { expiresIn: 86400 });

      // Optional Email Flow
      if (email && process.env.SES_FROM_EMAIL) {
        const sesParams = {
          Source: process.env.SES_FROM_EMAIL,
          Destination: {
            ToAddresses: [email]
          },
          Message: {
            Subject: { Data: `Báo cáo thần số học của bạn - ${name}` },
            Body: {
              Text: { Data: `Chào ${name},\n\nChúc mừng bạn đã tạo thành công báo cáo thần số học.\n\nBạn có thể tải báo cáo PDF tại liên kết sau (có hiệu lực 24h):\n${pdfUrl}\n\nTrân trọng,\nĐội ngũ LunaGenZ` }
            }
          }
        };
        await sesClient.send(new SendEmailCommand(sesParams));
        emailSent = true;
      }
    } catch (e) {
      console.error("Error generating PDF or sending email:", e);
    }

    const responsePayload = {
      ...resultData,
      message: emailSent ? "Numerology calculated. PDF sent to email." : "Numerology calculated successfully.",
      pdfUrl
    };

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(responsePayload)
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Internal server error" })
    };
  }
};
