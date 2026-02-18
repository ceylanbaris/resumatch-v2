require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basit bir test rotası (Tarayıcıdan girince çalışıp çalışmadığını anlamak için)
app.get('/', (req, res) => {
  res.send('Resumatch Backend Çalışıyor! (v2)');
});

// --- KRİTİK KISIM: OPTIMIZE ROTASI ---
// Frontend bu adrese istek atıyor: /optimize
app.post('/optimize', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "API Key bulunamadı. Environment variable'ları kontrol edin." });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // Model ismini 'gemini-pro' veya 'gemini-1.5-flash' olarak kullanabilirsin
// Listende açıkça görünen, en kararlı ve hızlı model bu:
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const { contents, systemInstruction } = req.body;

    // Prompt'u birleştiriyoruz (System instruction + User content)
    let fullPrompt = "";
    if (systemInstruction && systemInstruction.parts) {
        fullPrompt += systemInstruction.parts[0].text + "\n\n";
    }
    if (contents && contents[0] && contents[0].parts) {
        fullPrompt += contents[0].parts[0].text;
    }

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    res.json({ candidates: [{ content: { parts: [{ text: text }] } }] });

  } catch (error) {
    console.error("Backend Hatası:", error);
    res.status(500).json({ error: error.message || "Sunucu tarafında bir hata oluştu." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});