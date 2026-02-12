import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  Briefcase, 
  Sparkles, 
  Copy, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  Upload, 
  FileCheck,
  ShieldCheck,
  User,
  Camera,
  Edit3,
  Download,
  Linkedin,
  Palette,
  Move,
  ZoomIn,
  Mail,
  Phone,
  MapPin,
  Globe,
  TrendingUp,
  Check,
  AlertTriangle,
  PlusCircle,
  BarChart3,
  Plus,
  Wand2,
  Square,
  Circle,
  Link as LinkIcon, 
  Trash2,
  LayoutTemplate,
  AlignLeft,
  AlignCenter,
  Layout,
  ExternalLink,
  PenTool,
  Smile,
  Settings2,
  XCircle,
  Lightbulb
} from 'lucide-react';

 // Runtime provides the key

const App = () => {
  const [originalCV, setOriginalCV] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [optimizedData, setOptimizedData] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [themeColor, setThemeColor] = useState('#1e3a8a'); 
  const [cvLanguage, setCvLanguage] = useState('tr'); 
  const [activeTemplate, setActiveTemplate] = useState('modern');
  const [narrativeVoice, setNarrativeVoice] = useState('first');
  const [showIcons, setShowIcons] = useState(true); 
    
  const [sectionsOrder, setSectionsOrder] = useState(['summary', 'experience', 'education', 'skills', 'additional']);
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  const subDragItem = useRef(null);
  const subDragOverItem = useRef(null);

  const [photoShape, setPhotoShape] = useState('rounded-lg');
  const [addItemSection, setAddItemSection] = useState('experience');
  const [addItemInput, setAddItemInput] = useState('');
  const [isAddingItem, setIsAddingItem] = useState(false);

  const [photoZoom, setPhotoZoom] = useState(1);
  const [photoPos, setPhotoPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const fileInputRef = useRef(null);
  const photoInputRef = useRef(null);
  const resumeRef = useRef(null);
    
  const linkedinRef = useRef(null);
  const emailRef = useRef(null);

  const translations = {
    tr: {
      summary: "Kişisel Özet",
      experience: "İş Deneyimi",
      education: "Eğitim",
      skills: "Teknik Yetenekler",
      additional: "Ek Bilgiler",
      location: "Lokasyon",
      phone: "Telefon",
      email: "E-posta",
      profil: "linkedin.com/in/profil-linki",
      analysisTitle: "ATS Uyumluluk ve Analiz Raporu",
      scoreBefore: "Başlangıç Uyumu",
      scoreAfter: "Optimize Uyum",
      matches: "Eşleşen Kriterler",
      gaps: "Eksikler & Gelişim Alanları",
      added: "İlana Göre Eklenen Stratejik Kelimeler",
      addItemTitle: "Eksik Bilgi / Yeni Madde Ekle",
      addItemDesc: "Eklemek istediğiniz bilgiyi basitçe yazın, yapay zeka profesyonelce CV'nize yerleştirsin.",
      addBtn: "AI ile Profesyonelleştir ve Ekle"
    },
    en: {
      summary: "Professional Summary",
      experience: "Work Experience",
      education: "Education",
      skills: "Technical Skills",
      additional: "Additional Information",
      location: "Location",
      phone: "Phone",
      email: "Email",
      profil: "linkedin.com/in/profile-link",
      analysisTitle: "ATS Analysis & Compatibility Report",
      scoreBefore: "Initial Match",
      scoreAfter: "Optimized Match",
      matches: "Matching Criteria",
      gaps: "Gaps & Recommendations",
      added: "Strategically Added Keywords",
      addItemTitle: "Add Missing Info / New Item",
      addItemDesc: "Simply write what you want to add, AI will professionally place it in your CV.",
      addBtn: "Professionalize & Add with AI"
    }
  };

  const sectionOptions = [
    { id: 'summary', labelTr: 'Kişisel Özet', labelEn: 'Professional Summary' },
    { id: 'experience', labelTr: 'İş Deneyimi', labelEn: 'Work Experience' },
    { id: 'education', labelTr: 'Eğitim', labelEn: 'Education' },
    { id: 'skills', labelTr: 'Teknik Yetenekler', labelEn: 'Technical Skills' },
    { id: 'additional', labelTr: 'Ek Bilgiler', labelEn: 'Additional Info' },
  ];

  const templateOptions = [
    { id: 'modern', name: 'Modern', icon: <Layout className="w-5 h-5" />, desc: 'Dengeli' },
    { id: 'classic', name: 'Klasik', icon: <AlignCenter className="w-5 h-5" />, desc: 'Ortalı & Serif' },
    { id: 'professional', name: 'Profesyonel', icon: <AlignLeft className="w-5 h-5" />, desc: 'Sol Başlıklı' },
  ];

  const shapeOptions = [
    { id: 'rounded-none', label: 'Kare', iconClass: 'rounded-none' },
    { id: 'rounded-lg', label: 'Oval Köşe', iconClass: 'rounded-md' },
    { id: 'rounded-full', label: 'Yuvarlak', iconClass: 'rounded-full' },
  ];

  const colorPresets = [
    { name: 'Lacivert', hex: '#1e3a8a' },
    { name: 'Füme', hex: '#374151' },
    { name: 'Koyu Yeşil', hex: '#14532d' },
    { name: 'Bordo', hex: '#7f1d1d' },
    { name: 'Mürdüm', hex: '#581c87' },
    { name: 'Petrol', hex: '#164e63' },
    { name: 'Kahve', hex: '#451a03' },
    { name: 'Siyah', hex: '#171717' },
  ];

  const toUpper = (text) => {
    return text ? text.toLocaleUpperCase(cvLanguage === 'tr' ? 'tr-TR' : 'en-US') : "";
  };

  useEffect(() => {
    const scripts = [
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js', id: 'pdfjs' },
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js', id: 'html2canvas' },
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js', id: 'jspdf' }
    ];

    scripts.forEach(s => {
      if (!document.getElementById(s.id)) {
        const script = document.createElement('script');
        script.src = s.src;
        script.id = s.id;
        if (s.id === 'pdfjs') {
          script.onload = () => {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          };
        }
        document.head.appendChild(script);
      }
    });
  }, []);

  const extractTextFromPdf = async (file) => {
    setIsPdfLoading(true);
    setError(null);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        fullText += textContent.items.map(item => item.str).join(" ") + "\n";
      }
      setOriginalCV(fullText.trim());
    } catch (err) {
      setError("PDF okunurken hata oluştu.");
    } finally {
      setIsPdfLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file?.type === "application/pdf") extractTextFromPdf(file);
    else setError("Lütfen bir PDF dosyası seçin.");
  };

  const clearPdfData = () => {
    setOriginalCV('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target.result);
        setPhotoZoom(1);
        setPhotoPos({ x: 0, y: 0 });
      };
      reader.readAsDataURL(file);
    } else {
      setError("Lütfen geçerli bir resim dosyası seçin.");
    }
  };

  const handlePhotoMouseDown = (e) => {
    if (!profileImage) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - photoPos.x, y: e.clientY - photoPos.y });
  };

  const handlePhotoMouseMove = (e) => {
    if (!isDragging) return;
    setPhotoPos({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handlePhotoMouseUp = () => setIsDragging(false);

  const handlePhotoWheel = (e) => {
    if (!profileImage) return;
    e.preventDefault();
    const zoomStep = 0.05;
    setPhotoZoom(prev => Math.max(0.1, Math.min(3, prev + (e.deltaY < 0 ? zoomStep : -zoomStep))));
  };

  const updateField = (field, value) => {
    if (field === 'summary') {
        const key = narrativeVoice === 'first' ? 'summary_v1' : 'summary_v3';
        setOptimizedData(prev => ({ ...prev, [key]: value }));
    } else {
        setOptimizedData(prev => ({ ...prev, [field]: value }));
    }
  };

  const updateArrayField = (section, index, field, value) => {
    setOptimizedData(prev => {
      const newArray = [...prev[section]];
      newArray[index] = { ...newArray[index], [field]: value };
      return { ...prev, [section]: newArray };
    });
  };

  const updateBulletPoint = (section, sectionIndex, bulletIndex, value) => {
    const bulletsKey = narrativeVoice === 'first' ? 'bullets_v1' : 'bullets_v3';
     
    setOptimizedData(prev => {
      const newArray = [...prev[section]];
      const targetBullets = newArray[sectionIndex][bulletsKey] ? [...newArray[sectionIndex][bulletsKey]] : [...newArray[sectionIndex].bullets];
      targetBullets[bulletIndex] = value;
      newArray[sectionIndex] = { ...newArray[sectionIndex], [bulletsKey]: targetBullets };
      return { ...prev, [section]: newArray };
    });
  };

  const updateSimpleList = (section, index, value) => {
    setOptimizedData(prev => {
      const newArray = [...prev[section]];
      newArray[index] = value;
      return { ...prev, [section]: newArray };
    });
  };

 const callGeminiApi = async (payload, retries = 3, backoff = 1000) => {
  // Backend adresimiz (Lokalde çalışırken)
 const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  try {
    const response = await fetch(`${API_URL}/api/optimize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: payload.contents,
        systemInstruction: payload.systemInstruction
      })
    });

    if (!response.ok) {
       const errData = await response.json();
       throw new Error(errData.error || `API Hatası: ${response.statusText}`);
    }

    const data = await response.json();
    return data;

  } catch (err) {
    console.error("API Bağlantı Hatası:", err);
    if (retries > 0) {
       console.log(`Tekrar deneniyor... (${retries} hak kaldı)`);
       await new Promise(resolve => setTimeout(resolve, backoff));
       return callGeminiApi(payload, retries - 1, backoff * 2);
    }
    throw err;
  }
};

  const handleOptimize = async (lang) => {
    if (!originalCV || !jobDescription) {
      setError('Lütfen CV PDF\'inizi yükleyin ve iş ilanını girin.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setCvLanguage(lang);

    const langText = lang === 'tr' ? 'TÜRKÇE' : 'İNGİLİZCE';
    const systemPrompt = `Sen profesyonel bir İK ve ATS uzmanısın. Kullanıcının CV'sini iş ilanına göre uyarla.
    
    ÖNEMLİ: Çıktı JSON'unda hem "1. Tekil Şahıs" (Ben yaptım, Yürüttüm) hem de "3. Tekil Şahıs" (Yaptı, Yürütüldü) versiyonlarını AYRI AYRI oluşturmalısın. Bu sayede kullanıcı arayüzde anlık geçiş yapabilecek.

    ÇIKTI FORMATI: Mutlaka geçerli bir JSON objesi döndür.
    JSON Şeması:
    {
      "name": "Kişinin Adı",
      "title": "Hedeflenen Pozisyon Ünvanı",
      "location": "Şehir, Ülke",
      "phone": "Telefon Numarası",
      "email": "E-posta Adresi",
      "linkedin": "linkedin.com/in/kullaniciadi",
      "summary_v1": "1. Tekil Şahıs (Ben) ağzından yazılmış profesyonel özet (Örn: Deneyimimle... sağladım)",
      "summary_v3": "3. Tekil Şahıs (O) veya Nesnel ağızdan yazılmış profesyonel özet (Örn: Deneyimiyle... sağlandı)",
      "experience": [{
          "role": "Pozisyon", 
          "company": "Şirket", 
          "date": "Tarih", 
          "bullets_v1": ["1. Tekil (Ben) diliyle madde 1", "1. Tekil (Ben) diliyle madde 2"],
          "bullets_v3": ["3. Tekil (O) diliyle madde 1", "3. Tekil (O) diliyle madde 2"]
      }],
      "education": [{"degree": "", "school": "", "date": "", "details": ""}],
      "skills": ["Yetenek1", "Yetenek2"],
      "additional": ["Dil Bilgisi", "Hobiler", "Ödüller"],
      "analysis": {
        "original_score": 50,
        "optimized_score": 90,
        "matches": ["İlanla eşleşen ve CV'de var olan önemli yetenekler"],
        "gaps": ["İlanda olup CV'de zayıf kalan veya eksik olan noktalar (kısa cümleler)"],
        "additions": ["CV'yi güçlendirmek için eklenen anahtar kelimeler ve yetkinlikler"]
      }
    }
      
    KURALLAR:
    1. Görseldeki hiyerarşik yapıya sadık kal.
    2. LinkedIn adresini CV içinden bul ve "linkedin" alanına ekle.
    3. Tüm CV içeriğini profesyonel ${langText} olarak oluştur. 
    4. İngilizce ise tarihleri (e.g., "Present", "Jan 2024") İngilizce, Türkçe ise (e.g., "Devam Ediyor", "Ocak 2024") Türkçe yap.
    5. Orijinal verileri asla değiştirme, sadece ${langText} diline en uygun ve profesyonel şekilde uyarla.
    6. "analysis" kısmını da mutlaka ${langText} dilinde doldur.
    7. KRİTİK KURAL: Sertifikalar, kurslar, bootcamp'ler ve her türlü eğitim niteliğindeki programı KESİNLİKLE "education" (Eğitim) dizisi altına ekle. "degree" alanına sertifika/kurs adını, "school" alanına veren kurumu yaz. "additional" kısmında asla eğitim veya sertifika bırakma.`;

    try {
      const payload = {
        contents: [{ parts: [{ text: `CV: ${originalCV}\n\nİlan: ${jobDescription}` }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: { responseMimeType: "application/json" }
      };

      const result = await callGeminiApi(payload);
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        const cleanText = text.replace(/```json|```/g, '').trim();
        const parsedData = JSON.parse(cleanText);
        
        if (parsedData.experience) parsedData.experience = parsedData.experience.map(i => ({...i, id: Math.random().toString(36).substr(2, 9)}));
        if (parsedData.education) parsedData.education = parsedData.education.map(i => ({...i, id: Math.random().toString(36).substr(2, 9)}));
        
        setOptimizedData(parsedData);
      }
    } catch (err) {
      setError('Optimizasyon sırasında bir hata oluştu. Lütfen tekrar deneyin.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (!addItemInput.trim()) return;
    setIsAddingItem(true);
    
    const langText = cvLanguage === 'tr' ? 'TÜRKÇE' : 'İNGİLİZCE';
    let sectionInstruction = "";
    if (addItemSection === 'experience') sectionInstruction = `Seçilen bölüm: 'experience'. Çıktı formatı: {"entry": {"role": "Pozisyon", "company": "Şirket/Proje Adı", "date": "Tarih", "bullets_v1": ["1. Tekil Madde"], "bullets_v3": ["3. Tekil Madde"]}}.`;
    else if (addItemSection === 'education') sectionInstruction = `Seçilen bölüm: 'education'. Çıktı formatı: {"entry": {"degree": "Derece", "school": "Okul", "date": "Tarih", "details": "Detaylar"}}.`;
    else if (addItemSection === 'skills' || addItemSection === 'additional') sectionInstruction = `Seçilen bölüm: '${addItemSection}'. Çıktı formatı: {"items": ["Madde 1"]}.`;
    else if (addItemSection === 'summary') sectionInstruction = `Seçilen bölüm: 'summary'. Çıktı formatı: {"text_v1": "1. tekil ek", "text_v3": "3. tekil ek"}.`;

    const systemPrompt = `Sen profesyonel bir CV yazarısın. Kullanıcının girdisini ${langText} dilinde profesyonelce formatla. Hem 1. tekil hem 3. tekil versiyonları üret. Sadece JSON döndür. ${sectionInstruction}`;

    try {
      const payload = {
        contents: [{ parts: [{ text: `Girdi: ${addItemInput}` }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: { responseMimeType: "application/json" }
      };
      const result = await callGeminiApi(payload);
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        const cleanText = text.replace(/```json|```/g, '').trim();
        const newItem = JSON.parse(cleanText);
        setOptimizedData(prev => {
          const newData = { ...prev };
          const uniqueId = Math.random().toString(36).substr(2, 9);
          if (addItemSection === 'experience' && newItem.entry) newData.experience = [{...newItem.entry, id: uniqueId}, ...newData.experience];
          else if (addItemSection === 'education' && newItem.entry) newData.education = [{...newItem.entry, id: uniqueId}, ...newData.education];
          else if ((addItemSection === 'skills' || addItemSection === 'additional') && newItem.items) newData[addItemSection] = [...newData[addItemSection], ...newData[addItemSection], ...newData[addItemSection], ...newItem.items];
          else if (addItemSection === 'summary') {
              if (newItem.text_v1) newData.summary_v1 = (newData.summary_v1 || "") + " " + newItem.text_v1;
              if (newItem.text_v3) newData.summary_v3 = (newData.summary_v3 || "") + " " + newItem.text_v3;
          }
          return newData;
        });
        setAddItemInput('');
      }
    } catch (err) {
      setError("Öğe eklenirken hata oluştu.");
    } finally {
      setIsAddingItem(false);
    }
  };

  const formatLinkedinUrl = (url) => {
    if (!url) return "#";
    let cleanUrl = url.trim();
    if (!cleanUrl.includes('.') && !cleanUrl.includes('/') && !cleanUrl.includes(':')) return `https://linkedin.com/in/${cleanUrl}`;
    if (cleanUrl.startsWith('http')) return cleanUrl;
    return `https://${cleanUrl}`;
  };

  const handleDownloadPdf = async () => {
    if (!resumeRef.current) return;
    setIsDownloading(true);
    try {
      const resumeElement = resumeRef.current;
      const clone = resumeElement.cloneNode(true);
      
      clone.style.width = `${resumeElement.offsetWidth}px`;
      clone.style.position = 'absolute';
      clone.style.top = '0'; 
      clone.style.left = '0';
      clone.style.zIndex = '-1000'; 
      clone.classList.add('bg-white');
      
      const padding = activeTemplate === 'professional' ? '40px' : '32px';
      clone.style.padding = padding;
      clone.style.paddingBottom = activeTemplate === 'professional' ? '20px' : '16px'; 

      document.body.appendChild(clone);

      const pageWidthPx = clone.offsetWidth;
      const pageHeightPx = Math.ceil(pageWidthPx * 1.414);
      
      const sections = Array.from(clone.querySelectorAll('.animate-in > div'));
      const cloneRect = clone.getBoundingClientRect();
      const cloneLinks = Array.from(clone.querySelectorAll('.pdf-link'));

      sections.forEach((section, idx) => {
          if(idx === 0 && section.classList.contains('flex')) return;

          const rect = section.getBoundingClientRect();
          const relativeTop = rect.top - cloneRect.top;
          const height = section.offsetHeight;
          const relativeBottom = relativeTop + height;
          
          const startPage = Math.floor(relativeTop / pageHeightPx);
          const endPage = Math.floor(relativeBottom / pageHeightPx);
          
          if (startPage !== endPage) {
              const subItems = Array.from(section.querySelectorAll('.group\\/item'));
              
              if (subItems.length > 0) {
                 for (let j = 0; j < subItems.length; j++) {
                    const item = subItems[j];
                    const iRect = item.getBoundingClientRect();
                    const iTop = iRect.top - cloneRect.top;
                    const iBottom = iTop + item.offsetHeight;
                    const iStartPage = Math.floor(iTop / pageHeightPx);
                    const iEndPage = Math.floor(iBottom / pageHeightPx);
                    
                    if (j === 0) {
                         // Başlık yetim kalmasın veya ilk madde sığmıyorsa bölümü it
                         if (iStartPage !== iEndPage || iStartPage > startPage) {
                             const sectionMargin = (Math.max(iEndPage, iStartPage) * pageHeightPx) - relativeTop + 40;
                             section.style.marginTop = `${sectionMargin}px`;
                             break;
                         }
                    } else {
                        // Diğer maddeler sığmıyorsa sadece o maddeyi it
                        if (iStartPage !== iEndPage) {
                             const itemMargin = (iEndPage * pageHeightPx) - iTop + 40;
                             item.style.marginTop = `${itemMargin}px`;
                             break;
                        }
                    }
                 }
              } else {
                  // Bölünemez kısa bölümler için
                  const marginTop = (endPage * pageHeightPx) - relativeTop + 40;
                  section.style.marginTop = `${marginTop}px`;
              }
          }
      });

      const linkLocations = cloneLinks.map(link => {
          const rect = link.getBoundingClientRect();
          const url = link.getAttribute('data-url');
          return {
              x: rect.left - cloneRect.left, 
              y: rect.top - cloneRect.top,    
              w: rect.width,
              h: rect.height,
              url: url
          };
      });

      const canvas = await window.html2canvas(clone, { 
        scale: 3, 
        useCORS: true, 
        logging: false, 
        backgroundColor: "#ffffff", 
        windowWidth: resumeElement.scrollWidth, 
        windowHeight: clone.scrollHeight + 100, 
        imageTimeout: 0 
      });
      
      document.body.removeChild(clone);
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfPageWidth = pdf.internal.pageSize.getWidth();
      const pdfPageHeight = pdf.internal.pageSize.getHeight();
      
      const pdfScale = pdfPageWidth / pageWidthPx; 
      const imgHeight = (canvas.height * pdfPageWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;
      let pageIndex = 0;

      while (heightLeft > 0) {
        if (pageIndex > 0) pdf.addPage();
        
        pdf.addImage(imgData, 'PNG', 0, position, pdfPageWidth, imgHeight, undefined, 'FAST');
        
        linkLocations.forEach(link => {
            if (!link.url) return;
            const linkPdfY = link.y * pdfScale; 
            const pageTop = pageIndex * pdfPageHeight;
            const pageBottom = (pageIndex + 1) * pdfPageHeight;

            if (linkPdfY >= pageTop && linkPdfY < pageBottom) {
                const x = link.x * pdfScale;
                const y = linkPdfY - pageTop;
                const w = link.w * pdfScale;
                const h = link.h * pdfScale;
                const safeUrl = encodeURI(link.url);
                pdf.link(x, y, w, h, { url: safeUrl });
            }
        });

        heightLeft -= pdfPageHeight;
        position -= pdfPageHeight;
        pageIndex++;
      }
      pdf.save(`${optimizedData.name.replace(/\s+/g, '_')}_CV_${cvLanguage.toUpperCase()}.pdf`);
    } catch (err) {
      setError("PDF oluşturulurken hata oluştu.");
      console.error(err);
    } finally {
      setIsDownloading(false);
    }
  };

  const copyAsText = () => {
    if (!optimizedData) return;
    const labels = translations[cvLanguage];
    const contactStr = `${optimizedData.location} | ${optimizedData.phone} | ${optimizedData.email}`;
    const activeSummary = narrativeVoice === 'first' ? (optimizedData.summary_v1 || optimizedData.summary) : (optimizedData.summary_v3 || optimizedData.summary);
    const text = `${optimizedData.name}\n${optimizedData.title}\n${contactStr}\n${optimizedData.linkedin || ''}\n\n${toUpper(labels.summary)}\n${activeSummary}\n\n${toUpper(labels.experience)}\n${optimizedData.experience.map(e => {
        const bullets = narrativeVoice === 'first' ? (e.bullets_v1 || e.bullets) : (e.bullets_v3 || e.bullets);
        return `${e.role} @ ${e.company} (${e.date})\n${bullets.join('\n')}`;
    }).join('\n\n')}\n\n${toUpper(labels.education)}\n${optimizedData.education.map(edu => `${edu.degree} @ ${edu.school} (${edu.date})`).join('\n')}`;
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleSort = () => {
    let _sectionsOrder = [...sectionsOrder];
    const draggedItemContent = _sectionsOrder.splice(dragItem.current, 1)[0];
    _sectionsOrder.splice(dragOverItem.current, 0, draggedItemContent);
    dragItem.current = dragOverItem.current;
    dragOverItem.current = null;
    setSectionsOrder(_sectionsOrder);
  };

  const onSubDragStart = (e, section, index) => {
    e.stopPropagation(); 
    subDragItem.current = { section, index };
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.parentNode); 
    e.dataTransfer.setDragImage(e.target, 20, 20);
    setTimeout(() => { if(e.target) e.target.style.opacity = '0.5'; }, 0);
  };

  const onSubDragOver = (e, section, index) => {
    e.preventDefault();
    e.stopPropagation();
    if (!subDragItem.current || subDragItem.current.section !== section) return;
    if (subDragItem.current.index === index) return;
    const targetRect = e.currentTarget.getBoundingClientRect();
    const hoverMiddleY = (targetRect.bottom - targetRect.top) / 2;
    const hoverClientY = e.clientY - targetRect.top;
    if (subDragItem.current.index < index && hoverClientY < hoverMiddleY) return;
    if (subDragItem.current.index > index && hoverClientY > hoverMiddleY) return;
    setOptimizedData(prev => {
      const newData = { ...prev };
      const list = [...newData[section]];
      const [draggedItem] = list.splice(subDragItem.current.index, 1);
      list.splice(index, 0, draggedItem);
      newData[section] = list;
      return newData;
    });
    subDragItem.current.index = index;
  };

  const onSubDragEnd = (e) => {
    e.stopPropagation();
    e.target.style.opacity = '1';
    subDragItem.current = null;
    subDragOverItem.current = null;
  };

  const editableClass = "hover:bg-blue-50/50 transition-colors cursor-text outline-none focus:bg-blue-50 focus:ring-1 focus:ring-blue-200 rounded px-1";

  const getHeaderStyle = () => {
    if (activeTemplate === 'classic') return "flex-col items-center text-center";
    if (activeTemplate === 'professional') return "flex-row items-center justify-between border-b-2 pb-4 border-slate-800";
    return "flex-row justify-between items-start"; 
  };

  const getSectionTitleStyle = () => {
    if (activeTemplate === 'classic') return "text-center border-b border-slate-300 pb-2 mb-3 font-serif tracking-widest text-sm";
    if (activeTemplate === 'professional') return "w-32 flex-shrink-0 font-bold text-sm uppercase text-slate-800 pt-1";
    return `font-bold text-sm tracking-widest border-b mb-1 pb-2`; 
  };

  const getSectionContainerStyle = (isLast) => {
    if (activeTemplate === 'professional') return `flex gap-6 border-b border-slate-100 pb-4 ${isLast ? 'mb-0 border-0 pb-0' : 'mb-4'}`;
    return isLast ? "mb-0" : "mb-2"; 
  };

  const getActiveSummary = () => {
      if (!optimizedData) return "";
      if (narrativeVoice === 'first') return optimizedData.summary_v1 || optimizedData.summary;
      return optimizedData.summary_v3 || optimizedData.summary;
  };

  const getActiveBullets = (exp) => {
      if (narrativeVoice === 'first') return exp.bullets_v1 || exp.bullets;
      return exp.bullets_v3 || exp.bullets;
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans p-4 md:p-6 lg:p-10" lang={cvLanguage}>
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Giriş Paneli */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h1 className="text-2xl font-bold flex items-center gap-2 mb-6" style={{ color: themeColor }}>
              <ShieldCheck className="w-7 h-7" /> CV Master AI
            </h1>
            
            <div className="space-y-6">
              {/* 1. PDF Yükleme */}
              <div className="block">
                <span className="text-sm font-bold text-slate-600 mb-2 block">1. Mevcut CV'nizi Yükleyin</span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => fileInputRef.current.click()} 
                    className={`flex-1 flex items-center justify-center gap-2 bg-slate-50 border-2 border-dashed ${originalCV ? 'border-green-300 bg-green-50 text-green-700' : 'border-slate-300 text-slate-600'} p-4 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all text-sm font-medium`}
                    disabled={isPdfLoading}
                  >
                    {isPdfLoading ? <><RefreshCw className="w-4 h-4 animate-spin" /><span>Okunuyor...</span></> : originalCV ? <><FileCheck className="w-4 h-4" /><span>PDF Yüklendi (Değiştir)</span></> : <><Upload className="w-4 h-4" /><span>PDF Yükle</span></>}
                  </button>
                  {originalCV && (
                    <button onClick={clearPdfData} className="p-4 bg-red-50 text-red-500 rounded-xl border border-red-200 hover:bg-red-100" title="PDF'i Kaldır">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".pdf" className="hidden" />
                </div>
              </div>

              {/* 2. Profil Fotoğrafı */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-sm font-bold text-slate-600 mb-3 block">2. Profil Fotoğrafı</span>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div 
                      onClick={() => photoInputRef.current.click()}
                      className="w-16 h-16 rounded-lg bg-white border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:border-blue-400 transition-colors overflow-hidden group relative"
                    >
                      {profileImage ? (
                        <div className="w-full h-full relative overflow-hidden pointer-events-none flex items-center justify-center bg-slate-100">
                          <img src={profileImage} alt="Profil" className="max-w-none origin-center" style={{ imageRendering: 'high-quality', objectFit: 'contain', width: '100%', height: '100%', transform: `translate(${photoPos.x}px, ${photoPos.y}px) scale(${photoZoom})` }} />
                        </div>
                      ) : <Camera className="w-6 h-6 text-slate-300 group-hover:text-blue-400" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex gap-2 mb-2">
                        <button onClick={() => photoInputRef.current.click()} className="text-[10px] bg-white border border-slate-200 px-3 py-1.5 rounded-md font-bold hover:bg-slate-50 transition-colors text-slate-700">DOSYA SEÇ</button>
                        {profileImage && <button onClick={() => setProfileImage(null)} className="text-[10px] text-red-500 bg-red-50 px-3 py-1.5 rounded-md font-bold hover:bg-red-100 transition-colors">SİL</button>}
                      </div>
                      <div className="flex gap-2">
                        {shapeOptions.map(shape => (
                           <button key={shape.id} onClick={() => setPhotoShape(shape.id)} className={`p-1.5 border rounded-md transition-all ${photoShape === shape.id ? 'bg-blue-100 border-blue-400 text-blue-600' : 'bg-white border-slate-200 text-slate-400 hover:border-blue-200'}`} title={shape.label}>
                             <div className={`w-4 h-4 bg-current border border-current ${shape.iconClass}`}></div>
                           </button>
                        ))}
                      </div>
                    </div>
                    <input type="file" ref={photoInputRef} onChange={handlePhotoUpload} accept="image/*" className="hidden" />
                  </div>
                  {profileImage && (
                    <div className="px-1 flex flex-col gap-2">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-500"><span className="flex items-center gap-1 uppercase tracking-wider"><ZoomIn className="w-3 h-3"/> YAKINLAŞTIRMA</span><span>%{Math.round(photoZoom * 100)}</span></div>
                      <input type="range" min="0.1" max="3" step="0.01" value={photoZoom} onChange={(e) => setPhotoZoom(parseFloat(e.target.value))} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                    </div>
                  )}
                </div>
              </div>
              
              {/* 3. Hedef İş İlanı */}
              <label className="block">
                <span className="text-sm font-bold text-slate-600 mb-2 block">3. Hedef İş İlanı</span>
                <textarea className="w-full h-32 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="İş tanımını buraya yapıştırın..." />
              </label>

              {/* 4. Tasarım ve Özelleştirme */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-5">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2 mb-2">
                    <Settings2 className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-bold text-slate-700">4. Tasarım ve Özelleştirme</span>
                </div>

                {/* Şablon */}
                <div>
                    <span className="text-xs font-bold text-slate-500 mb-2 block flex items-center gap-1"><LayoutTemplate className="w-3 h-3"/> Şablon</span>
                    <div className="grid grid-cols-3 gap-2">{templateOptions.map((template) => (<button key={template.id} onClick={() => setActiveTemplate(template.id)} className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${activeTemplate === template.id ? 'bg-white border-blue-500 shadow-md text-blue-600' : 'bg-white border-slate-200 text-slate-500 hover:border-blue-200 hover:bg-slate-50'}`}>{template.icon}<span className="text-[10px] font-bold mt-1.5">{template.name}</span></button>))}</div>
                </div>

                {/* Renk */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-slate-500 flex items-center gap-1"><Palette className="w-3 h-3"/> Renk & İkonlar</span>
                        <button onClick={() => setShowIcons(!showIcons)} className={`text-[9px] font-bold px-2 py-0.5 rounded transition-colors border ${showIcons ? 'bg-green-50 text-green-600 border-green-200' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>{showIcons ? 'İkonlar Açık' : 'İkonlar Kapalı'}</button>
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide"> 
                      {colorPresets.map((color) => (<button key={color.hex} onClick={() => setThemeColor(color.hex)} className={`w-8 h-8 rounded-full transition-all border-2 flex-shrink-0 ${themeColor === color.hex ? 'border-white ring-2 ring-slate-400 scale-110' : 'border-transparent hover:scale-105'}`} style={{ backgroundColor: color.hex }} title={color.name} />))}
                      <div className="w-px h-6 bg-slate-300 mx-1 flex-shrink-0"></div> 
                      <label className={`w-8 h-8 rounded-full border-2 flex items-center justify-center cursor-pointer relative overflow-hidden flex-shrink-0 transition-all ${!colorPresets.some(c => c.hex === themeColor) ? 'bg-white border-white ring-2 ring-slate-400' : 'bg-white border-slate-300 hover:border-slate-400'}`} title="Özel Renk Seç">
                        <input type="color" value={themeColor} onChange={(e) => setThemeColor(e.target.value)} className="opacity-0 absolute inset-0 w-full h-full cursor-pointer" />
                        <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"><Plus className="w-4 h-4" /></div>
                      </label>
                    </div>
                </div>

                {/* Dil */}
                <div>
                    <span className="text-xs font-bold text-slate-500 mb-2 block flex items-center gap-1"><PenTool className="w-3 h-3"/> Anlatım Dili</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => setNarrativeVoice('first')} className={`p-2 rounded-lg border text-[10px] font-bold transition-all ${narrativeVoice === 'first' ? 'bg-white border-blue-500 text-blue-600 shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:border-blue-200'}`}>1. Tekil (Yaptım)</button>
                      <button onClick={() => setNarrativeVoice('third')} className={`p-2 rounded-lg border text-[10px] font-bold transition-all ${narrativeVoice === 'third' ? 'bg-white border-blue-500 text-blue-600 shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:border-blue-200'}`}>3. Tekil (Yaptı)</button>
                    </div>
                </div>
              </div>

              {/* Aksiyon */}
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => handleOptimize('tr')} disabled={isLoading} className="bg-white border-2 text-slate-700 font-bold py-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 hover:border-blue-600 hover:text-blue-600 active:scale-[0.98] disabled:opacity-50" style={{ borderColor: cvLanguage === 'tr' && optimizedData ? themeColor : '#e2e8f0' }}>{isLoading && cvLanguage === 'tr' ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />} Türkçe CV Tasarla</button>
                <button onClick={() => handleOptimize('en')} disabled={isLoading} className="bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 hover:bg-slate-900 active:scale-[0.98] disabled:opacity-50">{isLoading && cvLanguage === 'en' ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Globe className="w-5 h-5" />} İngilizce CV Tasarla</button>
              </div>
              {error && <p className="text-red-500 text-xs font-bold flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {error}</p>}
            </div>
            
            {/* Analiz & Ekleme */}
            {optimizedData && (
              <>
                {optimizedData.analysis && (
                  <div className="mt-8 pt-8 border-t border-slate-200 animate-in slide-in-from-top-4 duration-700">
                    <h3 className="flex items-center gap-2 font-bold text-lg mb-4 text-slate-800"><BarChart3 className="w-5 h-5 text-blue-600" />{translations[cvLanguage].analysisTitle}</h3>
                    
                    {/* Skorlar */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center"><span className="text-xs text-slate-500 font-bold uppercase block mb-1">{translations[cvLanguage].scoreBefore}</span><span className={`text-3xl font-black ${getScoreColor(optimizedData.analysis.original_score)}`}>%{optimizedData.analysis.original_score}</span></div>
                      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center relative overflow-hidden"><div className="absolute top-0 right-0 p-1"><TrendingUp className="w-4 h-4 text-blue-500" /></div><span className="text-xs text-blue-700 font-bold uppercase block mb-1">{translations[cvLanguage].scoreAfter}</span><span className="text-3xl font-black text-blue-700">%{optimizedData.analysis.optimized_score}</span></div>
                    </div>

                    {/* Detaylı Analiz Listeleri */}
                    <div className="space-y-4">
                      {/* Eşleşenler */}
                      <div className="bg-green-50/50 p-4 rounded-xl border border-green-100">
                         <h4 className="flex items-center gap-2 text-sm font-bold text-green-800 mb-2">
                             <CheckCircle2 className="w-4 h-4" /> {translations[cvLanguage].matches}
                         </h4>
                         <ul className="space-y-1">
                             {optimizedData.analysis.matches?.map((m, i) => (
                                 <li key={i} className="text-xs text-green-700 flex items-start gap-1.5"><Check className="w-3 h-3 mt-0.5 flex-shrink-0" /> {m}</li>
                             ))}
                         </ul>
                      </div>

                      {/* Eksikler */}
                      <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100">
                         <h4 className="flex items-center gap-2 text-sm font-bold text-orange-800 mb-2">
                             <AlertTriangle className="w-4 h-4" /> {translations[cvLanguage].gaps}
                         </h4>
                         <ul className="space-y-1">
                             {optimizedData.analysis.gaps?.map((g, i) => (
                                 <li key={i} className="text-xs text-orange-700 flex items-start gap-1.5"><XCircle className="w-3 h-3 mt-0.5 flex-shrink-0" /> {g}</li>
                             ))}
                         </ul>
                      </div>

                      {/* Eklenenler */}
                      <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                         <h4 className="flex items-center gap-2 text-sm font-bold text-blue-800 mb-2">
                             <Lightbulb className="w-4 h-4" /> {translations[cvLanguage].added}
                         </h4>
                         <ul className="space-y-1">
                             {optimizedData.analysis.additions?.map((a, i) => (
                                 <li key={i} className="text-xs text-blue-700 flex items-start gap-1.5"><PlusCircle className="w-3 h-3 mt-0.5 flex-shrink-0" /> {a}</li>
                             ))}
                         </ul>
                      </div>
                    </div>

                  </div>
                )}
                
                 <div className="mt-8 pt-8 border-t border-slate-200 animate-in slide-in-from-top-4 duration-700">
                   <h3 className="flex items-center gap-2 font-bold text-lg mb-2 text-slate-800"><Wand2 className="w-5 h-5 text-purple-600" />{translations[cvLanguage].addItemTitle}</h3>
                   <p className="text-xs text-slate-500 mb-4">{translations[cvLanguage].addItemDesc}</p>
                   <div className="space-y-3">
                     <select value={addItemSection} onChange={(e) => setAddItemSection(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-purple-500 outline-none">
                       {sectionOptions.map(opt => (<option key={opt.id} value={opt.id}>{cvLanguage === 'tr' ? opt.labelTr : opt.labelEn}</option>))}
                     </select>
                     <textarea value={addItemInput} onChange={(e) => setAddItemInput(e.target.value)} placeholder={cvLanguage === 'tr' ? "Örn: Geçen yaz freelance olarak bir React projesi yaptım..." : "Ex: I worked on a freelance React project last summer..."} className="w-full h-24 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 outline-none resize-none" />
                     <button onClick={handleAddItem} disabled={isAddingItem || !addItemInput.trim()} className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 hover:bg-purple-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
                       {isAddingItem ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} {translations[cvLanguage].addBtn}
                     </button>
                   </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Önizleme Paneli */}
        <div className="lg:col-span-7">
          <div className="sticky top-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-slate-500 uppercase tracking-widest text-sm">Canlı Önizleme ({cvLanguage.toUpperCase()})</h2>
              </div>
              <div className="flex gap-2">
                {optimizedData && (
                  <>
                    <button onClick={copyAsText} className="text-xs bg-white border border-slate-200 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-slate-50">{copySuccess ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-slate-500" />} KOPYALA</button>
                    <button onClick={handleDownloadPdf} disabled={isDownloading} className="text-xs text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-md transition-all active:scale-95 disabled:opacity-50" style={{ backgroundColor: themeColor }}>{isDownloading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} PDF İNDİR</button>
                  </>
                )}
              </div>
            </div>

            <div className={`bg-white shadow-2xl rounded-sm border border-slate-200 relative overflow-visible ${activeTemplate === 'classic' ? 'font-serif' : 'font-sans'}`} style={{ 
               paddingTop: activeTemplate === 'professional' ? '40px' : '32px',
               paddingRight: activeTemplate === 'professional' ? '40px' : '32px',
               paddingLeft: activeTemplate === 'professional' ? '40px' : '32px',
               paddingBottom: activeTemplate === 'professional' ? '20px' : '16px' 
            }} id="resume-preview" ref={resumeRef}>
              {optimizedData ? (
                <div className={`animate-in fade-in duration-700 ${activeTemplate !== 'classic' ? 'grid grid-cols-2 gap-x-6 gap-y-0' : ''}`}>
                   
                   {/* HEADER */}
                  <div className={`${activeTemplate !== 'classic' ? 'col-span-2' : ''} flex ${getHeaderStyle()} mb-4`}>
                    <div className={`${activeTemplate === 'classic' ? 'text-center w-full' : 'flex-1 pr-6'}`}>
                      <h1 
                        className={`text-4xl font-bold uppercase tracking-tight mb-0 ${editableClass} ${activeTemplate === 'classic' ? 'text-slate-900' : ''}`} 
                        style={{ color: activeTemplate === 'classic' ? '#000' : themeColor }}
                        contentEditable suppressContentEditableWarning 
                        onBlur={(e) => updateField('name', e.target.innerText)}
                      >
                        {optimizedData.name}
                      </h1>
                      <h2 className={`text-xl font-bold text-slate-800 mb-2 ${editableClass} ${activeTemplate === 'classic' ? 'text-slate-600 font-medium' : ''}`} contentEditable suppressContentEditableWarning onBlur={(e) => updateField('title', e.target.innerText)}>{optimizedData.title}</h2>
                      
                      <div className={`flex flex-wrap ${activeTemplate === 'classic' ? 'justify-center gap-2 text-[10px]' : 'items-center gap-x-2 gap-y-0.5 text-[9px]'} text-slate-500 font-medium mt-1`}>
                        <div className="flex items-center gap-1 group">
                          {showIcons && <MapPin className="w-2.5 h-2.5 opacity-60" />}
                          <span className={editableClass} contentEditable suppressContentEditableWarning onBlur={(e) => updateField('location', e.target.innerText)}>{optimizedData.location || translations[cvLanguage].location}</span>
                        </div>
                        <span className="text-slate-300">•</span>
                        <div className="flex items-center gap-1">
                          {showIcons && <Phone className="w-2.5 h-2.5 opacity-60" />}
                          <span className={editableClass} contentEditable suppressContentEditableWarning onBlur={(e) => updateField('phone', e.target.innerText)}>{optimizedData.phone || translations[cvLanguage].phone}</span>
                        </div>
                        <span className="text-slate-300">•</span>
                        <div className="flex items-center gap-1 group">
                          {showIcons && <Mail className="w-2.5 h-2.5 opacity-60" />}
                          <a 
                            ref={emailRef} 
                            href={`mailto:${optimizedData.email}`} 
                            className={`pdf-link ${editableClass} hover:text-blue-600`}
                            data-url={`mailto:${optimizedData.email}`}
                            contentEditable suppressContentEditableWarning 
                            onBlur={(e) => updateField('email', e.target.innerText)}
                          >
                            {optimizedData.email || translations[cvLanguage].email}
                          </a>
                          <a 
                             href={`mailto:${optimizedData.email}`} 
                             className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 p-0.5 text-slate-400 hover:text-blue-600"
                             title="E-posta Gönder"
                          >
                             <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                        <span className="text-slate-300">•</span>
                        {/* LinkedIn Bölümü */}
                        <div className="flex items-center gap-1 group relative">
                          {showIcons && (
                            <a 
                               href={formatLinkedinUrl(optimizedData.linkedin)} 
                               target="_blank" 
                               rel="noopener noreferrer" 
                               className="cursor-pointer hover:opacity-80 transition-opacity pdf-link"
                               data-url={formatLinkedinUrl(optimizedData.linkedin)}
                               title="Profili Görüntüle"
                             >
                               <Linkedin className="w-2.5 h-2.5 opacity-80" style={{ color: themeColor }} />
                             </a>
                          )}
                          <span 
                            ref={linkedinRef} 
                            className={`${editableClass} font-semibold pdf-link`} 
                            style={{ color: themeColor, textDecoration: 'none' }} 
                            data-url={formatLinkedinUrl(optimizedData.linkedin)}
                            contentEditable 
                            suppressContentEditableWarning 
                            onBlur={(e) => updateField('linkedin', e.target.innerText)}
                            title="Düzenlemek için tıklayın"
                          >
                            {decodeURIComponent(optimizedData.linkedin || translations[cvLanguage].profil).replace(/^https?:\/\/(www\.)?/, '')}
                          </span>
                          
                          <a 
                             href={formatLinkedinUrl(optimizedData.linkedin)} 
                             target="_blank" 
                             rel="noopener noreferrer" 
                             className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 p-0.5 text-slate-400 hover:text-blue-600 cursor-pointer"
                             title="Bağlantıyı Aç"
                          >
                             <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                    
                    {/* Fotoğraf */}
                    {activeTemplate !== 'classic' && (
                      <div 
                        className={`w-32 h-32 bg-slate-50 ${photoShape} border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0 relative group select-none ${profileImage ? 'cursor-move' : ''}`}
                        onMouseDown={handlePhotoMouseDown} onMouseMove={handlePhotoMouseMove} onMouseUp={handlePhotoMouseUp} onMouseLeave={handlePhotoMouseUp} onWheel={handlePhotoWheel}
                      >
                        {profileImage ? (
                          <div className="w-full h-full relative flex items-center justify-center pointer-events-none">
                            <img 
                              src={profileImage} alt="Profil" 
                              className="max-w-full max-h-full transition-transform duration-75" 
                              style={{ 
                                imageRendering: 'high-quality',
                                objectFit: 'contain',
                                transform: `translate(${photoPos.x}px, ${photoPos.y}px) scale(${photoZoom})`,
                              }} 
                            />
                          </div>
                        ) : (
                          <User className="w-16 h-16 text-slate-300" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Sıralanabilir Bölümler */}
                  {sectionsOrder.map((sectionId, index) => {
                    const isLast = index === sectionsOrder.length - 1;
                    let colSpan = 'col-span-2';
                    if (activeTemplate === 'modern' && ['skills', 'additional'].includes(sectionId)) {
                      const prev = sectionsOrder[index - 1];
                      const next = sectionsOrder[index + 1];
                      const neighbors = ['skills', 'additional'];
                      const isNeighborRelated = (neighbors.includes(prev) || neighbors.includes(next));
                      if (isNeighborRelated) colSpan = 'col-span-2 lg:col-span-1';
                    }

                    return (
                      <div 
                        key={sectionId}
                        className={`${colSpan} ${getSectionContainerStyle(isLast)} cursor-move relative group rounded-lg transition-all duration-300 ease-in-out border border-transparent hover:border-slate-100/50 hover:bg-slate-50/30 -mx-2 px-2 py-2`}
                        draggable
                        onDragStart={(e) => { dragItem.current = index; e.target.style.opacity = '0.5'; e.dataTransfer.effectAllowed = 'move'; }}
                        onDragEnter={(e) => { dragOverItem.current = index; if (dragItem.current !== null && dragItem.current !== index) handleSort(); }}
                        onDragEnd={(e) => { e.target.style.opacity = '1'; dragItem.current = null; dragOverItem.current = null; }}
                        onDragOver={(e) => e.preventDefault()}
                      >
                          <div className="absolute -left-5 top-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-move p-1 text-slate-300 hover:text-slate-500"><Move className="w-4 h-4" /></div>

                          <h3 className={getSectionTitleStyle()} style={{ color: activeTemplate === 'classic' ? '#333' : themeColor, borderColor: activeTemplate === 'classic' ? '#ddd' : themeColor }}>{toUpper(translations[cvLanguage][sectionId])}</h3>

                          <div className={activeTemplate === 'professional' ? 'flex-1' : ''}>
                            
                            {sectionId === 'summary' && (
                               <p className={`text-[11px] leading-snug text-slate-700 ${editableClass}`} contentEditable suppressContentEditableWarning onBlur={(e) => updateField('summary', e.target.innerText)}>{getActiveSummary()}</p>
                            )}

                            {sectionId === 'experience' && optimizedData.experience.map((exp, idx) => (
                               <div key={exp.id || idx} className="mb-2 last:mb-0 relative group/item transition-all duration-500 ease-in-out" draggable onDragStart={(e) => onSubDragStart(e, 'experience', idx)} onDragOver={(e) => onSubDragOver(e, 'experience', idx)} onDragEnd={onSubDragEnd}>
                                 <div className="absolute -left-4 top-1 opacity-0 group-hover/item:opacity-100 transition-opacity cursor-move p-1 text-slate-300 hover:text-blue-500"><Move className="w-3 h-3" /></div>
                                 <div className="flex justify-between items-baseline mb-0.5">
                                   <h4 className="font-bold text-[13px] text-slate-900 leading-snug">
                                     <span className={editableClass} contentEditable suppressContentEditableWarning onBlur={(e) => updateArrayField('experience', idx, 'role', e.target.innerText)}>{exp.role}</span>
                                     {activeTemplate !== 'professional' && <span className={`font-medium text-slate-600 ${editableClass}`} contentEditable suppressContentEditableWarning onBlur={(e) => updateArrayField('experience', idx, 'company', e.target.innerText)}>, {exp.company}</span>}
                                   </h4>
                                   <span className={`${editableClass} text-[11px] font-bold text-slate-500 italic whitespace-nowrap ml-4 flex-shrink-0`} contentEditable suppressContentEditableWarning onBlur={(e) => updateArrayField('experience', idx, 'date', e.target.innerText)}>{exp.date}</span>
                                 </div>
                                 {activeTemplate === 'professional' && <p className={`text-[12px] font-semibold text-slate-600 mb-1 ${editableClass}`} contentEditable suppressContentEditableWarning onBlur={(e) => updateArrayField('experience', idx, 'company', e.target.innerText)}>{exp.company}</p>}
                                 <ul className="list-disc ml-4 space-y-0.5">
                                   {getActiveBullets(exp).map((b, bIdx) => (<li key={bIdx} className={`text-[11px] text-slate-700 ${editableClass}`} contentEditable suppressContentEditableWarning onBlur={(e) => updateBulletPoint('experience', idx, bIdx, e.target.innerText)}>{b}</li>))}
                                 </ul>
                               </div>
                            ))}

                            {sectionId === 'education' && optimizedData.education.map((edu, idx) => (
                               <div key={edu.id || idx} className="mb-2 last:mb-0 relative group/item transition-all duration-500 ease-in-out" draggable onDragStart={(e) => onSubDragStart(e, 'education', idx)} onDragOver={(e) => onSubDragOver(e, 'education', idx)} onDragEnd={onSubDragEnd}>
                                 <div className="absolute -left-4 top-1 opacity-0 group-hover/item:opacity-100 transition-opacity cursor-move p-1 text-slate-300 hover:text-blue-500"><Move className="w-3 h-3" /></div>
                                 <div>
                                   <h4 className={`font-bold text-[13px] text-slate-900 leading-snug ${editableClass}`}>
                                     <span contentEditable suppressContentEditableWarning onBlur={(e) => updateArrayField('education', idx, 'degree', e.target.innerText)}>{edu.degree}</span>
                                     <span className="font-medium text-slate-600" contentEditable suppressContentEditableWarning onBlur={(e) => updateArrayField('education', idx, 'school', e.target.innerText)}>, {edu.school}</span>
                                   </h4>
                                   <span className={`${editableClass} text-[11px] font-bold text-slate-500 italic ml-4 whitespace-nowrap flex-shrink-0`} contentEditable suppressContentEditableWarning onBlur={(e) => updateArrayField('education', idx, 'date', e.target.innerText)}>{edu.date}</span>
                                 </div>
                                 {edu.details && <p className={`text-[11px] italic text-slate-500 ${editableClass}`} contentEditable suppressContentEditableWarning onBlur={(e) => updateArrayField('education', idx, 'details', e.target.innerText)}>• {edu.details}</p>}
                               </div>
                            ))}

                            {sectionId === 'skills' && (
                               <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                 {optimizedData.skills.map((s, i) => (
                                   <div key={i} className={`text-[11px] text-slate-700 flex items-center gap-1 ${editableClass} relative group/item cursor-move`} contentEditable suppressContentEditableWarning onBlur={(e) => updateSimpleList('skills', i, e.target.innerText)} draggable onDragStart={(e) => onSubDragStart(e, 'skills', i)} onDragOver={(e) => onSubDragOver(e, 'skills', i)} onDragEnd={onSubDragEnd}>
                                     <div className="absolute -left-3 opacity-0 group-hover/item:opacity-100 transition-opacity p-0.5 text-slate-300 hover:text-blue-500"><Move className="w-2.5 h-2.5" /></div>
                                     <span className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: themeColor }}></span> {s}
                                   </div>
                                 ))}
                               </div>
                            )}

                            {sectionId === 'additional' && (
                               <div className="space-y-1">
                                 {optimizedData.additional.map((a, i) => (
                                   <div key={i} className={`text-[11px] text-slate-700 ${editableClass} relative group/item cursor-move`} contentEditable suppressContentEditableWarning onBlur={(e) => updateSimpleList('additional', i, e.target.innerText)} draggable onDragStart={(e) => onSubDragStart(e, 'additional', i)} onDragOver={(e) => onSubDragOver(e, 'additional', i)} onDragEnd={onSubDragEnd}>
                                     <div className="absolute -left-4 top-0.5 opacity-0 group-hover/item:opacity-100 transition-opacity p-0.5 text-slate-300 hover:text-blue-500"><Move className="w-3 h-3" /></div>
                                     • {a}
                                   </div>
                                 ))}
                               </div>
                            )}
                          </div>
                       </div>
                    );
                  })}

                </div>
              ) : (
                <div className="h-full min-h-[842px] flex flex-col items-center justify-center space-y-4 opacity-30">
                  <FileText className="w-20 h-20" style={{ color: themeColor }} />
                  <p className="text-sm font-bold tracking-widest uppercase text-center px-8">Verileri doldurun ve bir dil seçerek tasarlayın</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default App;