require('dotenv').config();
const express = require('express');
const cors = require('cors');
// fetch satırını sildik, çünkü dinamik import yapacağız veya native fetch kullanacağız.

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Resumatch Backend Çalışıyor! 🚀');
});

app.post('/api/optimize', async (req, res) => {
  try {
    const { contents, systemInstruction } = req.body;

    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "API Key bulunamadı!" });
    }

    console.log("Gemini'ye istek atılıyor...");

    // fetch fonksiyonunu dinamik olarak yüklüyoruz (Hata çözümü burada!)
    const fetch = await import('node-fetch').then(mod => mod.default);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          systemInstruction,
          generationConfig: { responseMimeType: "application/json" }
        })
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
        console.error("Gemini Hatası:", data);
        return res.status(response.status).json(data);
    }

    console.log("Başarılı yanıt alındı! ✅");
    res.json(data);

  } catch (error) {
    console.error("Sunucu Hatası:", error);
    res.status(500).json({ error: "Sunucu tarafında işlem başarısız." });
  }
});

app.listen(PORT, () => console.log(`🚀 Server ${PORT} portunda ateşlendi!`));