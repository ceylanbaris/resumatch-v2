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
  console.error("KRİTİK HATA: GEMINI_API_KEY bulunamadı!");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// DÜZELTME BURADA: Senin hesabında çalışan 'gemini-flash-latest' modelini geri getirdik.
const model = genAI.getGenerativeModel({ 
  model: "gemini-flash-latest",
  safetySettings: [
    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
    { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
  ]
});

// 1. CV Optimize Etme Endpoint'i
app.post('/optimize', async (req, res) => {
  try {
    const { contents, systemInstruction } = req.body;
    
    // Güvenli veri ayıklama (Frontend ne gönderirse göndersin patlamaması için)
    let userPrompt = "";
    if (contents && contents[0] && contents[0].parts && contents[0].parts[0]) {
       userPrompt = contents[0].parts[0].text || "";
    }

    let systemPrompt = "";
    if (systemInstruction && systemInstruction.parts && systemInstruction.parts[0]) {
       systemPrompt = systemInstruction.parts[0].text || "";
    }

    // Google'a gönderilecek nihai metni birleştiriyoruz
    const finalPrompt = `${systemPrompt}\n\n--------------------------------\n\n${userPrompt}`;

    console.log("Google'a İstek Gönderiliyor (Optimize)...");

    const result = await model.generateContent(finalPrompt);
    const response = await result.response;
    const text = response.text();
    
    const cleanText = text.replace(/```json|```/g, '').trim();
    
    console.log("Cevap Başarıyla Alındı.");

    res.json(JSON.parse(cleanText));

  } catch (error) {
    console.error("--- OPTIMIZE HATASI ---");
    console.error(error.message); 
    // Detaylı hatayı loglayalım ki Render'da görebilelim
    if (error.response) console.error(JSON.stringify(error.response, null, 2));
    
    res.status(500).json({ error: "Sunucu hatası: İşlem başarısız oldu." });
  }
});

// 2. Mülakat Simülasyonu Endpoint'i
app.post('/interview', async (req, res) => {
  try {
    const { cvContent, jobDescription } = req.body;

    const prompt = `
      Sen deneyimli bir Teknik İşe Alım Uzmanısın.
      Aşağıdaki adayın CV'sini ve İş İlanını incele.
      
      ADAYIN CV VERİSİ:
      ${cvContent}
      
      BAŞVURULAN İLAN:
      ${jobDescription}
      
      GÖREV:
      Bu aday için JSON formatında 3 teknik, 2 davranışsal mülakat sorusu hazırla.
      
      ÇIKTI FORMATI (SADECE JSON):
      {
        "technical": [
          {"question": "Soru...", "tip": "İpucu..."}
        ],
        "behavioral": [
           {"question": "Soru...", "tip": "İpucu..."}
        ]
      }
    `;
    
    console.log("Google'a İstek Gönderiliyor (Interview)...");

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const cleanText = text.replace(/```json|```/g, '').trim();
    
    console.log("Mülakat Soruları Hazır.");
    
    res.json(JSON.parse(cleanText));

  } catch (error) {
    console.error("--- MÜLAKAT HATASI ---");
    console.error(error.message);
    res.status(500).json({ error: "Mülakat soruları üretilemedi." });
  }
});

app.listen(port, () => {
  console.log(`Server ${port} portunda çalışıyor...`);
});
