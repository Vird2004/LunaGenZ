const fs = require('fs');
const pdf = require('pdf-parse');
const path = require('path');

async function extract() {
    const numerologyPdfPath = 'd:/Granger/lunaclone/Thay doi cuoc song voi nhan so hoc - Le Do Quynh Huong.pdf';
    const lenormandPdfPath = 'd:/Granger/lunaclone/The Essential Lenormand (Second Edition) (Rana George) (z-library.sk, 1lib.sk, z-lib.sk).pdf';

    console.log("Reading Numerology PDF...");
    try {
        const numDataBuffer = fs.readFileSync(numerologyPdfPath);
        const numData = await pdf(numDataBuffer);
        fs.writeFileSync(path.join(__dirname, '../../numerology_raw.txt'), numData.text);
        console.log("Saved numerology_raw.txt");
    } catch (e) {
        console.error("Error reading numerology pdf", e);
    }

    console.log("Reading Lenormand PDF...");
    try {
        const lenDataBuffer = fs.readFileSync(lenormandPdfPath);
        const lenData = await pdf(lenDataBuffer);
        fs.writeFileSync(path.join(__dirname, '../../lenormand_raw.txt'), lenData.text);
        console.log("Saved lenormand_raw.txt");
    } catch (e) {
        console.error("Error reading lenormand pdf", e);
    }
}

extract();
