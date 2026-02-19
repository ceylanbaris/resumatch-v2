const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' })); 

// 🚨 KORUMA 1: Eğer Render'a şifreyi girerken tırnak işareti (") unuttuysan bile bu kod o tırnakları ve boşlukları zorla siler!
const apiKeys = [
  process.env.GEMINI_API_KEY_bcey2603,
  process.env.GEMINI_API_KEY_bceylannn,
  process.env['GEMINI_API_KEY_ogr.sakarya']
].filter(Boolean).map(key => key.replace(/['"]/g, '').trim());

let currentKeyIndex = 0;

function getNextApiKey() {
  if (apiKeys.length === 0) return null;
  const key = apiKeys[currentKeyIndex];
  const usedIndex = currentKeyIndex + 1; 
  currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
  return { key, number: usedIndex };
}

app.post('/optimize', async (req, res) => {
  try {
    const keyData = getNextApiKey();
    if (!keyData) {
      return res.status(500).json({ error: "Sunucuda API anahtarı bulunamadı." });
    }

    // Konsolda şifrenin düzgün okunup okunmadığını görmek için ilk 5 harfini yazdırıyoruz (Örn: AIzaS***)
    console.log(`[İSTEK ALINDI] Key #${keyData.number} | Şifre Testi: ${keyData.key.substring(0, 5)}***`);

    const genAI = new GoogleGenerativeAI(keyData.key);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let reqConfig = req.body.generationConfig || {};
    let promptData = req.body.contents;

    // 🚨 KORUMA 2: Eğer SDK sürümü eskiyse ve systemInstruction desteklemiyorsa, sistemi kandırıp komutu mesajın içine gömüyoruz.
    if (req.body.systemInstruction && req.body.systemInstruction.parts) {
        const sysText = req.body.systemInstruction.parts[0].text;
        promptData = [
            { role: "user", parts: [{ text: `AŞAĞIDAKİ SİSTEM KOMUTUNA KESİNLİKLE UY:\n${sysText}\n\n---\nKULLANICI VERİSİ:\n` }] },
            ...req.body.contents
        ];
    }

    const result = await model.generateContent({
        contents: promptData,
        generationConfig: reqConfig
    });

    const responseText = result.response.text();
    console.log(`[BAŞARILI] Key #${keyData.number} ile işlem kusursuz tamamlandı!`);
    
    return res.json({
        candidates: [{ content: { parts: [{ text: responseText }] } }]
    });

  } catch (error) {
    let errorKeyNum = currentKeyIndex === 0 ? apiKeys.length : currentKeyIndex;
    console.error(`[API HATASI] Key #${errorKeyNum}:`, error.message);
    return res.status(500).json({ error: error.message || "Google API Hatası" });
  }
});

app.get('/', (req, res) => {
  res.send(`🚀 Resumatch Backend Aktif! Yüklü Temiz Anahtar Sayısı: ${apiKeys.length}`);
});

app.listen(PORT, () => {
  console.log(`🚀 Backend Sunucusu ${PORT} portunda başlatıldı.`);
});
