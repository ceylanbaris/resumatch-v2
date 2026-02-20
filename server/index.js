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
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let promptData = req.body.contents;
    
    if (req.body.systemInstruction && req.body.systemInstruction.parts) {
        const sysText = req.body.systemInstruction.parts[0].text;
        promptData = [
            { role: "user", parts: [{ text: `AŞAĞIDAKİ SİSTEM KOMUTLARINA KESİNLİKLE UY:\n${sysText}\n\n---\nKULLANICI VERİSİ:\n` }] },
            ...req.body.contents
        ];
    }

    // 🚨 1. ZORUNLULUK: Google'a sadece ve sadece "application/json" formatında yanıt vermesini emrediyoruz.
    let reqConfig = req.body.generationConfig || {};
    reqConfig.responseMimeType = "application/json";

    const result = await model.generateContent({
        contents: promptData,
        generationConfig: reqConfig
    });
    
    // 🚨 2. TEMİZLİK: Olur da Google yine "```json" gibi markdown işaretleri koyarsa, React çökmesin diye o işaretleri metinden siliyoruz.
    let responseText = result.response.text();
    responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

    return res.json({
        candidates: [{ content: { parts: [{ text: responseText }] } }]
    });

  } catch (error) {
    console.error("[SİSTEM HATASI]:", error.message);
    return res.status(500).json({ error: error.message });
  }
});

app.get('/', (req, res) => res.send("🚀 Resumatch Backend Kusursuz Çalışıyor!"));

app.listen(PORT, () => console.log(`🚀 Sunucu ${PORT} portunda başlatıldı.`));
