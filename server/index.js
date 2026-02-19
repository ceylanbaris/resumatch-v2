const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' })); 

// 🚨 HAYAT KURTARAN DÜZELTME: .map(key => key.trim()) 
// Bu kod, Render'a kopyalarken yanlışlıkla eklenen görünmez boşlukları ve enter'ları silerek linkin bozulmasını engeller.
const apiKeys = [
  process.env.GEMINI_API_KEY_bcey2603,
  process.env.GEMINI_API_KEY_bceylannn,
  process.env['GEMINI_API_KEY_ogr.sakarya']
].filter(Boolean).map(key => key.trim());

let currentKeyIndex = 0;

function getNextApiKey() {
  if (apiKeys.length === 0) {
    return null;
  }
  const key = apiKeys[currentKeyIndex];
  const usedIndex = currentKeyIndex + 1; 
  
  // İndeksi bir sonraki anahtara kaydır (Başa sarar)
  currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
  
  return { key, number: usedIndex };
}

app.post('/optimize', async (req, res) => {
  try {
    const keyData = getNextApiKey();
    
    if (!keyData) {
      return res.status(500).json({ error: "Sunucuda API anahtarı bulunamadı. Lütfen Render ayarlarını kontrol edin." });
    }

    console.log(`[İSTEK ALINDI] Kullanılan Key Havuzu: #${keyData.number} (Toplam: ${apiKeys.length})`);

    const googleApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${keyData.key}`;

    const response = await fetch(googleApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body) 
    });

    // Eğer Google bir hata gönderirse, konsolda tam sebebini görebilmek için datayı yakalıyoruz.
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      console.error(`[API HATASI] Key #${keyData.number} Google'dan HATA aldı! Status: ${response.status}`, data);
      return res.status(response.status).json(data || { error: "Bilinmeyen Google API Hatası" });
    }

    console.log(`[BAŞARILI] Key #${keyData.number} ile işlem kusursuz tamamlandı!`);
    return res.json(data);

  } catch (error) {
    console.error("[SUNUCU HATASI]:", error.message);
    return res.status(500).json({ error: "Sunucu tarafında beklenmedik bir hata oluştu." });
  }
});

// Sunucunun durumunu test etmek için kök dizin
app.get('/', (req, res) => {
  res.send(`🚀 Resumatch Backend Aktif! Yüklü Temiz API Anahtarı Sayısı: ${apiKeys.length}`);
});

app.listen(PORT, () => {
  console.log(`🚀 Backend Sunucusu ${PORT} portunda başarıyla başlatıldı.`);
});
