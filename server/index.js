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
    const rawKey = process.env.GEMINI_API_KEY;
    if (!rawKey) return res.status(500).json({ error: "Backend'de API Anahtarı bulunamadı." });

    const cleanKey = rawKey.replace(/['"]/g, '').trim();
    const genAI = new GoogleGenerativeAI(cleanKey);
    
    // 🏆 İŞTE ZAFER SATIRI: Silinen 1.5 modeli yerine yepyeni 'gemini-2.5-flash' modeline geçtik!
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let promptData = req.body.contents;
    
    // React'tan gelen komutları yeni modelin de anlayacağı mükemmel formata çeviriyoruz
    if (req.body.systemInstruction && req.body.systemInstruction.parts) {
        const sysText = req.body.systemInstruction.parts[0].text;
        promptData = [
            { role: "user", parts: [{ text: `AŞAĞIDAKİ SİSTEM KOMUTLARINA KESİNLİKLE UY:\n${sysText}\n\n---\nKULLANICI VERİSİ:\n` }] },
            ...req.body.contents
        ];
    }

    const result = await model.generateContent({
        contents: promptData,
        generationConfig: req.body.generationConfig || {}
    });
    
    return res.json({
        candidates: [{ content: { parts: [{ text: result.response.text() }] } }]
    });

  } catch (error) {
    console.error("[SİSTEM HATASI]:", error.message);
    return res.status(500).json({ error: error.message });
  }
});

app.get('/', (req, res) => res.send("🚀 Resumatch Backend Kusursuz Çalışıyor!"));

app.listen(PORT, () => console.log(`🚀 Sunucu ${PORT} portunda başlatıldı.`));
