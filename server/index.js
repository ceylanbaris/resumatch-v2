const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' })); 

app.post('/optimize', async (req, res) => {
  try {
    // Sadece Render'a az önce eklediğin temiz anahtarı alıyoruz
    const rawKey = process.env.GEMINI_API_KEY;
    
    if (!rawKey) {
      return res.status(500).json({ error: "Backend'de API Anahtarı bulunamadı. Lütfen Render ayarlarını kontrol edin." });
    }

    // Olası boşluk ve tırnak hatalarını siliyoruz
    const cleanKey = rawKey.replace(/['"]/g, '').trim();
    console.log(`[İSTEK BAŞLADI] API Anahtarı kullanılıyor (Sonu: ...${cleanKey.slice(-4)})`);

    const genAI = new GoogleGenerativeAI(cleanKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // React'tan gelen verileri Google'ın anlayacağı en güvenli formata çeviriyoruz
    let promptData = req.body.contents;
    if (req.body.systemInstruction && req.body.systemInstruction.parts) {
        const sysText = req.body.systemInstruction.parts[0].text;
        promptData = [
            { role: "user", parts: [{ text: `AŞAĞIDAKİ SİSTEM KOMUTLARINA KESİNLİKLE UY:\n${sysText}\n\n---\nKULLANICI VERİSİ:\n` }] },
            ...req.body.contents
        ];
    }

    // Google'a gönderiyoruz
    const result = await model.generateContent({
        contents: promptData,
        generationConfig: req.body.generationConfig || {}
    });

    console.log("[BAŞARILI] İşlem tamamlandı, veriler React'a gönderiliyor!");
    
    return res.json({
        candidates: [{ content: { parts: [{ text: result.response.text() }] } }]
    });

  } catch (error) {
    console.error(`[SİSTEM HATASI]:`, error.message);
    
    // Eğer Google yine hesabını engellerse (404), bu kez ekranda [Object object] yerine bu Türkçe yazıyı göreceksin:
    if (error.message.includes('404')) {
        return res.status(500).json({ 
            error: "Google, kullandığınız API anahtarına (Hesaba) erişim izni vermiyor. Lütfen okul hesabı yerine kişisel bir Gmail hesabı ile API şifresi alın." 
        });
    }
    
    return res.status(500).json({ error: error.message || "Bilinmeyen bir hata oluştu." });
  }
});

app.get('/', (req, res) => {
  res.send("🚀 Resumatch Backend Kusursuz Çalışıyor!");
});

app.listen(PORT, () => {
  console.log(`🚀 Backend Sunucusu ${PORT} portunda başlatıldı.`);
});
