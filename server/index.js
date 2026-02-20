const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' })); 

// Şifrelerdeki olası tırnak ve boşlukları tertemiz yapıyoruz
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

// Yeni: İstek atma fonksiyonunu ayırdık ki hata alırsak başka modelle tekrar deneyebilelim
async function tryGenerate(genAI, modelName, reqBody) {
    const model = genAI.getGenerativeModel({ model: modelName });
    
    let reqConfig = reqBody.generationConfig || {};
    let promptData = reqBody.contents;

    // Sistem komutlarını, eski modellerin de anlayacağı şekle çeviriyoruz
    if (reqBody.systemInstruction && reqBody.systemInstruction.parts) {
        const sysText = reqBody.systemInstruction.parts[0].text;
        promptData = [
            { role: "user", parts: [{ text: `AŞAĞIDAKİ SİSTEM KOMUTUNA KESİNLİKLE UY:\n${sysText}\n\n---\nKULLANICI VERİSİ:\n` }] },
            ...reqBody.contents
        ];
    }

    const result = await model.generateContent({
        contents: promptData,
        generationConfig: reqConfig
    });

    return result.response.text();
}

app.post('/optimize', async (req, res) => {
  try {
    const keyData = getNextApiKey();
    if (!keyData) {
      return res.status(500).json({ error: "Sunucuda API anahtarı bulunamadı." });
    }

    console.log(`[İSTEK ALINDI] Key #${keyData.number} kullanılıyor...`);
    const genAI = new GoogleGenerativeAI(keyData.key);
    
    let responseText;
    
    try {
        // 1. AŞAMA: Önce en hızlı ve güncel model olan 1.5-flash'ı deniyoruz
        responseText = await tryGenerate(genAI, "gemini-1.5-flash", req.body);
        console.log(`[BAŞARILI] Key #${keyData.number} -> gemini-1.5-flash ile üretti!`);
    } catch (modelError) {
        // 2. AŞAMA: Eğer bu hesaba 1.5-flash kapalıysa (404 hatası dönerse), anında her hesapta çalışan 'gemini-pro'ya geç!
        if (modelError.message.includes('404') || modelError.message.includes('not found')) {
            console.log(`[MODEL DEĞİŞİMİ] Key #${keyData.number} için 1.5-flash kapalı, yedek model (gemini-pro) deneniyor...`);
            responseText = await tryGenerate(genAI, "gemini-pro", req.body);
            console.log(`[BAŞARILI] Key #${keyData.number} -> gemini-pro ile üretti!`);
        } else {
            // Kota dolması (429) gibi başka bir hataysa işlemi durdur
            throw modelError; 
        }
    }
    
    // İşlem başarılıysa sonucu React'a (Frontend'e) yolla
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
