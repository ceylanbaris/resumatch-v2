const express = require('express');
const cors = require('cors');
// 🚨 ÇÖZÜM: Direkt link yerine Google'ın resmi kütüphanesini kullanıyoruz
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' })); 

const apiKeys = [
  process.env.GEMINI_API_KEY_bcey2603,
  process.env.GEMINI_API_KEY_bceylannn,
  process.env['GEMINI_API_KEY_ogr.sakarya']
].filter(Boolean).map(key => key.trim());

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

    console.log(`[İSTEK ALINDI] Key #${keyData.number} kullanılıyor...`);

    // Kütüphaneyi sıradaki anahtar ile başlatıyoruz
    const genAI = new GoogleGenerativeAI(keyData.key);
    
    // Modeli ve sistem komutlarını güvenli bir şekilde hazırlıyoruz
    let modelConfig = { model: "gemini-1.5-flash" };
    if (req.body.systemInstruction && req.body.systemInstruction.parts && req.body.systemInstruction.parts.length > 0) {
        modelConfig.systemInstruction = req.body.systemInstruction.parts[0].text;
    }

    const model = genAI.getGenerativeModel(modelConfig);

    // JSON formatı isteniyorsa ayarı ekliyoruz
    let reqConfig = {};
    if (req.body.generationConfig) {
        reqConfig = req.body.generationConfig;
    }

    // İsteği Google'a gönderiyoruz
    const result = await model.generateContent({
        contents: req.body.contents,
        generationConfig: reqConfig
    });

    const responseText = result.response.text();

    console.log(`[BAŞARILI] Key #${keyData.number} ile işlem tamamlandı!`);
    
    // React (Frontend) tarafını bozmamak için orijinal formata uygun yanıt dönüyoruz
    return res.json({
        candidates: [
            {
                content: {
                    parts: [{ text: responseText }]
                }
            }
        ]
    });

  } catch (error) {
    // Kaçıncı anahtarın hata verdiğini net görmek için:
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
