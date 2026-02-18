const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = process.env.PORT || 3000;

// Limit: 50mb (Büyük CV'ler için)
app.use(express.json({ limit: '50mb' }));
app.use(cors());

// API Key kontrolü
if (!process.env.GEMINI_API_KEY) {
  console.error("KRİTİK HATA: GEMINI_API_KEY bulunamadı!");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// MODEL SEÇİMİ:
// 'gemini-1.5-flash' en kararlı ve hızlı modeldir.
// Eğer bu 404 verirse, API Key'in bu modele yetkisi yok demektir.
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post('/optimize', async (req, res) => {
  try {
    const { contents, systemInstruction } = req.body;
    
    // Veri kontrolü
    if (!contents) throw new Error("Frontend'den veri gelmedi!");

    // Promptları ayıkla ve birleştir
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

    console.log(`Google'a istek gönderiliyor (${finalPrompt.length} karakter)...`);

    const result = await model.generateContent(finalPrompt);
    const response = await result.response;
    const text = response.text();
    
    const cleanText = text.replace(/```json|```/g, '').trim();
    
    console.log("✅ Başarılı cevap alındı.");
    res.json(JSON.parse(cleanText));

  } catch (error) {
    console.error("❌ HATA DETAYI:");
    console.error(error); // Render loglarına bas

    // Hatayı Frontend'e olduğu gibi gönder (Gizleme!)
    const errorMessage = error.message || "Bilinmeyen Hata";
    
    // Eğer Google'dan gelen özel bir hata kodu varsa onu da alalım
    let details = "";
    if (error.response) {
        details = JSON.stringify(error.response, null, 2);
    }

    res.status(500).json({ 
        error: `Sunucu Hatası: ${errorMessage}`,
        details: details
    });
  }
});

// Mülakat Endpoint'i
app.post('/interview', async (req, res) => {
  try {
    const { cvContent, jobDescription } = req.body;
    const prompt = `Sen bir İK uzmanısın. Şu CV ve İlan için 3 teknik, 2 davranışsal mülakat sorusu (JSON formatında) hazırla:\nCV: ${cvContent}\nİLAN: ${jobDescription}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const cleanText = text.replace(/```json|```/g, '').trim();
    
    res.json(JSON.parse(cleanText));
  } catch (error) {
    console.error("Mülakat Hatası:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server ${port} portunda çalışıyor...`);
});
