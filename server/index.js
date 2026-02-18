const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = process.env.PORT || 3000;

// 1. LİMİT ARTIRIMI: Büyük CV'ler için limiti 50mb yaptık.
app.use(express.json({ limit: '50mb' }));
app.use(cors());

if (!process.env.GEMINI_API_KEY) {
  console.error("KRİTİK HATA: GEMINI_API_KEY bulunamadı!");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 2. MODEL DÜZELTMESİ: Senin hesabında çalışan 'latest' modeline döndük.
// Güvenlik filtrelerini (SafetySettings) kapattık ki CV'leri engellemesin.
const model = genAI.getGenerativeModel({ 
  model: "gemini-flash-latest",
  safetySettings: [
    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
    { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
  ]
});

// --- OPTIMIZE ENDPOINT ---
app.post('/optimize', async (req, res) => {
  try {
    const { contents, systemInstruction } = req.body;
    
    if (!contents) throw new Error("Veri gelmedi (Payload boş).");

    // 3. PROMPT BİRLEŞTİRME: Sistem ve Kullanıcı mesajını tek metin yapıyoruz.
    // Bu yöntem 'latest' modellerde en az hatayı verir.
    
    let userPrompt = "";
    if (contents && contents[0]?.parts?.[0]) {
       userPrompt = contents[0].parts[0].text || "";
    }

    let systemPrompt = "";
    if (systemInstruction?.parts?.[0]) {
       systemPrompt = systemInstruction.parts[0].text || "";
    }

    const finalPrompt = `${systemPrompt}\n\n--------------------------------\n\n${userPrompt}`;

    console.log(`Google'a İstek Gönderiliyor (${finalPrompt.length} karakter)...`);

    const result = await model.generateContent(finalPrompt);
    const response = await result.response;
    const text = response.text();
    
    // JSON Temizliği
    const cleanText = text.replace(/```json|```/g, '').trim();
    
    console.log("✅ Google Cevap Verdi!");

    res.json(JSON.parse(cleanText));

  } catch (error) {
    console.error("❌ OPTIMIZE HATASI:", error.message);
    
    // Hatayı Frontend'e olduğu gibi yansıt (Gizleme)
    const errorMsg = error.response 
        ? JSON.stringify(error.response, null, 2) 
        : error.message;
        
    res.status(500).json({ 
        error: `Sunucu Hatası: ${error.message}`, 
        details: errorMsg 
    });
  }
});

// --- INTERVIEW ENDPOINT ---
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
    console.error("❌ MÜLAKAT HATASI:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server ${port} portunda çalışıyor...`);
});
