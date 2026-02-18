const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = process.env.PORT || 3000;

// GÜNCELLEME: Veri limitini artırdık (50mb). Büyük CV'ler artık patlamayacak.
app.use(express.json({ limit: '50mb' }));
app.use(cors());

// API Key kontrolü
if (!process.env.GEMINI_API_KEY) {
  console.error("KRİTİK HATA: GEMINI_API_KEY bulunamadı!");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Model ayarı
const model = genAI.getGenerativeModel({ 
  model: "gemini-flash-latest"
});

// 1. CV Optimize Etme Endpoint'i
app.post('/optimize', async (req, res) => {
  try {
    const { contents, systemInstruction } = req.body;
    
    // Veri güvenliği: Gelen verinin boş olmadığından emin olalım
    if (!contents) {
        throw new Error("Frontend'den 'contents' verisi gelmedi. PDF yüklenmemiş olabilir.");
    }

    // Promptları ayıkla
    let userPrompt = "";
    if (contents && contents[0] && contents[0].parts && contents[0].parts[0]) {
       userPrompt = contents[0].parts[0].text || "";
    }

    let systemPrompt = "";
    if (systemInstruction && systemInstruction.parts && systemInstruction.parts[0]) {
       systemPrompt = systemInstruction.parts[0].text || "";
    }

    // Google'a gönderilecek metni hazırla
    const finalPrompt = `${systemPrompt}\n\n--------------------------------\n\n${userPrompt}`;

    console.log(`Google'a İstek Atılıyor (Veri boyutu: ${finalPrompt.length} karakter)...`);

    const result = await model.generateContent(finalPrompt);
    const response = await result.response;
    const text = response.text();
    
    const cleanText = text.replace(/```json|```/g, '').trim();
    
    console.log("✅ Google Cevap Verdi!");

    res.json(JSON.parse(cleanText));

  } catch (error) {
    console.error("--- HATA DETAYI ---");
    // Hatanın en ince detayını konsola yaz
    console.error(error);
    
    // Hatayı Frontend'e gönder ki görebilelim
    const errorMessage = error.message || "Bilinmeyen bir sunucu hatası";
    const errorDetails = error.response ? JSON.stringify(error.response) : "";
    
    res.status(500).json({ 
        error: `Sunucu Hatası: ${errorMessage}`,
        details: errorDetails
    });
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
    console.error("Mülakat Hatası:", error.message);
    res.status(500).json({ error: `Mülakat Hatası: ${error.message}` });
  }
});

app.listen(port, () => {
  console.log(`Server ${port} portunda çalışıyor...`);
});
