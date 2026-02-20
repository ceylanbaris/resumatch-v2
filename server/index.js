const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' })); 

// 🚨 1. KESİN TEŞHİS ENDPOINT'İ (React'ı tamamen devre dışı bırakıp test edeceğiz)
app.get('/test-api', async (req, res) => {
  try {
    const rawKey = process.env.GEMINI_API_KEY;
    if (!rawKey) return res.send("<h1>HATA:</h1><p>Render'da GEMINI_API_KEY bulunamadı!</p>");

    const cleanKey = rawKey.replace(/['"]/g, '').trim();
    const genAI = new GoogleGenerativeAI(cleanKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // React'tan bağımsız, sadece sunucu üzerinden basit bir "Merhaba" yolluyoruz
    const result = await model.generateContent("Merhaba, sistem çalışıyor mu? Kısa cevap ver.");
    res.send(`<h1>🎉 BAŞARILI! API KUSURSUZ ÇALIŞIYOR:</h1><p>${result.response.text()}</p>`);
  } catch (error) {
    res.send(`<h1>🚨 API HATASI:</h1><p>${error.message}</p>`);
  }
});

// 2. ANA UYGULAMA ENDPOINT'İ (Orijinal hatayı gizlemeden ekrana basacak şekilde güncelledik)
app.post('/optimize', async (req, res) => {
  try {
    const cleanKey = process.env.GEMINI_API_KEY.replace(/['"]/g, '').trim();
    const genAI = new GoogleGenerativeAI(cleanKey);

    // React'tan gelen verileri doğrudan modele veriyoruz
    const modelConfig = { model: "gemini-1.5-flash" };
    if (req.body.systemInstruction) {
        modelConfig.systemInstruction = req.body.systemInstruction;
    }

    const model = genAI.getGenerativeModel(modelConfig);

    const result = await model.generateContent({
        contents: req.body.contents,
        generationConfig: req.body.generationConfig || {}
    });

    return res.json({
        candidates: [{ content: { parts: [{ text: result.response.text() }] } }]
    });

  } catch (error) {
    console.error("[SİSTEM HATASI]:", error);
    // Artık o Türkçe mesajı kaldırdık, Google'ın orijinal hatasını harfi harfine React'a yolluyoruz.
    return res.status(500).json({ error: error.message || "Bilinmeyen API Hatası" });
  }
});

app.get('/', (req, res) => res.send("🚀 Backend Aktif! Test için URL sonuna /test-api yazın."));

app.listen(PORT, () => console.log(`🚀 Sunucu ${PORT} portunda başlatıldı.`));
