// debug.js
// Bu script kütüphane kullanmadan direkt Google sunucusuna bağlanır.
// Node.js v18 ve üzeri gerektirir (Sende v24 var, sorunsuz çalışır).

const apiKey = "AIzaSyBCKPvK3HMZIsF4nEoMpEQcM556yHmvsuY"; 

async function listModelsDirectly() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  
  console.log("📡 Google Sunucusuna Bağlanılıyor...");
  
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (response.status === 200) {
      console.log("✅ BAŞARILI! İşte kullanabileceğin modellerin listesi:\n");
      if (data.models) {
        data.models.forEach(m => {
          // Sadece 'generateContent' özelliğini destekleyenleri görelim
          if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
            console.log(`🔹 Model Adı: ${m.name.replace("models/", "")}`);
          }
        });
        console.log("\n👉 Yukarıdaki listeden birini seçip kodumuza yazacağız.");
      } else {
        console.log("⚠️ Liste boş döndü. Bu API anahtarının yetkisi yok.");
      }
    } else {
      console.error("❌ HATA OLUŞTU! Durum Kodu:", response.status);
      console.error("Hata Detayı:", JSON.stringify(data, null, 2));
      console.log("\n💡 İPUCU: Eğer 400 hatası alıyorsan API Key geçersizdir.");
    }
  } catch (error) {
    console.error("Bağlantı Hatası:", error);
  }
}

listModelsDirectly();