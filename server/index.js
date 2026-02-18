const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

if (!process.env.GEMINI_API_KEY) {
  console.error("HATA: GEMINI_API_KEY bulunamadı!");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// GÜNCELLEME 1: Model ismini standart "gemini-1.5-flash" yaptık.
// GÜNCELLEME 2: Güvenlik ayarlarını (safetySettings) ekledik ki CV'yi sansürlemesin.
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  safetySettings: [
    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
    { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
  ]
});

app.post('/optimize', async (req, res) => {
  try {
    const { contents, systemInstruction } = req.body;
    
    const result = await model.generateContent({
      contents,
      systemInstruction
    });

    const response = await result.response;
    const text = response.text();
    
    // JSON temizliği
    const cleanText = text.replace(/```json|```/g, '').trim();
    
    // Eğer cevap boşsa hata fırlat
    if (!cleanText) {
      throw new Error("AI boş cevap döndürdü (Güvenlik filtresi olabilir).");
    }

    res.json(JSON.parse(cleanText));

  } catch (error) {
    console.error("Optimize Hatası:", error);
    // Frontend'e hatayı net gönderelim
    res.status(500).json({ error: "CV oluşturulurken bir sorun oldu. Lütfen tekrar deneyin." });
  }
});

app.post('/interview', async (req, res) => {
  try {
    const { cvContent, jobDescription } = req.body;

    const prompt = `
      Sen deneyimli bir Teknik İşe Alım Uzmanısın.
      ADAYIN CV VERİSİ: ${cvContent}
      BAŞVURULAN İLAN: ${jobDescription}
      
      GÖREV: Bu aday için JSON formatında 3 teknik, 2 davranışsal mülakat sorusu hazırla.
      
      ÇIKTI FORMATI (JSON):
      {
        "technical": [{"question": "...", "tip": "..."}],
        "behavioral": [{"question": "...", "tip": "..."}]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
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
