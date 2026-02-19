const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// Buraya Render'a eklediğin YENİ API KEY'ini tırnak içine yapıştır
const apiKey = process.env.GEMINI_API_KEY || "AIza..."; // Eğer .env yoksa, tırnak içine anahtarını yaz

const genAI = new GoogleGenerativeAI(apiKey);

async function checkAvailableModels() {
  try {
    console.log("🔍 Google'a soruluyor: 'Hangi modelleri kullanabilirim?'...");
    
    // Mevcut modelleri listele
    // Not: SDK versiyonuna göre bu metot farklılık gösterebilir, en garanti yol model listesini çekmektir.
    // Ancak basitlik adına önce bir bağlantı testi ve model listesi denemesi yapalım.
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Doğrudan model ismini değiştirmeyi deneyelim, belki "gemini-pro" hala aktiftir.
    console.log("👉 'gemini-pro' deneniyor...");
    const modelPro = genAI.getGenerativeModel({ model: "gemini-pro" });
    const resultPro = await modelPro.generateContent("Test mesajı");
    console.log("✅ gemini-pro ÇALIŞIYOR!");
    return;

  } catch (error) {
    console.error("❌ 'gemini-pro' da hata verdi:", error.message);
    
    try {
        console.log("👉 'gemini-1.0-pro' deneniyor...");
        const model10 = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
        await model10.generateContent("Test");
        console.log("✅ gemini-1.0-pro ÇALIŞIYOR!");
    } catch (err2) {
        console.error("❌ O da çalışmadı. Hesabında genel bir erişim sorunu olabilir.");
        console.error("Detay:", err2.message);
    }
  }
}

checkAvailableModels();