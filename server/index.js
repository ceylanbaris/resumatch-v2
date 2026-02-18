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

// GÜVENLİK FİLTRELERİNİ KAPATAN MODEL AYARI
// Not: Model ismini en standart 'gemini-1.5-flash' olarak tutuyoruz.
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
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
    
    // --- DÜZELTME BAŞLANGICI ---
    // Frontend'den gelen karmaşık nesneleri basit metne çeviriyoruz.
    // Bu sayede "systemInstruction parametresi desteklenmiyor" hatasından kaçınıyoruz.
    
    let userPrompt = "";
    if (contents && contents[0] && contents[0].parts && contents[0].parts[0]) {
       userPrompt = contents[0].parts[0].text;
    }

    let systemPrompt = "";
    if (systemInstruction && systemInstruction.parts && systemInstruction.parts[0]) {
       systemPrompt = systemInstruction.parts[0].text;
    }

    // İkisini tek bir dev metin olarak birleştiriyoruz (En garanti yöntem)
    const finalPrompt = `${systemPrompt}\n\n--------------------------------\n\n${userPrompt}`;

    console.log("Google'a İstek Gönderiliyor...");

    const result = await model.generateContent(finalPrompt);
    const response = await result.response;
    const text = response.text();
    
    // JSON temizleme
    const cleanText = text.replace(/```json|```/g, '').trim();
    
    console.log("Google Cevap Verdi. Yanıt uzunluğu:", cleanText.length);

    res.json(JSON.parse(cleanText));

  } catch (error) {
    console.error("--- OPTIMIZE HATASI ---");
    console.error(error); // Hatanın tamamını loglara bas
    res.status(500).json({ error: "İşlem başarısız oldu. Sunucu hatası." });
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

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const cleanText = text.replace(/```json|```/g, '').trim();
    
    res.json(JSON.parse(cleanText));

  } catch (error) {
    console.error("--- MÜLAKAT HATASI ---");
    console.error(error);
    res.status(500).json({ error: "Mülakat soruları üretilemedi." });
  }
});

app.listen(port, () => {
  console.log(`Server ${port} portunda çalışıyor...`);
});
