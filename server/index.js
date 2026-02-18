const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = process.env.PORT || 3000;

// Limit: 50mb
app.use(express.json({ limit: '50mb' }));
app.use(cors());

if (!process.env.GEMINI_API_KEY) {
  console.error("KRİTİK HATA: GEMINI_API_KEY bulunamadı!");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Model: Senin hesabında çalışan versiyon
const model = genAI.getGenerativeModel({ 
  model: "gemini-flash-latest",
  // Güvenlik filtreleri kapalı
  safetySettings: [
    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
    { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
  ]
});

// --- YARDIMCI FONKSİYON: JSON TEMİZLEYİCİ ---
// Yapay zeka bazen "İşte JSON'un:" gibi yazılar ekler, bu fonksiyon onları temizler.
function cleanAndParseJSON(text) {
    try {
        // 1. Önce markdown temizliği
        let cleanText = text.replace(/```json|```/g, '').trim();
        
        // 2. İlk '{' karakterini ve son '}' karakterini bul
        const firstBrace = cleanText.indexOf('{');
        const lastBrace = cleanText.lastIndexOf('}');
        
        if (firstBrace !== -1 && lastBrace !== -1) {
            // Sadece süslü parantezlerin arasını al
            cleanText = cleanText.substring(firstBrace, lastBrace + 1);
        }
        
        return JSON.parse(cleanText);
    } catch (e) {
        console.error("JSON Parse Hatası:", e);
        throw new Error("AI geçerli bir JSON formatı üretmedi.");
    }
}

app.post('/optimize', async (req, res) => {
  try {
    const { contents, systemInstruction } = req.body;
    
    if (!contents) throw new Error("Veri gelmedi.");

    // Prompt Birleştirme
    let userPrompt = contents[0]?.parts?.[0]?.text || "";
    let systemPrompt = systemInstruction?.parts?.[0]?.text || "";
    const finalPrompt = `${systemPrompt}\n\n--------------------------------\n\n${userPrompt}`;

    console.log("Google'a İstek Gönderiliyor...");

    const result = await model.generateContent(finalPrompt);
    const response = await result.response;
    const text = response.text();
    
    console.log("Google Cevap Verdi (Raw Text alındı). JSON temizleniyor...");

    // TEMİZLEME FONKSİYONUNU KULLAN
    const jsonData = cleanAndParseJSON(text);
    
    console.log("✅ JSON Başarıyla Ayrıştırıldı ve Gönderiliyor!");
    res.json(jsonData);

  } catch (error) {
    console.error("❌ OPTIMIZE HATASI:", error.message);
    const errorMsg = error.response ? JSON.stringify(error.response, null, 2) : error.message;
    res.status(500).json({ error: `Sunucu Hatası: ${error.message}`, details: errorMsg });
  }
});

app.post('/interview', async (req, res) => {
  try {
    const { cvContent, jobDescription } = req.body;
    const prompt = `Sen bir İK uzmanısın. Şu CV ve İlan için 3 teknik, 2 davranışsal mülakat sorusu (JSON formatında) hazırla:\nCV: ${cvContent}\nİLAN: ${jobDescription}`;
    
    console.log("Mülakat İsteği...");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonData = cleanAndParseJSON(text);
    res.json(jsonData);

  } catch (error) {
    console.error("Mülakat Hatası:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server ${port} portunda çalışıyor...`);
});
