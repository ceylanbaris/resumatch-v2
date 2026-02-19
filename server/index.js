const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' })); 

// --- DİKKAT: Render'daki değişken isimlerini birebir buraya yazdım ---
// process.env['...'] şeklinde yazmamızın sebebi, isminde nokta (ogr.sakarya) olmasıdır.
const apiKeys = [
  process.env.GEMINI_API_KEY_bcey2603,
  process.env.GEMINI_API_KEY_bceylannn,
  process.env['GEMINI_API_KEY_ogr.sakarya']
].filter(Boolean);

let currentKeyIndex = 0;

function getNextApiKey() {
  if (apiKeys.length === 0) {
    throw new Error("API anahtarı bulunamadı! Lütfen Render Environment Variables kısmını kontrol edin.");
  }
  
  const key = apiKeys[currentKeyIndex];
  const usedIndex = currentKeyIndex + 1; 
  
  // İndeksi bir sonraki anahtara kaydır (Başa sarar)
  currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
  
  return { key, number: usedIndex };
}

app.post('/optimize', async (req, res) => {
  try {
    // Sıradaki anahtarı al
    const keyData = getNextApiKey();
    console.log(`[İSTEK ALINDI] Kullanılan Key Havuzu: #${keyData.number} (Toplam: ${apiKeys.length})`);

    const googleApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${keyData.key}`;

    const response = await fetch(googleApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body) 
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`[API HATASI] Key #${keyData.number} hata verdi! Status: ${response.status}`);
      return res.status(response.status).json(data);
    }

    return res.json(data);

  } catch (error) {
    console.error("[SUNUCU HATASI]:", error.message);
    return res.status(500).json({ error: "Sunucu tarafında beklenmedik bir hata oluştu." });
  }
});

app.get('/', (req, res) => {
  res.send(`Resumatch Backend Aktif! Yüklü API Anahtarı Sayısı: ${apiKeys.length}`);
});

app.listen(PORT, () => {
  console.log(`🚀 Backend Sunucusu ${PORT} portunda başarıyla başlatıldı.`);
});