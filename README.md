# 📄 Hazır CV - Yapay Zeka Destekli Profesyonel Kariyer Asistanı

[![Canlı Demo](https://img.shields.io/badge/Canl%C4%B1_Demo-hazircv.com.tr-blue?style=for-the-badge)](https://hazircv.com.tr)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Powered_by-Google_Gemini-8E75B2?style=for-the-badge)](https://deepmind.google/technologies/gemini/)

Hazır CV, iş başvuru sürecinin en çok vakit alan ve yorucu kısmını ortadan kaldırmak için tasarlanmış akıllı bir SaaS platformudur: **Her iş ilanı için ayrı CV hazırlama derdine son verir.** Yapay zeka gücünü kullanarak mevcut CV'nizi ve başvurmak istediğiniz iş ilanını analiz eder; saniyeler içinde o ilana özel, ATS (Aday Takip Sistemi) uyumlu ve yüksek düzeyde optimize edilmiş yeni bir özgeçmiş oluşturur.

## ✨ Temel Özellikler

* **🎯 Yapay Zeka ile İlana Özel Optimizasyon:** Mevcut CV'nizi (PDF) yükleyin ve iş ilanının metnini yapıştırın. Yapay zeka, orijinal deneyimlerinizi bozmadan işverenin aradığı yetkinlikleri öne çıkaracak şekilde CV'nizi yeniden yazar.
* **📊 ATS Uyumluluk Analizi:** Özgeçmişiniz hakkında anında şeffaf geri bildirim alın. Sistem size bir eşleşme skoru sunar, eksik yetkinliklerinizi (gaps) belirler ve CV'nize stratejik olarak eklenen anahtar kelimeleri listeler.
* **🎙️ İnteraktif Mülakat Simülasyonu:** Gerçek mülakata girmeden önce pratik yapın! İK Uzmanı veya Teknik Lider (Tech Lead) rolüne giren yapay zeka ile güncellenmiş CV'niz ve hedef iş ilanınız üzerinden sohbet tabanlı mülakat yapın. Süreç sonunda detaylı bir değerlendirme raporu alın.
* **🎨 Canlı Düzenleme ve Özelleştirme:** Oluşturulan CV üzerinde canlı olarak değişiklik yapın. Tek tıkla şablonları, renk paletini, metin hizalamasını ve anlatım dilini (1. Tekil veya 3. Tekil şahıs) dilediğiniz gibi değiştirin.
* **🖨️ Yüksek Kaliteli PDF Çıktısı:** Mükemmel hale getirdiğiniz CV'nizi hiçbir format ve stil kaybı yaşamadan anında baskıya hazır PDF olarak indirin.
* **🌍 Çoklu Dil Desteği:** İster Türkçe ister İngilizce dilinde anında profesyonel özgeçmişler tasarlayın.

## 🛠️ Kullanılan Teknolojiler

* **Frontend:** React.js, Vite, Tailwind CSS
* **İkonlar & UI:** Lucide React
* **Yapay Zeka Motoru:** Google Gemini Pro API (Özel backend üzerinden)
* **PDF İşleme:** `pdf.js` (Metin ayrıştırma), `html2canvas` & `jsPDF` (Yüksek kaliteli çıktı alma)
* **Hosting & Analitik:** Vercel

## 🚀 Nasıl Çalışır?

1. **Yükle:** Mevcut temel CV'nizi (PDF formatında) sisteme yükleyin.
2. **Hedefle:** Başvuracağınız iş ilanının metnini ilgili alana yapıştırın.
3. **Oluştur:** TR/EN tasarım butonuna tıklayın. Yapay zeka verileri işler ve saniyeler içinde size özel CV'yi oluşturur.
4. **İncele ve Düzenle:** ATS skorunuzu görün, analiz raporunu okuyun ve önizleme paneli üzerinden istediğiniz satırı canlı olarak düzenleyin.
5. **Pratik Yap:** İlana hazırlık için İK veya Teknik mülakat simülasyonunu başlatın.
6. **İndir:** Kusursuz hale getirdiğiniz CV'nizi PDF olarak dışa aktarın.

## 💻 Yerel Kurulum (Local Development)

Projeyi kendi bilgisayarınızda çalıştırmak için şu adımları izleyebilirsiniz:

1. Repoyu bilgisayarınıza klonlayın:
   ```bash
   git clone [https://github.com/KULLANICI_ADIN/resumatch.git](https://github.com/KULLANICI_ADIN/resumatch.git)
