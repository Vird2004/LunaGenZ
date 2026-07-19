const { dynamoDb } = require("../utils/dynamoClient");
const { PutCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");
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
    let numerologyDb = { lifePath: {}, arrows: {}, pinnacles: {}, personalYear: {} };
    try {
      // Read local JSON file instead of expensive DynamoDB scan for static mappings
      const localData = fs.readFileSync(path.join(__dirname, '../data/numerology_db.json'), 'utf8');
      numerologyDb = JSON.parse(localData);
    } catch (err) {
      console.error("Local data read error:", err);
    }

    const combinedChart = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
    for (let i = 1; i <= 9; i++) {
      combinedChart[i] = chart[i] + nameChart[i];
    }

    const hasArrow = (c, a, b, d) => c[a] > 0 && c[b] > 0 && c[d] > 0;
    const emptyArrow = (c, a, b, d) => c[a] === 0 && c[b] === 0 && c[d] === 0;

    let presentArrowsStr = "";
    let emptyArrowsStr = "";
    let virtualRescueStr = "";

    const arrowList = [
      { keys: [1,5,9], name: "159", emptyName: "empty_159" },
      { keys: [3,5,7], name: "357", emptyName: "empty_357" },
      { keys: [2,5,8], name: "258", emptyName: "empty_258" },
      { keys: [3,6,9], name: "369", emptyName: "empty_369" },
      { keys: [4,5,6], name: "456", emptyName: "empty_456" },
      { keys: [7,8,9], name: "789", emptyName: "empty_789" }
    ];

    arrowList.forEach(arr => {
      const [a, b, c] = arr.keys;
      const hasInBirth = hasArrow(chart, a, b, c);
      const hasInCombined = hasArrow(combinedChart, a, b, c);
      const emptyInBirth = emptyArrow(chart, a, b, c);
      const emptyInCombined = emptyArrow(combinedChart, a, b, c);

      // Present arrows
      if (hasInBirth) {
        presentArrowsStr += numerologyDb.arrows[arr.name] + "\n\n";
      } else if (hasInCombined) {
        presentArrowsStr += `(Nhờ con số ảo từ Tên) ` + numerologyDb.arrows[arr.name] + "\n\n";
        virtualRescueStr = (numerologyDb.virtualNumbers?.name_rescue || "") + "\n\n";
      }

      // Empty arrows
      if (emptyInBirth) {
        if (!emptyInCombined) {
          virtualRescueStr += `Mũi tên Trống ${a}-${b}-${c} của bạn đã được bù đắp nhờ các chữ cái trong tên.\n`;
        } else {
          emptyArrowsStr += numerologyDb.arrows[arr.emptyName] + "\n\n";
        }
      }
    });

    // Check Isolated Numbers in Birth Chart
    let isolatedStr = "";
    let isolatedRescueStr = "";
    const checkIsolated = (num, neighbors, dbKey) => {
      if (chart[num] > 0 && neighbors.every(n => chart[n] === 0)) {
        if (combinedChart[num] > 0 && neighbors.some(n => combinedChart[n] > 0)) {
          isolatedRescueStr += `Thế cô độc của Số ${num} đã được phá vỡ nhờ các chữ cái trong tên cung cấp thêm năng lượng.\n`;
        } else {
          if (numerologyDb.isolatedNumbers) {
            isolatedStr += numerologyDb.isolatedNumbers[dbKey] + "\n\n";
          }
        }
      }
    };

    checkIsolated(1, [2, 4, 5], "1");
    checkIsolated(3, [2, 5, 6], "3");
    checkIsolated(7, [4, 5, 8], "7");
    checkIsolated(9, [5, 6, 8], "9");

    let arrowsReading = "";
    if (presentArrowsStr) {
      arrowsReading += "### 🌟 MŨI TÊN HIỆN HỮU\n" + presentArrowsStr;
    }
    
    if (emptyArrowsStr) {
      arrowsReading += "### ⚠️ MŨI TÊN TRỐNG (CẦN KHẮC PHỤC)\n" + emptyArrowsStr;
    }

    if (isolatedStr) {
      arrowsReading += "### 👤 SỐ CÔ ĐỘC\n" + isolatedStr;
    }

    if (virtualRescueStr || isolatedRescueStr || combinedChart[5] === 0) {
      arrowsReading += "### 💡 GIẢI PHÁP & CON SỐ ẢO\n";
      if (virtualRescueStr) arrowsReading += virtualRescueStr;
      if (isolatedRescueStr) arrowsReading += isolatedRescueStr + "\n";
      if (combinedChart[5] === 0 && numerologyDb.virtualNumbers) {
        arrowsReading += numerologyDb.virtualNumbers["missing_5"] + "\n\n";
      }
      if (numerologyDb.virtualNumbers) {
        arrowsReading += numerologyDb.virtualNumbers["general_advice"] + "\n\n";
      }
    }

    if (!arrowsReading) {
      arrowsReading = "Rất tiếc, không có mũi tên nổi bật nào được tạo nên từ biểu đồ ngày sinh của bạn.\n";
    }

    const shortTraits = {
      "1": "sự độc lập, tiên phong và khả năng lãnh đạo",
      "2": "sự hòa hợp, trực giác nhạy bén và thấu cảm",
      "3": "sự sáng tạo, năng lượng lạc quan và giao tiếp",
      "4": "sự thực tế, kỷ luật và khả năng tổ chức",
      "5": "sự tự do, linh hoạt và yêu thích trải nghiệm",
      "6": "sự yêu thương, trách nhiệm và chăm sóc gia đình",
      "7": "sự chiêm nghiệm, trí tuệ và bài học tâm linh",
      "8": "sự độc lập tài chính, quyền lực và kinh doanh",
      "9": "sự bao dung, nhân đạo và lý tưởng cống hiến",
      "10": "sự linh hoạt và dũng khí khởi xướng",
      "11": "trực giác nhạy bén và nhận thức tâm linh cao",
      "22": "khả năng kiến tạo và tầm nhìn lớn lao thiết thực"
    };

    let lpReading = `**Số Chủ Đạo (Life Path): ${lifePath}**\n${numerologyDb.lifePath[lifePath.toString()] || "Đang cập nhật..."}\n\n`;
    lpReading += `**Số Tâm Hồn (Soul Urge): ${soul}**\nChỉ số tâm hồn cho thấy khát khao ẩn sâu bên trong bạn luôn hướng về ${shortTraits[soul.toString()] || "những giá trị tốt đẹp"}.\n\n`;
    lpReading += `**Số Tính Cách (Personality): ${personality}**\nThế giới bên ngoài nhìn nhận bạn là một người mang phong thái của ${shortTraits[personality.toString()] || "một cá tính đặc biệt"}.\n\n`;
    lpReading += `**Số Sứ Mệnh (Destiny): ${destiny}**\nMục đích của bạn trong cuộc đời này là học hỏi và phát huy ${shortTraits[destiny.toString()] || "những bài học quan trọng"}.\n\n`;
    lpReading += `**Số Thái Độ (Attitude): ${attitude}**\nKhi đối mặt với các tình huống mới, bạn thường phản ứng với ${shortTraits[attitude.toString()] || "một thái độ tự nhiên"}.\n\n`;
    lpReading += `**Số Trưởng Thành (Maturity): ${maturity}**\nTừ độ tuổi trung niên trở đi, bạn sẽ ngày càng bộc lộ rõ ${shortTraits[maturity.toString()] || "tiềm năng của mình"}.\n\n`;
    
    lpReading += `**Chỉ số Cân bằng (Balance): ${balance}**\nKhi gặp căng thẳng, bạn tìm thấy sự bình yên thông qua ${shortTraits[balance.toString()] || "cách tiếp cận cân bằng"}.\n\n`;
    lpReading += `**Chỉ số Năng lực tự nhiên (Natural Ability): ${naturalAbility}**\nBạn mang trong mình năng khiếu bẩm sinh về ${shortTraits[naturalAbility.toString()] || "những khả năng đặc biệt"}.\n\n`;
    lpReading += `**Chỉ số Động lực tiếp cận (Approach Motivation): ${approachMotivation}**\nĐiều thôi thúc bạn bắt đầu những thử thách mới liên quan đến ${shortTraits[approachMotivation.toString()] || "động lực bên trong"}.\n\n`;
    lpReading += `**Chỉ số Năng lực tiếp cận (Approach Ability): ${approachAbility}**\nCách bạn giải quyết bước đầu các vấn đề thể hiện sự ${shortTraits[approachAbility.toString()] || "nhạy bén riêng biệt"}.\n\n`;
    lpReading += `**Chỉ số Nợ nghiệp (Karmic Debt): ${karmicDebt}**\n${karmicDebt === 0 ? "Bạn không mang bài học nợ nghiệp lớn nào trong kiếp này." : "Bạn có những bài học nghiệp quả cần chú ý và vượt qua."}\n\n`;
    lpReading += `**Chỉ số Nhân cách (Outer Personality): ${outerPersonality}**\nLớp vỏ bọc giao tiếp ngoài xã hội của bạn mang màu sắc của ${shortTraits[outerPersonality.toString()] || "một người thú vị"}.\n\n`;
    lpReading += `**Tháng Cá Nhân (Personal Month): ${personalMonth}**\nTháng này năng lượng của bạn tập trung vào ${shortTraits[personalMonth.toString()] || "những biến chuyển hiện tại"}.`;

    let pyReading = "";
    for (const yearObj of yearlyCycle) {
      pyReading += `**Năm ${yearObj.year} (Năm cá nhân số ${yearObj.value}):**\n${numerologyDb.personalYear[yearObj.value.toString()] || "Đang cập nhật..."}\n\n`;
    }

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
          const fontPath = path.join(__dirname, '../fonts/Tinos-Regular.ttf');
          if (fs.existsSync(fontPath)) {
            doc.font(fontPath);
          }
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
