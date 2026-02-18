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

// DÜZELTME: SafetySettings (Güvenlik Ayarları) KALDIRILDI.
// 'gemini-flash-latest' gibi preview modeller bazen ayar gönderilince hata verir.
const model = genAI.getGenerativeModel({ 
  model: "gemini-flash-latest"
});

// 1. CV Optimize Etme Endpoint'i
app.post('/optimize', async (req, res) => {
  try {
    const { contents, systemInstruction } = req.body;
    
    // Güvenli veri ayıklama
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
    
    // Temizlik
    const cleanText = text.replace(/```json|```/g, '').trim();
    
    console.log("Cevap Alındı. Uzunluk:", cleanText.length);

    res.json(JSON.parse(cleanText));

  } catch (error) {
    console.error("--- OPTIMIZE HATASI ---");
    console.error(error.message);
    // Eğer Google'dan detaylı hata geldiyse onu da yaz
    if(error.response) console.error(JSON.stringify(error.response));
    
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
    
    console.log("Mülakat İsteği Gönderiliyor...");

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const cleanText = text.replace(/```json|```/g, '').trim();
    
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
