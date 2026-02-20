const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' })); 

// 🚨 HAYAT KURTARAN DÜZELTME 🚨
// 1. Eskiden çalışan orijinal GEMINI_API_KEY'ini de listeye ekledik.
// 2. Yanlışlıkla girilen boş şifreleri (10 karakterden kısaysa) otomatik siliyoruz.
const apiKeys = [
  process.env.GEMINI_API_KEY, // Eskiden çalışan orijinal şifren!
  process.env.GEMINI_API_KEY_bcey2603,
  process.env.GEMINI_API_KEY_bceylannn,
  process.env['GEMINI_API_KEY_ogr.sakarya']
]
.map(key => key ? key.replace(/['"]/g, '').trim() : '')
.filter(key => key.length > 10); 

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

    // Şifrenin son 4 harfini yazdırıyoruz ki loglarda hangi şifrenin patladığını görelim
    console.log(`[İSTEK ALINDI] Key #${keyData.number} deneniyor... (Şifre sonu: ...${keyData.key.slice(-4)})`);

    const genAI = new GoogleGenerativeAI(keyData.key);
    
    // Doğrudan en güncel ve sorunsuz modeli kullanıyoruz (Yedek modele geçmiyoruz ki 404 almayalım)
    const modelConfig = { model: "gemini-1.5-flash" };
    
    if (req.body.systemInstruction && req.body.systemInstruction.parts && req.body.systemInstruction.parts.length > 0) {
        modelConfig.systemInstruction = req.body.systemInstruction.parts[0].text;
    }

    const model = genAI.getGenerativeModel(modelConfig);

    const result = await model.generateContent({
        contents: req.body.contents,
        generationConfig: req.body.generationConfig || {}
    });

    const responseText = result.response.text();
    console.log(`[BAŞARILI] Key #${keyData.number} ile işlem kusursuz tamamlandı!`);
    
    return res.json({
        candidates: [{ content: { parts: [{ text: responseText }] } }]
    });

  } catch (error) {
    let errorKeyNum = currentKeyIndex === 0 ? apiKeys.length : currentKeyIndex;
    console.error(`[API HATASI] Key #${errorKeyNum} arızalı:`, error.message);
    return res.status(500).json({ error: error.message || "Google API Hatası" });
  }
});

app.get('/', (req, res) => {
  res.send(`🚀 Resumatch Backend Aktif! Yüklü Geçerli Anahtar Sayısı: ${apiKeys.length}`);
});

app.listen(PORT, () => {
  console.log(`🚀 Backend Sunucusu ${PORT} portunda başlatıldı.`);
});
