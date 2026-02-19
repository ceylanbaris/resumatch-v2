const express = require('express');
const cors = require('cors');
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

    // 🚨 ZAFER SATIRI: '-latest' ekini sildik, orijinal model adını bıraktık.
    const googleApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${keyData.key}`;

    const response = await fetch(googleApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body) 
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage = data?.error?.message || "Google API sunucularına ulaşılamadı (404).";
      console.error(`[API HATASI] Key #${keyData.number} Hata Sebebi:`, errorMessage);
      
      return res.status(response.status).json({ error: errorMessage });
    }

    console.log(`[BAŞARILI] Key #${keyData.number} ile CV/Mülakat başarıyla üretildi!`);
    return res.json(data);

  } catch (error) {
    console.error("[SUNUCU HATASI]:", error.message);
    return res.status(500).json({ error: "Sunucu tarafında beklenmedik bir hata oluştu." });
  }
});

app.get('/', (req, res) => {
  res.send(`🚀 Resumatch Backend Aktif! Yüklü Temiz Anahtar Sayısı: ${apiKeys.length}`);
});

app.listen(PORT, () => {
  console.log(`🚀 Backend Sunucusu ${PORT} portunda başlatıldı.`);
});
