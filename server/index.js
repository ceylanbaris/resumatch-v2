const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// 🚨 Render gibi sistemlerde IP adresini doğru okumak için bu ayar şarttır
app.set('trust proxy', 1);

app.use(cors());
app.use(express.json({ limit: '50mb' })); 

// --- 🛡️ GÜVENLİK DUVARI (RATE LIMITER) ---
// Herhangi bir dış paket kurmadan kendi hafızamızda tuttuğumuz koruma sistemi
const ipRequestCounts = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 Saat (Milisaniye cinsinden)
const MAX_REQUESTS = 20; // 1 Saatte aynı IP'nin en fazla üretebileceği CV sayısı

const rateLimiter = (req, res, next) => {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const now = Date.now();

  if (!ipRequestCounts.has(ip)) {
    ipRequestCounts.set(ip, { count: 1, startTime: now });
    return next();
  }

  const record = ipRequestCounts.get(ip);
  
  // Eğer 1 saat dolduysa, sayacı sıfırla
  if (now - record.startTime > RATE_LIMIT_WINDOW_MS) {
    ipRequestCounts.set(ip, { count: 1, startTime: now });
    return next();
  }

  // Sınır aşıldıysa sistemi ve cüzdanını koru, işlemi reddet
  if (record.count >= MAX_REQUESTS) {
    return res.status(429).json({ 
      error: "Güvenlik sebebiyle saatlik CV oluşturma limitinize ulaştınız. Lütfen 1 saat sonra tekrar deneyin." 
    });
  }

  // Sınır aşılmadıysa sayacı artır ve devam et
  record.count += 1;
  next();
};

// --- 🚀 ANA API ENDPOINT'İ (Güvenlik Duvarı Aktif) ---
// rateLimiter middleware'ini araya koyduk
app.post('/optimize', rateLimiter, async (req, res) => {
  try {
    const rawKey = process.env.GEMINI_API_KEY;
    if (!rawKey) return res.status(500).json({ error: "Sunucuda API Anahtarı bulunamadı." });

    const cleanKey = rawKey.replace(/['"]/g, '').trim();
    const genAI = new GoogleGenerativeAI(cleanKey);
    
    // Limitsiz ve güçlü modelimiz
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let promptData = req.body.contents;
    
    if (req.body.systemInstruction && req.body.systemInstruction.parts) {
        const sysText = req.body.systemInstruction.parts[0].text;
        promptData = [
            { role: "user", parts: [{ text: `AŞAĞIDAKİ SİSTEM KOMUTLARINA KESİNLİKLE UY:\n${sysText}\n\n---\nKULLANICI VERİSİ:\n` }] },
            ...req.body.contents
        ];
    }

    let reqConfig = req.body.generationConfig || {};
    reqConfig.responseMimeType = "application/json";

    const result = await model.generateContent({
        contents: promptData,
        generationConfig: reqConfig
    });
    
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

app.get('/', (req, res) => res.send("🚀 Resumatch Güvenlik Duvarlı Backend Aktif!"));

app.listen(PORT, () => console.log(`🚀 Sunucu ${PORT} portunda başlatıldı.`));
