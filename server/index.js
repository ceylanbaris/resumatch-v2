const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API Key kontrolü
if (!process.env.GEMINI_API_KEY) {
  console.error("HATA: GEMINI_API_KEY .env dosyasında bulunamadı!");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Senin hesabında çalışan en güncel ve hızlı model
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

// 1. CV Optimize Etme Endpoint'i
app.post('/optimize', async (req, res) => {
  try {
    const { contents, systemInstruction } = req.body;
    
    // Google AI'a istek at
    const result = await model.generateContent({
      contents,
      systemInstruction
    });

    const response = await result.response;
    const text = response.text();
    
    // JSON temizleme (Markdown işaretlerini kaldırır)
    const cleanText = text.replace(/```json|```/g, '').trim();

    // JSON formatında gönder
    res.json(JSON.parse(cleanText));

  } catch (error) {
    console.error("Hata Detayı:", error);
    res.status(500).json({ error: "İşlem sırasında bir hata oluştu." });
  }
});

// 2. (YENİ) Mülakat Simülasyonu Endpoint'i
app.post('/interview', async (req, res) => {
  try {
    const { cvContent, jobDescription } = req.body;

    const prompt = `
      Sen deneyimli bir Teknik İşe Alım Uzmanısın (Recruiter).
      
      ADAYIN CV VERİSİ (JSON):
      ${cvContent}
      
      BAŞVURULAN İLAN:
      ${jobDescription}
      
      GÖREVİN:
      Bu adayın bu ilana başvurusu için nokta atışı bir mülakat simülasyonu hazırla.
      Genel geçer sorular sorma. Adayın CV'sindeki projelere ve İlandaki teknolojilere (stack) odaklan.
      
      ÇIKTI FORMATI (SADECE JSON):
      {
        "technical": [
          {"question": "Teknik Soru 1", "tip": "Bu soruyu cevaplarken CV'ndeki şu projeden bahset..."},
          {"question": "Teknik Soru 2", "tip": "İlandaki şu teknoloji hakkında bilgi ver..."}
          // Toplam 3 teknik soru
        ],
        "behavioral": [
           {"question": "Davranışsal Soru 1", "tip": "STAR tekniği ile şu durumu anlat..."},
           {"question": "Davranışsal Soru 2", "tip": "Ekip çalışması vurgusu yap..."}
           // Toplam 2 davranışsal soru
        ]
      }
      
      KURALLAR:
      1. Sadece JSON döndür. Markdown kullanma.
      2. Dili Türkçe olsun.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // JSON Temizleme
    const cleanText = text.replace(/```json|```/g, '').trim();
    
    res.json(JSON.parse(cleanText));

  } catch (error) {
    console.error("Mülakat Hatası:", error);
    res.status(500).json({ error: "Mülakat soruları üretilemedi." });
  }
});

app.listen(port, () => {
  console.log(`Server ${port} portunda çalışıyor...`);
});