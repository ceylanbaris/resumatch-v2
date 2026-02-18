import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, Briefcase, Sparkles, Copy, RefreshCw, CheckCircle2, AlertCircle,
  Upload, FileCheck, ShieldCheck, User, Camera, Edit3, Download, Linkedin,
  Palette, Move, ZoomIn, Mail, Phone, MapPin, Globe, TrendingUp, Check,
  AlertTriangle, PlusCircle, BarChart3, Plus, Wand2, Square, Circle,
  Link as LinkIcon, Trash2, LayoutTemplate, AlignLeft, AlignCenter, Layout,
  ExternalLink, PenTool, Smile, Settings2, XCircle, Lightbulb, Highlighter,
  Bold, Italic, ChevronsUp, ChevronsDown, ScanLine, AlignRight, AlignJustify,
  Undo2, FileSearch, Cpu, PenLine, Loader2,
  Banknote, Star, Coffee, MousePointer2, Trophy, Search 
} from 'lucide-react';

const STOP_WORDS = [
  've', 'ile', 'için', 'bir', 'bu', 'şu', 'o', 'da', 'de', 'ki', 'mi', 'mu', 'mü', 'ama', 'fakat', 
  'veya', 'ya', 'hem', 'eğer', 'ise', 'yani', 'dolayı', 'ötürü', 'rağmen', 'gibi', 'kadar', 'böyle', 
  'şöyle', 'öyle', 'hiç', 'hep', 'her', 'tüm', 'bütün', 'bazı', 'birkaç', 'şey', 'çok', 'daha', 'en', 
  'kendi', 'kendine', 'olarak', 'olan', 'ilgili', 'buna', 'bunu', 'bunun', 'onu', 'onun', 'benim', 
  'bizim', 'hakkında', 'üzerine', 'tarafından', 'sayesinde', 'and', 'or', 'the', 'a', 'an', 'in', 'on', 
  'at', 'to', 'for', 'with', 'by', 'of', 'öğrencisi', 'mezunu', 'adayı', 'olarak', 'hakkında'
];

const GENERIC_BUSINESS_WORDS = [
  'proje', 'süreç', 'analiz', 'ekip', 'takım', 'yönetim', 'geliştirme', 'tasarım', 'deneyim', 
  'çalışma', 'iş', 'görev', 'sorumluluk', 'faaliyet', 'uygulama', 'kullanım', 'beceri', 'yetkinlik',
  'bilgi', 'seviye', 'kurumsal', 'departman', 'şirket', 'firma', 'müşteri', 'hizmet', 'ürün',
  'strateji', 'planlama', 'raporlama', 'iletişim', 'sunum', 'destek', 'çözüm', 'sonuç', 'hedef',
  'project', 'process', 'analysis', 'team', 'management', 'development', 'design', 'experience',
  'work', 'business', 'skill', 'knowledge', 'level', 'corporate', 'company', 'client', 'service',
  'product', 'strategy', 'planning', 'reporting', 'communication', 'presentation', 'support', 'solution'
];

const ADJECTIVES_TO_PAIR = [
  'güçlü', 'etkili', 'aktif', 'ileri', 'temel', 'yüksek', 'geniş', 'derin', 'analitik', 'stratejik',
  'yaratıcı', 'teknik', 'kurumsal', 'profesyonel', 'üst', 'başarılı', 'yoğun', 'kapsamlı',
  'strong', 'effective', 'active', 'advanced', 'basic', 'high', 'wide', 'deep', 'analytical', 'strategic',
  'creative', 'technical', 'corporate', 'professional', 'top', 'successful', 'intense', 'comprehensive'
];

const ConfettiParticle = ({ style }) => (
  <div 
    className="absolute w-2 h-2 rounded-sm animate-[confetti-fall_3s_ease-out_forwards]" 
    style={style} 
  />
);

const App = () => {
  const [originalCV, setOriginalCV] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [optimizedData, setOptimizedData] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
   
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("");
  const [gameScore, setGameScore] = useState(0);
  const [gameTargets, setGameTargets] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiParticles, setConfettiParticles] = useState([]);

  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [themeColor, setThemeColor] = useState('#1e3a8a'); 
  const [cvLanguage, setCvLanguage] = useState('tr'); 
  const [activeTemplate, setActiveTemplate] = useState('modern');
  const [narrativeVoice, setNarrativeVoice] = useState('first');
  const [showIcons, setShowIcons] = useState(true); 
  const [showHighlights, setShowHighlights] = useState(false); 
  const [textAlign, setTextAlign] = useState('text-left');

  const [toolbarVisible, setToolbarVisible] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
  const [selectedText, setSelectedText] = useState("");
  const [ignoredKeywords, setIgnoredKeywords] = useState(new Set());

  const [customHeadings, setCustomHeadings] = useState({});
  const processedWords = new Set(); 

  const [sectionsOrder, setSectionsOrder] = useState(['summary', 'experience', 'education', 'skills', 'additional']);
  const [lastDeletedSection, setLastDeletedSection] = useState(null);

  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  const subDragItem = useRef(null);
  const subDragOverItem = useRef(null);

  const [photoShape, setPhotoShape] = useState('rounded-lg');
  const [addItemSection, setAddItemSection] = useState('experience');
  const [addItemInput, setAddItemInput] = useState('');
  const [addItemTitle, setAddItemTitle] = useState('');
   
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

  // --- OYUN DÖNGÜSÜ ---
  useEffect(() => {
    let gameInterval;
    if (isLoading && !showConfetti) {
        gameInterval = setInterval(() => {
            const id = Date.now();
            const types = ['briefcase', 'star', 'money', 'coffee'];
            const randomType = types[Math.floor(Math.random() * types.length)];
            
            const zone = Math.floor(Math.random() * 4);
            let x, y;

            switch(zone) {
                case 0: x = Math.random() * 80 + 10; y = Math.random() * 20 + 5; break;
                case 1: x = Math.random() * 20 + 75; y = Math.random() * 60 + 20; break;
                case 2: x = Math.random() * 80 + 10; y = Math.random() * 20 + 75; break;
                case 3: x = Math.random() * 20 + 5; y = Math.random() * 60 + 20; break;
                default: x=10; y=10;
            }

            const newTarget = { id, x, y, type: randomType };
            setGameTargets(prev => [...prev, newTarget]);

            setTimeout(() => {
                setGameTargets(prev => prev.filter(t => t.id !== id));
            }, 2500);

        }, 1000);
    } else {
        setGameTargets([]);
    }
    return () => clearInterval(gameInterval);
  }, [isLoading, showConfetti]);

  const handleGameClick = (id) => {
      setGameScore(prev => prev + 100);
      setGameTargets(prev => prev.filter(t => t.id !== id));
  };

  useEffect(() => {
      if (showConfetti) {
          const particles = Array.from({ length: 100 }).map((_, i) => ({
              id: i,
              style: {
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * -20}%`,
                  backgroundColor: ['#1e293b', '#64748b', '#cbd5e1', '#ffffff'][Math.floor(Math.random() * 4)],
                  animationDuration: `${Math.random() * 2 + 1.5}s`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  transform: `rotate(${Math.random() * 360}deg)`
              }
          }));
          setConfettiParticles(particles);
          const timer = setTimeout(() => { setConfettiParticles([]); setShowConfetti(false); }, 3500);
          return () => clearTimeout(timer);
      }
  }, [showConfetti]);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
        setToolbarVisible(false);
        return;
      }
      const text = selection.toString().trim();
      if (text) setSelectedText(text);
      const range = selection.getRangeAt(0);
      const editorElement = document.getElementById('resume-preview');
      if (editorElement && editorElement.contains(range.commonAncestorContainer)) {
         const rect = range.getBoundingClientRect();
         setToolbarVisible(true);
         setToolbarPosition({ top: rect.top - 40, left: rect.left + (rect.width / 2) - 30 });
      } else {
         setToolbarVisible(false);
      }
    };
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, []);

  const toggleBold = (e) => {
    e.preventDefault();
    document.execCommand('bold', false, null);
    if (selectedText) {
        const lowerText = selectedText.toLowerCase();
        setIgnoredKeywords(prev => {
            const newSet = new Set(prev);
            if (newSet.has(lowerText)) newSet.delete(lowerText);
            else newSet.add(lowerText);
            return newSet;
        });
    }
  };

  const applyFormat = (command) => {
    document.execCommand(command, false, null);
  };

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
    { id: 'custom', labelTr: '✨ Yeni Özel Bölüm', labelEn: '✨ New Custom Section' },
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

  const alignmentOptions = [
    { id: 'text-left', label: 'Sola Dayalı', icon: <AlignLeft className="w-4 h-4" /> },
    { id: 'text-center', label: 'Ortalı', icon: <AlignCenter className="w-4 h-4" /> },
    { id: 'text-right', label: 'Sağa Dayalı', icon: <AlignRight className="w-4 h-4" /> },
    { id: 'text-justify', label: 'İki Yana Yasla', icon: <AlignJustify className="w-4 h-4" /> },
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

  const handleRemoveMainSection = (sectionId) => {
    const currentIndex = sectionsOrder.indexOf(sectionId);
    if (currentIndex > -1) {
        setLastDeletedSection({ id: sectionId, index: currentIndex });
        setSectionsOrder(prev => prev.filter(item => item !== sectionId));
    }
  };

  const handleUndoDelete = () => {
    if (lastDeletedSection) {
        setSectionsOrder(prev => {
            const newOrder = [...prev];
            newOrder.splice(lastDeletedSection.index, 0, lastDeletedSection.id);
            return newOrder;
        });
        setLastDeletedSection(null);
    }
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
    if (section.startsWith('custom_')) {
         setOptimizedData(prev => {
             const newArray = [...prev[section]];
             const targetBullets = [...newArray[sectionIndex].bullets];
             targetBullets[bulletIndex] = value;
             newArray[sectionIndex] = { ...newArray[sectionIndex], bullets: targetBullets };
             return { ...prev, [section]: newArray };
         });
         return;
    }

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

  const removeSectionItem = (section, index) => {
    setOptimizedData(prev => {
      const newData = { ...prev };
      const list = [...newData[section]];
      list.splice(index, 1);
      newData[section] = list;
      return newData;
    });
  };

  const removeBulletPoint = (section, expIndex, bulletIndex) => {
    if (section.startsWith('custom_')) {
        setOptimizedData(prev => {
             const newData = { ...prev };
             const experiences = [...newData[section]];
             const targetExp = { ...experiences[expIndex] };
             const targetBullets = [...targetExp.bullets];
             targetBullets.splice(bulletIndex, 1);
             targetExp.bullets = targetBullets;
             experiences[expIndex] = targetExp;
             newData[section] = experiences;
             return newData;
        });
        return;
    }

    const bulletsKey = narrativeVoice === 'first' ? 'bullets_v1' : 'bullets_v3';
    setOptimizedData(prev => {
      const newData = { ...prev };
      const experiences = [...newData.experience];
      const targetExp = { ...experiences[expIndex] };
      const targetBullets = targetExp[bulletsKey] ? [...targetExp[bulletsKey]] : [...targetExp.bullets];
      
      targetBullets.splice(bulletIndex, 1);
      targetExp[bulletsKey] = targetBullets;
      experiences[expIndex] = targetExp;
      newData.experience = experiences;
      return newData;
    });
  };

  const callGeminiApi = async (payload, retries = 3, backoff = 1000) => {
    // --- RENDER BACKEND ADRESİ ---
    const API_URL = 'https://resumatch-backend-zsmt.onrender.com';
   
    try {
      // DÜZELTME: /api/optimize yerine /optimize endpoint'ine istek atılıyor.
      const response = await fetch(`${API_URL}/optimize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: payload.contents,
          systemInstruction: payload.systemInstruction
        })
      });
   
      if (!response.ok) {
          const errData = await response.json();
          if (response.status === 429) {
              throw new Error("Çok hızlı işlem yaptınız! Lütfen 1-2 dakika bekleyip tekrar deneyin. (AI Kotası)");
          }
          throw new Error(errData.error || `API Hatası: ${response.statusText}`);
      }
   
      const data = await response.json();
      return data;
   
    } catch (err) {
      console.error("API Bağlantı Hatası:", err);
      if (retries > 0 && !err.message.includes("429")) {
         console.log(`Tekrar deneniyor... (${retries} hak kaldı)`);
         await new Promise(resolve => setTimeout(resolve, backoff));
         return callGeminiApi(payload, retries - 1, backoff * 2);
      }
      throw err;
    }
  };

  const sanitizeData = (data) => {
      if (!data) return data;
      const clean = (str) => typeof str === 'string' ? str.replace(/\*\*/g, '') : str;

      const newData = { ...data };
      if (newData.summary_v1) newData.summary_v1 = clean(newData.summary_v1);
      if (newData.summary_v3) newData.summary_v3 = clean(newData.summary_v3);
      
      if (newData.experience) {
          newData.experience = newData.experience.map(exp => ({
              ...exp,
              role: clean(exp.role),
              company: clean(exp.company),
              date: clean(exp.date) || "",
              bullets_v1: exp.bullets_v1 ? exp.bullets_v1.map(clean) : [],
              bullets_v3: exp.bullets_v3 ? exp.bullets_v3.map(clean) : []
          }));
      }
      
      if (newData.education) {
          newData.education = newData.education.map(edu => ({
              ...edu,
              degree: clean(edu.degree),
              school: clean(edu.school),
              date: clean(edu.date) || "",
              details: clean(edu.details)
          }));
      }

      if (newData.skills) newData.skills = newData.skills.map(clean);
      if (newData.additional) newData.additional = newData.additional.map(clean);

      return newData;
  };

  const handleOptimize = async (lang) => {
    if (!originalCV || !jobDescription) {
      setError('Lütfen CV PDF\'inizi yükleyin ve iş ilanını girin.');
      return;
    }

    setIsLoading(true);
    setLoadingProgress(0);
    setGameScore(0);
    setGameTargets([]); 
    setShowConfetti(false);
    setLoadingText(lang === 'tr' ? "📄 PDF Analiz Ediliyor..." : "📄 Analyzing PDF...");
    setError(null);
    setCvLanguage(lang);

    const progressInterval = setInterval(() => {
        setLoadingProgress(prev => {
            if (prev >= 95) return prev; 

            let increment = 0;
            if (prev < 30) increment = Math.random() * 3 + 1; 
            else if (prev < 70) increment = Math.random() * 1.5 + 0.5;
            else increment = Math.random() * 0.3 + 0.05; 

            const nextVal = prev + increment;
            
            if (nextVal > 15 && nextVal < 45) setLoadingText(lang === 'tr' ? "🧠 AI İçeriği Optimize Ediyor..." : "🧠 AI Optimizing Content...");
            if (nextVal > 45 && nextVal < 75) setLoadingText(lang === 'tr' ? "🎯 ATS Uyumluluğu Kontrol Ediliyor..." : "🎯 Checking ATS Compatibility...");
            if (nextVal > 75) setLoadingText(lang === 'tr' ? "✨ Tasarım Oluşturuluyor..." : "✨ Generating Design...");
            
            return nextVal;
        });
    }, 100);

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
      "education": [{"degree": "Bölüm veya Sertifika Adı", "school": "Okul veya Kurum", "date": "", "details": ""}],
      "skills": ["Yetenek1", "Yetenek2"],
      "additional": ["Dil Bilgisi", "Hobiler", "Ödüller (Sertifikaları BURAYA KOYMA, EĞİTİME KOY)"],
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
    7. KRİTİK KURAL: Eğer bir deneyim veya eğitim maddesinin tarihi orijinal metinde yoksa, tarih alanına uydurma bir tarih yazma. Boş bırak (JSON'da boş string "" olarak gönder).
    8. GİZLİLİK VE GENELLİK (ÇOK ÖNEMLİ): Kişisel Özet (Summary) kısmında ASLA iş ilanını yayınlayan şirketin (Örn: Amazon, Trendyol vb.) ismini geçirme. "Şirketinizde çalışmak istiyorum" veya "Firmanızın hedeflerine..." gibi ifadeler KULLANMA. Bunun yerine "Sektördeki deneyimimi global projelerde değerlendirmek..." gibi şirketten bağımsız ama ilandaki yetkinliklere (keyword) odaklı, profesyonel ve genel geçer bir dil kullan. Amaç: Adayın bu yeteneklere doğal olarak sahip olduğunu göstermek, "size özel yazdım" diye bağırmamak.
    9. FORMATLAMA (KESİN KURAL): Metinlerin içinde asla markdown kalınlaştırma (** **) işaretleri kullanma. Kelimeleri yalın bırak. Hangi kelimelerin önemli olduğunu zaten "matches" dizisinde veriyorsun, arayüz onları otomatik olarak vurgulayacak.
    10. EĞİTİM VE SERTİFİKALAR: Tüm Sertifikaları, Kursları, Bootcamp'leri ve Eğitim programlarını KESİNLİKLE "education" dizisinin içine ekle. Bunları "additional" veya "skills" kısmına koyma. "degree" alanına sertifikanın adını, "school" alanına veren kurumu yaz.
    11. SKILLS KISITLAMASI: 'skills' dizisine EN FAZLA 12 adet, en kritik teknik yeteneği ekle. Sayfayı taşırmamak için az ve öz olmalı. Benzer yetenekleri birleştir (Örn: HTML/CSS).`;

    try {
      const payload = {
        contents: [{ parts: [{ text: `CV: ${originalCV}\n\nİlan: ${jobDescription}` }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: { responseMimeType: "application/json" }
      };

      const result = await callGeminiApi(payload);
      
      clearInterval(progressInterval);
      setLoadingProgress(100);
      setLoadingText(lang === 'tr' ? "✅ Hazır!" : "✅ Ready!");
      setShowConfetti(true);
      
      await new Promise(resolve => setTimeout(resolve, 600));

      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        const cleanText = text.replace(/```json|```/g, '').trim();
        let parsedData = JSON.parse(cleanText);
        
        parsedData = sanitizeData(parsedData);

        if (parsedData.experience) parsedData.experience = parsedData.experience.map(i => ({...i, id: Math.random().toString(36).substr(2, 9)}));
        if (parsedData.education) parsedData.education = parsedData.education.map(i => ({...i, id: Math.random().toString(36).substr(2, 9)}));
        
        setOptimizedData(parsedData);
      }
    } catch (err) {
      setError(err.message || 'Optimizasyon sırasında bir hata oluştu. Lütfen tekrar deneyin.');
      console.error(err);
    } finally {
      clearInterval(progressInterval);
      setIsLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (!addItemInput.trim()) return;
    setIsAddingItem(true);
    
    const langText = cvLanguage === 'tr' ? 'TÜRKÇE' : 'İNGİLİZCE';
    let systemInstruction = "";
    let userPrompt = `Girdi: ${addItemInput}`;

    if (addItemSection === 'summary') {
        const currentSummary = narrativeVoice === 'first' ? optimizedData.summary_v1 : optimizedData.summary_v3;
        userPrompt = `Mevcut Özet: "${currentSummary}"\n\nEklenecek Bilgi: "${addItemInput}"\n\nGörev: Eklenecek bilgiyi mevcut özete profesyonelce yedir, akışı bozma ve bütünlüklü tek bir paragraf olarak yeniden yaz.`;
        systemInstruction = `Sen profesyonel bir CV yazarısın. Çıktı formatı JSON: {"summary_v1": "Ben diliyle yazılmış yeni özet", "summary_v3": "O diliyle yazılmış yeni özet"}. Markdown kullanma. Sadece JSON döndür. Dili: ${langText}.`;
    }
    else if (addItemSection === 'education') {
        systemInstruction = `Sen profesyonel bir CV yazarısın. Kullanıcı girdisinden bir Eğitim maddesi oluştur. Çıktı formatı JSON: {"entry": {"degree": "Bölüm/Sertifika Adı", "school": "Okul/Kurum", "date": "Tarih", "details": "Kısa açıklama"}}. Markdown kullanma. Dili: ${langText}. Sadece JSON döndür.`;
    }
    else if (addItemSection === 'experience') {
        systemInstruction = `Sen profesyonel bir CV yazarısın. Kullanıcı girdisinden bir İş Deneyimi maddesi oluştur. Çıktı formatı JSON: {"entry": {"role": "Pozisyon", "company": "Şirket", "date": "Tarih", "bullets_v1": ["Ben diliyle madde"], "bullets_v3": ["O diliyle madde"]}}. Markdown kullanma. Dili: ${langText}. Sadece JSON döndür.`;
    }
    else if (addItemSection === 'custom') {
        userPrompt = `Bölüm Başlığı: ${addItemTitle}\nİçerik: ${addItemInput}`;
        systemInstruction = `Sen profesyonel bir CV yazarısın. Kullanıcının girdiği içeriği analiz et ve iki formattan birini seç:
        1. DETAYLI FORMAT (Projeler, Gönüllü Çalışmalar gibi tarih ve detay gerektirenler):
           JSON Çıktısı: {"type": "detailed", "entries": [{"role": "Proje Adı", "company": "Teknolojiler/Kurum", "date": "Tarih", "bullets": ["Detay 1"]}]}
        2. BASİT FORMAT (Sertifikalar, Diller, Hobiler gibi liste olanlar):
           JSON Çıktısı: {"type": "simple", "items": ["Madde 1", "Madde 2"]}
        Markdown kullanma. Sadece JSON döndür. Dili: ${langText}.`;
    }
    else {
        systemInstruction = `Sen profesyonel bir CV yazarısın. Kullanıcının girdisini ${addItemSection === 'skills' ? 'Teknik Yetenek' : 'Ek Bilgi'} formatına çevir. Tek bir madde veya liste olabilir. Çıktı formatı JSON: {"items": ["Madde 1"]}. Markdown kullanma. Dili: ${langText}. Sadece JSON döndür.`;
    }

    try {
      const result = await callGeminiApi({
        contents: [{ parts: [{ text: userPrompt }] }],
        systemInstruction: { parts: [{ text: systemInstruction }] },
        generationConfig: { responseMimeType: "application/json" }
      });

      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        let parsed = JSON.parse(text.replace(/```json|```/g, '').trim());
        
        parsed = sanitizeData(parsed);

        setOptimizedData(prev => {
          const newData = { ...prev };
          const uniqueId = Math.random().toString(36).substr(2, 9);
          
          if (addItemSection === 'summary') {
              if (parsed.summary_v1) newData.summary_v1 = parsed.summary_v1;
              if (parsed.summary_v3) newData.summary_v3 = parsed.summary_v3;
          } 
          else if (addItemSection === 'experience' && parsed.entry) {
              newData.experience = [{...parsed.entry, id: uniqueId}, ...newData.experience];
          } 
          else if (addItemSection === 'education' && parsed.entry) {
              newData.education = [{...parsed.entry, id: uniqueId}, ...newData.education];
          } 
          else if ((addItemSection === 'skills' || addItemSection === 'additional') && parsed.items) {
              newData[addItemSection] = [...newData[addItemSection], ...parsed.items];
          }
          else if (addItemSection === 'custom') {
              const customId = `custom_${uniqueId}`;
              
              if (parsed.type === 'detailed' && parsed.entries) {
                   newData[customId] = parsed.entries.map(e => ({...e, id: Math.random().toString(36).substr(2, 9)}));
              } else if (parsed.items) {
                   newData[customId] = parsed.items;
              }
              
              setCustomHeadings(h => ({ ...h, [customId]: addItemTitle.toUpperCase() })); 
              setSectionsOrder(o => [...o, customId]); 
          }

          return newData;
        });
        setAddItemInput('');
        setAddItemTitle(''); 
      }
    } catch (err) { setError("Öğe eklenirken hata oluştu: " + err.message); } finally { setIsAddingItem(false); }
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
      
      clone.style.width = '794px'; 
      clone.style.minHeight = '1123px'; 
      clone.style.position = 'absolute';
      clone.style.top = '0'; 
      clone.style.left = '0';
      clone.style.zIndex = '-1000'; 
      clone.classList.add('bg-white');
      
      const padding = activeTemplate === 'professional' ? '40px' : '32px';
      clone.style.padding = padding;
      // Düzeltme: Alt dolguyu sıfırlayarak taşmayı engelliyoruz
      clone.style.paddingBottom = '0px'; 

      const cloneSpans = clone.querySelectorAll('span');
      cloneSpans.forEach(span => {
        if (span.innerText.trim() === 'Tarih Ekle') {
            span.style.display = 'none';
        }
      });

      document.body.appendChild(clone);

      const pageWidthPx = 794; 
      const pageHeightPx = Math.ceil(pageWidthPx * 1.414);
      
      const sections = Array.from(clone.querySelectorAll('.animate-in > div'));
      const cloneRect = clone.getBoundingClientRect();
      const cloneLinks = Array.from(clone.querySelectorAll('.pdf-link'));

      sections.forEach((section, idx) => {
          if(idx === 0 && section.classList.contains('flex')) return;

          const rect = section.getBoundingClientRect();
          const relativeTop = rect.top - cloneRect.top;
          
          const offsetOnPage = relativeTop % pageHeightPx;
          
          if (offsetOnPage > pageHeightPx * 0.95) {
               const pushMargin = pageHeightPx - offsetOnPage + 40;
               section.style.marginTop = `${pushMargin}px`;
               return; 
          }

          const height = section.offsetHeight; 
          const relativeBottom = relativeTop + height;
          
          const startPage = Math.floor(relativeTop / pageHeightPx);
          const endPage = Math.floor(relativeBottom / pageHeightPx);
          
          if (startPage !== endPage) {
              if (height < pageHeightPx * 0.25) {
                  const pushMargin = (endPage * pageHeightPx) - relativeTop + 40;
                  section.style.marginTop = `${pushMargin}px`;
                  return;
              }

              const subItems = Array.from(section.querySelectorAll('.group\\/item'));
              
              if (subItems.length > 0) {
                 const firstItem = subItems[0];
                 const firstRect = firstItem.getBoundingClientRect();
                 const firstItemTop = firstRect.top - cloneRect.top;
                 const firstItemPage = Math.floor(firstItemTop / pageHeightPx);

                 if (firstItemPage > startPage) {
                     const pushMargin = (firstItemPage * pageHeightPx) - relativeTop + 40;
                     section.style.marginTop = `${pushMargin}px`;
                     return;
                 }

                 for (let j = 0; j < subItems.length; j++) {
                    const item = subItems[j];
                    const iRect = item.getBoundingClientRect();
                    const iTop = iRect.top - cloneRect.top;
                    const iBottom = iTop + item.offsetHeight;
                    const iStartPage = Math.floor(iTop / pageHeightPx);
                    const iEndPage = Math.floor(iBottom / pageHeightPx);
                    
                    if (iStartPage !== iEndPage) {
                         const itemMargin = (iEndPage * pageHeightPx) - iTop + 40;
                         item.style.marginTop = `${itemMargin}px`;
                         break; 
                    }
                 }
              } else {
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
        windowWidth: 794, 
        windowHeight: clone.scrollHeight, 
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

      // Düzeltme: 10px'den az kalan kısımları yeni sayfa olarak basma
      while (heightLeft > 10) {
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
    const spacing = 'mb-2 pb-1';
    const noSpacing = isLast ? 'mb-0 border-0 pb-0' : spacing;

    if (activeTemplate === 'professional') return `flex gap-6 border-b border-slate-100 ${noSpacing}`;
    return isLast ? "mb-0" : 'mb-2'; 
  };

  const getActiveSummary = () => {
      if (!optimizedData) return "";
      if (narrativeVoice === 'first') return optimizedData.summary_v1 || optimizedData.summary;
      return optimizedData.summary_v3 || optimizedData.summary;
  };

  const getActiveBullets = (exp) => {
      if (exp.bullets && Array.isArray(exp.bullets)) return exp.bullets;
      if (narrativeVoice === 'first') return exp.bullets_v1 || exp.bullets;
      return exp.bullets_v3 || exp.bullets;
  };

  const highlightKeywords = (text) => {
    if (!showHighlights || !text) return text;
     
    const sourceList = [
      ...(optimizedData?.analysis?.matches || []),
      ...(optimizedData?.analysis?.additions || [])
    ].filter(Boolean);

    let keywordsToHighlight = [];
    const adjectivePairs = [];

    keywordsToHighlight.push(...sourceList);

    sourceList.forEach(phrase => {
        const words = phrase.split(/[\s,.-]+/); 
        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            const cleanWord = word.trim();
            const lowerWord = cleanWord.toLowerCase();

            if (ADJECTIVES_TO_PAIR.includes(lowerWord) && i + 1 < words.length) {
                const nextWord = words[i+1].trim();
                if (nextWord.length > 2 && !STOP_WORDS.includes(nextWord.toLowerCase()) && !GENERIC_BUSINESS_WORDS.includes(nextWord.toLowerCase())) {
                    adjectivePairs.push(`${cleanWord} ${nextWord}`);
                    i++; 
                    continue;
                }
            }
            if (cleanWord.length > 2 && !STOP_WORDS.includes(lowerWord) && !GENERIC_BUSINESS_WORDS.includes(lowerWord) && !ADJECTIVES_TO_PAIR.includes(lowerWord)) {
                keywordsToHighlight.push(cleanWord);
            }
        }
    });

    keywordsToHighlight = [...adjectivePairs, ...keywordsToHighlight];
    keywordsToHighlight = [...new Set(keywordsToHighlight)].sort((a, b) => b.length - a.length);

    if (keywordsToHighlight.length === 0) return text;

    const parts = [];
    if (keywordsToHighlight.length > 0) {
        const escapedKeywords = keywordsToHighlight.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        parts.push(`(${escapedKeywords.join('|')})`);
    }
    parts.push(`(\\*\\*.*?\\*\\*)`); 

    const regex = new RegExp(parts.join('|'), 'gi');

    return text.split(regex).map((part, index) => {
      if (!part) return null;

      if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
        const cleanPart = part.slice(2, -2);
        const lowerPart = cleanPart.toLowerCase();

        if (ignoredKeywords.has(lowerPart)) {
            return cleanPart; 
        }

        if (!processedWords.has(lowerPart)) {
             processedWords.add(lowerPart);
             return <span key={index} className="font-bold text-slate-900">{cleanPart}</span>;
        }
        return cleanPart;
      }

      if (keywordsToHighlight.some(k => k.toLowerCase() === part.toLowerCase())) {
        const lowerPart = part.toLowerCase();
        if (ignoredKeywords.has(lowerPart)) {
            return part; 
        }

        if (!processedWords.has(lowerPart)) {
             processedWords.add(lowerPart);
             return <span key={index} className="font-bold text-slate-900">{part}</span>;
        }
      }
      return part;
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans p-4 md:p-6 lg:p-10" lang={cvLanguage}>
      
      <style>{`
        #resume-preview {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-rendering: optimizeLegibility;
        }
        #resume-preview b, 
        #resume-preview strong { 
          color: #0f172a !important; 
          font-weight: 700 !important;
        }
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        @media print {
          @page { margin: 0; }
          body { margin: 0; padding: 0; background: white; }
          #resume-preview {
            background: white !important;
            box-shadow: none !important;
            border: none !important;
            overflow: hidden !important; 
          }
          .page-break-avoid {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
          h3 {
            break-after: avoid !important;
            page-break-after: avoid !important;
          }
          ::-webkit-scrollbar { display: none; }
          .no-print { display: none !important; }
        }
      `}</style>
      
      {/* FLOATING TOOLBAR */}
      {toolbarVisible && (
        <div 
          className="fixed z-50 flex items-center bg-slate-900 text-white rounded-lg shadow-xl px-2 py-1 gap-1 animate-in fade-in zoom-in-95 duration-200 no-print"
          style={{ top: toolbarPosition.top, left: toolbarPosition.left }}
        >
          <button 
            onMouseDown={toggleBold}
            className="p-1.5 hover:bg-slate-700 rounded transition-colors"
            title="Kalınlaştır / Vurguyu Kaldır"
          >
            <Bold className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-slate-700 mx-0.5"></div>
          <button 
            onMouseDown={(e) => { e.preventDefault(); applyFormat('italic'); }}
            className="p-1.5 hover:bg-slate-700 rounded transition-colors"
          >
            <Italic className="w-4 h-4" />
          </button>
          
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 rotate-45"></div>
        </div>
      )}

      {/* --- ANA DÜZEN --- */}
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 h-screen lg:overflow-hidden">
        
        {/* --- SOL PANEL (GİRİŞ ALANI) --- */}
        <div className="lg:col-span-5 space-y-6 h-full overflow-y-auto pr-2 pb-20">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            {/* LOGO ALANI - GÜNCELLENDİ: Büyüteç + Belge İkonu */}
            <div className="flex items-center gap-2 mb-6">
               <div className="flex items-center justify-center w-10 h-10 bg-slate-900 rounded-lg shadow-sm relative">
                  <FileText className="w-5 h-5 text-white absolute -ml-1 -mt-1" />
                  <Search className="w-4 h-4 text-amber-400 absolute ml-2 mt-2 stroke-[3]" />
               </div>
               <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                 İlana Göre CV
               </span>
            </div>
            
            <div className="space-y-6">
              {/* PDF Yükleme */}
              <div className="block">
                <span className="text-sm font-bold text-slate-600 mb-2 block">1. Mevcut CV'nizi Yükleyin</span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => fileInputRef.current.click()} 
                    className={`flex-1 flex items-center justify-center gap-2 border-2 border-dashed ${originalCV ? 'border-amber-400 bg-amber-50 text-amber-700' : 'bg-slate-50 border-slate-300 text-slate-600'} p-4 rounded-xl hover:bg-slate-100 transition-all text-sm font-medium`}
                    disabled={isPdfLoading}
                  >
                    {isPdfLoading ? <><RefreshCw className="w-4 h-4 animate-spin" /><span>Okunuyor...</span></> : originalCV ? <><FileCheck className="w-4 h-4" /><span>PDF Yükle</span></> : <><Upload className="w-4 h-4" /><span>PDF Yükle</span></>}
                  </button>
                  {originalCV && (
                    <button onClick={clearPdfData} className="p-4 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors" title="PDF'i Kaldır">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".pdf" className="hidden" />
                </div>
              </div>

              {/* Profil Fotoğrafı */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-sm font-bold text-slate-600 mb-3 block">2. Profil Fotoğrafı</span>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div 
                      onClick={() => photoInputRef.current.click()}
                      className="w-16 h-16 rounded-lg bg-white border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:border-slate-400 transition-colors overflow-hidden group relative"
                    >
                      {profileImage ? (
                        <div className="w-full h-full relative overflow-hidden pointer-events-none flex items-center justify-center bg-slate-100">
                          <img src={profileImage} alt="Profil" className="max-w-none origin-center" style={{ imageRendering: 'high-quality', objectFit: 'contain', width: '100%', height: '100%', transform: `translate(${photoPos.x}px, ${photoPos.y}px) scale(${photoZoom})` }} />
                        </div>
                      ) : <Camera className="w-6 h-6 text-slate-300 group-hover:text-slate-500" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex gap-2 mb-2">
                        <button onClick={() => photoInputRef.current.click()} className="text-[10px] bg-slate-900 text-white px-3 py-1.5 rounded-md font-bold hover:bg-slate-800 transition-colors">DOSYA SEÇ</button>
                        {profileImage && <button onClick={() => setProfileImage(null)} className="text-[10px] bg-slate-900 text-white px-3 py-1.5 rounded-md font-bold hover:bg-slate-800 transition-colors">SİL</button>}
                      </div>
                      <div className="flex gap-2">
                        {shapeOptions.map(shape => (
                           <button key={shape.id} onClick={() => setPhotoShape(shape.id)} className={`p-1.5 border rounded-md transition-all ${photoShape === shape.id ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-400'}`} title={shape.label}>
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
                      <input type="range" min="0.1" max="3" step="0.01" value={photoZoom} onChange={(e) => setPhotoZoom(parseFloat(e.target.value))} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900" />
                    </div>
                  )}
                </div>
              </div>
              
              {/* İş İlanı */}
              <label className="block">
                <span className="text-sm font-bold text-slate-600 mb-2 block">3. Hedef İş İlanı</span>
                <textarea className="w-full h-32 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-slate-900 outline-none" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="İş tanımını buraya yapıştırın..." />
              </label>

              {/* Tasarım ve Özelleştirme */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-5">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2 mb-2">
                    <Settings2 className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-bold text-slate-700">4. Tasarım ve Özelleştirme</span>
                </div>

                {/* Şablon */}
                <div>
                    <span className="text-xs font-bold text-slate-500 mb-2 block flex items-center gap-1"><LayoutTemplate className="w-3 h-3"/> Şablon</span>
                    <div className="grid grid-cols-3 gap-2">{templateOptions.map((template) => (<button key={template.id} onClick={() => setActiveTemplate(template.id)} className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${activeTemplate === template.id ? 'bg-slate-900 border-slate-900 shadow-md text-white' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-400'}`}>{template.icon}<span className="text-[10px] font-bold mt-1.5">{template.name}</span></button>))}</div>
                </div>

                {/* Renk ve İkonlar */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-slate-500 flex items-center gap-1"><Palette className="w-3 h-3"/> Renk & İkonlar</span>
                        <div className="flex gap-2">
                          <button onClick={() => setShowHighlights(!showHighlights)} className={`text-[9px] font-bold px-2 py-0.5 rounded transition-colors border flex items-center gap-1 ${showHighlights ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                             <Highlighter className="w-3 h-3" /> {showHighlights ? 'Vurgular Açık' : 'Vurgular Kapalı'}
                          </button>
                          
                          <button onClick={() => setShowIcons(!showIcons)} className={`text-[9px] font-bold px-2 py-0.5 rounded transition-colors border ${showIcons ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>{showIcons ? 'İkonlar Açık' : 'İkonlar Kapalı'}</button>
                        </div>
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

                {/* Dil ve Hizalama */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Dil */}
                    <div>
                        <span className="text-xs font-bold text-slate-500 mb-2 block flex items-center gap-1"><PenTool className="w-3 h-3"/> Anlatım Dili</span>
                        <div className="grid grid-cols-2 gap-2">
                          <button onClick={() => setNarrativeVoice('first')} className={`p-2 rounded-lg border text-[10px] font-bold transition-all ${narrativeVoice === 'first' ? 'bg-slate-900 border-slate-900 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-400'}`}>1. Tekil (Yaptım)</button>
                          <button onClick={() => setNarrativeVoice('third')} className={`p-2 rounded-lg border text-[10px] font-bold transition-all ${narrativeVoice === 'third' ? 'bg-slate-900 border-slate-900 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-400'}`}>3. Tekil (Yaptı)</button>
                        </div>
                    </div>
                    {/* Metin Hizalama */}
                    <div>
                        <span className="text-xs font-bold text-slate-500 mb-2 block flex items-center gap-1"><AlignJustify className="w-3 h-3"/> Metin Hizalama</span>
                        <div className="flex bg-white rounded-lg border border-slate-200 p-1 gap-1">
                          {alignmentOptions.map((option) => (
                            <button
                              key={option.id}
                              onClick={() => setTextAlign(option.id)}
                              className={`flex-1 flex items-center justify-center p-1.5 rounded transition-all ${textAlign === option.id ? 'bg-slate-900 text-white shadow-sm ring-1 ring-slate-900' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
                              title={option.label}
                            >
                              {option.icon}
                            </button>
                          ))}
                        </div>
                    </div>
                </div>
              </div>

              {/* Aksiyon */}
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => handleOptimize('tr')} disabled={isLoading} className="bg-slate-900 text-white border-2 border-slate-900 font-bold py-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 hover:bg-black hover:border-black active:scale-[0.98] disabled:opacity-50">{isLoading && cvLanguage === 'tr' ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />} Türkçe CV Tasarla</button>
                <button onClick={() => handleOptimize('en')} disabled={isLoading} className="bg-slate-900 text-white border-2 border-slate-900 font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 hover:bg-black hover:border-black active:scale-[0.98] disabled:opacity-50">{isLoading && cvLanguage === 'en' ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Globe className="w-5 h-5" />} İngilizce CV Tasarla</button>
              </div>
              {error && <p className="text-red-500 text-xs font-bold flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {error}</p>}
            </div>
            
            {/* Analiz & Ekleme */}
            {optimizedData && !isLoading && (
              <>
                {optimizedData.analysis && (
                  <div className="mt-8 pt-8 border-t border-slate-200 animate-in slide-in-from-top-4 duration-700">
                    <h3 className="flex items-center gap-2 font-bold text-lg mb-4 text-slate-800"><BarChart3 className="w-5 h-5 text-blue-600" />{translations[cvLanguage].analysisTitle}</h3>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center"><span className="text-xs text-slate-500 font-bold uppercase block mb-1">{translations[cvLanguage].scoreBefore}</span><span className={`text-3xl font-black ${getScoreColor(optimizedData.analysis.original_score)}`}>%{optimizedData.analysis.original_score}</span></div>
                      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center relative overflow-hidden"><div className="absolute top-0 right-0 p-1"><TrendingUp className="w-4 h-4 text-blue-500" /></div><span className="text-xs text-blue-700 font-bold uppercase block mb-1">{translations[cvLanguage].scoreAfter}</span><span className="text-3xl font-black text-blue-700">%{optimizedData.analysis.optimized_score}</span></div>
                    </div>
                    <div className="space-y-4">
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
                     <select value={addItemSection} onChange={(e) => setAddItemSection(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-slate-900 outline-none">
                       {sectionOptions.map(opt => (<option key={opt.id} value={opt.id}>{cvLanguage === 'tr' ? opt.labelTr : opt.labelEn}</option>))}
                     </select>
                     {/* --- YENİ BAŞLIK GİRİŞİ --- */}
                     {addItemSection === 'custom' && (
                        <input 
                            type="text" 
                            value={addItemTitle} 
                            onChange={(e) => setAddItemTitle(e.target.value)} 
                            placeholder={cvLanguage === 'tr' ? "Bölüm Başlığı (Örn: Projeler, Sertifikalar)" : "Section Title (e.g. Projects, Certificates)"}
                            className="w-full p-3 bg-white border-2 border-purple-100 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 outline-none font-bold text-purple-900 placeholder-purple-300"
                        />
                     )}
                     <textarea value={addItemInput} onChange={(e) => setAddItemInput(e.target.value)} placeholder={cvLanguage === 'tr' ? "Örn: Geçen yaz freelance olarak bir React projesi yaptım..." : "Ex: I worked on a freelance React project last summer..."} className="w-full h-24 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-slate-900 outline-none resize-none" />
                     <button onClick={handleAddItem} disabled={isAddingItem || !addItemInput.trim() || (addItemSection === 'custom' && !addItemTitle.trim())} className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 hover:bg-black active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
                       {isAddingItem ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} {translations[cvLanguage].addBtn}
                     </button>
                   </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* --- SAĞ PANEL (ÖNİZLEME ALANI) --- */}
        <div className="lg:col-span-7 h-full overflow-y-auto pl-2 pb-20 bg-slate-200/50 rounded-xl p-4">
          <div className="sticky top-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-slate-500 uppercase tracking-widest text-sm">Canlı Önizleme ({cvLanguage.toUpperCase()})</h2>
              </div>
              <div className="flex gap-2">
                {optimizedData && !isLoading && (
                  <>
                    <button onClick={copyAsText} className="text-xs bg-slate-900 text-white border border-slate-900 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-black transition-colors">{copySuccess ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-white" />} KOPYALA</button>
                    <button onClick={handleDownloadPdf} disabled={isDownloading} className="text-xs bg-slate-900 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-md transition-all active:scale-95 disabled:opacity-50 hover:bg-black">{isDownloading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} PDF İNDİR</button>
                  </>
                )}
              </div>
            </div>

            <div 
              id="resume-preview" 
              ref={resumeRef}
              className={`bg-white mx-auto relative overflow-hidden select-none ${activeTemplate === 'classic' ? 'font-serif' : 'font-sans'}`} 
              style={{ 
                 width: '794px',
                 height: '1123px',
                 boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                 paddingTop: activeTemplate === 'professional' ? '40px' : '32px',
                 paddingRight: activeTemplate === 'professional' ? '40px' : '32px',
                 paddingLeft: activeTemplate === 'professional' ? '40px' : '32px',
                 paddingBottom: '0px' 
              }} 
            >
              
              {/* --- MODERN LOADING VE OYUN ALANI --- */}
              {isLoading ? (
                <div className="h-full flex flex-col items-center justify-center p-12 animate-in fade-in duration-500 bg-slate-50 absolute inset-0 z-50 relative overflow-hidden select-none">
                    
                    {/* OYUN HEDEFLERİ (TARGETS) */}
                    {gameTargets.map(target => (
                        <div 
                            key={target.id}
                            className="absolute cursor-pointer animate-bounce transition-transform active:scale-90 z-20"
                            style={{ left: `${target.x}%`, top: `${target.y}%` }}
                            onMouseDown={() => handleGameClick(target.id)}
                        >
                            {target.type === 'briefcase' && <Briefcase className="w-8 h-8 text-blue-500 drop-shadow-md" />}
                            {target.type === 'star' && <Star className="w-8 h-8 text-yellow-500 fill-yellow-500 drop-shadow-md" />}
                            {target.type === 'money' && <Banknote className="w-8 h-8 text-green-600 drop-shadow-md" />}
                            {target.type === 'coffee' && <Coffee className="w-8 h-8 text-amber-700 drop-shadow-md" />}
                        </div>
                    ))}

                    <div className="relative w-32 h-32 flex items-center justify-center mb-8 pointer-events-none z-10">
                        <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-20"></div>
                        <div className="absolute inset-2 bg-blue-50 rounded-full animate-pulse"></div>
                        
                        <div className="relative z-10 text-blue-600">
                            {loadingProgress < 30 && <FileSearch className="w-12 h-12 animate-bounce" />}
                            {loadingProgress >= 30 && loadingProgress < 60 && <Cpu className="w-12 h-12 animate-spin-slow" />}
                            {loadingProgress >= 60 && <PenLine className="w-12 h-12 animate-pulse" />}
                        </div>
                        
                        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="4" />
                            <circle 
                                cx="50" cy="50" r="45" fill="none" stroke={themeColor} strokeWidth="4" 
                                strokeDasharray="283" 
                                strokeDashoffset={283 - (283 * loadingProgress / 100)} 
                                strokeLinecap="round"
                                className="transition-all duration-300 ease-out"
                            />
                        </svg>
                    </div>

                    <h3 className="text-xl font-bold text-slate-800 mb-2 animate-pulse text-center pointer-events-none z-10">{loadingText}</h3>
                    
                    <div className="w-64 h-2 bg-slate-200 rounded-full overflow-hidden mt-4 pointer-events-none z-10">
                        <div 
                            className="h-full rounded-full transition-all duration-300 ease-out relative overflow-hidden" 
                            style={{ width: `${loadingProgress}%`, backgroundColor: themeColor }}
                        >
                            <div className="absolute inset-0 bg-white/30 skew-x-12 animate-[shimmer_1.5s_infinite]"></div>
                        </div>
                    </div>
                    <p className="text-xs font-bold text-slate-400 mt-2 pointer-events-none z-10">%{Math.round(loadingProgress)}</p>

                    {/* OYUN SKOR TABLOSU */}
                    <div className="mt-8 flex flex-col items-center animate-in slide-in-from-bottom-4 duration-700 pointer-events-none z-10">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                            <MousePointer2 className="w-3 h-3" /> Kariyer Avcısı
                        </p>
                        <div className="bg-white px-6 py-2 rounded-full shadow-sm border border-slate-200 flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-yellow-500" />
                            <span className="font-black text-slate-700 text-lg">{gameScore}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-2">Beklerken ikonları yakala!</p>
                    </div>
                </div>
              ) : optimizedData ? (
                <div className={`animate-in fade-in duration-700 ${activeTemplate !== 'classic' ? 'grid grid-cols-2 gap-x-6 gap-y-0' : ''}`}>
                    {/* --- KONFETİ EFEKTİ --- */}
                    {showConfetti && confettiParticles.map(p => <ConfettiParticle key={p.id} style={p.style} />)}
                    
                    {/* HEADER */}
                  <div className={`${activeTemplate !== 'classic' ? 'col-span-2' : ''} flex ${getHeaderStyle()} mb-3`}>
                    <div className={`${activeTemplate === 'classic' ? 'text-center w-full' : 'flex-1 pr-6'}`}>
                      <h1 
                        className={`text-4xl font-bold uppercase tracking-tight mb-2 ${editableClass} ${activeTemplate === 'classic' ? 'text-slate-900' : ''}`} 
                        style={{ color: activeTemplate === 'classic' ? '#000' : themeColor }}
                        contentEditable suppressContentEditableWarning 
                        onBlur={(e) => updateField('name', e.target.innerText)}
                      >
                        {optimizedData.name}
                      </h1>
                      <h2 
                        className={`text-xl font-bold text-slate-800 mb-2 ${editableClass} ${activeTemplate === 'classic' ? 'text-slate-600 font-medium' : ''}`} 
                        contentEditable 
                        suppressContentEditableWarning 
                        onBlur={(e) => updateField('title', e.target.innerText)}
                      >
                        {optimizedData.title}
                      </h2>
                      
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
                    const shortSections = ['skills', 'additional', ...sectionsOrder.filter(s => s.startsWith('custom_'))];
                    
                    if (activeTemplate === 'modern' && shortSections.includes(sectionId)) {
                      const prev = sectionsOrder[index - 1];
                      const next = sectionsOrder[index + 1];
                      const isNeighborRelated = (shortSections.includes(prev) || shortSections.includes(next));
                      if (isNeighborRelated) colSpan = 'col-span-2 lg:col-span-1';
                    }

                    if (sectionId.startsWith('custom_') && optimizedData[sectionId] && typeof optimizedData[sectionId][0] === 'object') {
                          colSpan = 'col-span-2';
                    }

                    return (
                      <div 
                        key={sectionId}
                        style={{ pageBreakInside: 'avoid' }}
                        className={`${colSpan} ${getSectionContainerStyle(isLast)} cursor-move relative group rounded-lg transition-all duration-300 ease-in-out border border-transparent hover:border-slate-100/50 hover:bg-slate-50/30 -mx-2 px-2 py-2 page-break-avoid`}
                        draggable
                        onDragStart={(e) => { dragItem.current = index; e.target.style.opacity = '0.5'; e.dataTransfer.effectAllowed = 'move'; }}
                        onDragEnter={(e) => { dragOverItem.current = index; if (dragItem.current !== null && dragItem.current !== index) handleSort(); }}
                        onDragEnd={(e) => { e.target.style.opacity = '1'; dragItem.current = null; dragOverItem.current = null; }}
                        onDragOver={(e) => e.preventDefault()}
                      >
                          <div className="absolute -left-5 top-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-move p-1 text-slate-300 hover:text-slate-500"><Move className="w-4 h-4" /></div>

                          {/* --- BÖLÜM BAŞLIĞI VE SİLME BUTONU --- */}
                          <div className="relative group/header flex items-center">
                              <h3 
                                className={`${getSectionTitleStyle()} ${editableClass} flex-grow`} 
                                style={{ color: activeTemplate === 'classic' ? '#333' : themeColor, borderColor: activeTemplate === 'classic' ? '#ddd' : themeColor }}
                                contentEditable 
                                suppressContentEditableWarning
                                onBlur={(e) => setCustomHeadings(prev => ({ ...prev, [sectionId]: e.target.innerText }))}
                              >
                                {customHeadings[sectionId] || (sectionId.startsWith('custom_') ? 'YENİ BÖLÜM' : toUpper(translations[cvLanguage][sectionId]))}
                              </h3>
                              
                              <button 
                                onClick={() => handleRemoveMainSection(sectionId)}
                                className="absolute right-0 top-0 opacity-0 group-hover/header:opacity-100 transition-opacity p-1 text-red-300 hover:text-red-500 hover:bg-red-50 rounded"
                                title="Bu bölümü sil"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                          </div>

                          <div className={activeTemplate === 'professional' ? 'flex-1' : ''}>
                            {sectionId === 'summary' && (
                               <p key={`summary-${showHighlights ? 'hl' : 'no'}`} className={`text-[11px] leading-tight text-slate-700 ${editableClass} ${textAlign}`} contentEditable suppressContentEditableWarning onBlur={(e) => updateField('summary', e.target.innerText)}>
                                {highlightKeywords(getActiveSummary())}
                               </p>
                            )}

                            {/* --- İŞ DENEYİMİ VE DETAYLI CUSTOM BÖLÜMLER --- */}
                            {(sectionId === 'experience' || (sectionId.startsWith('custom_') && optimizedData[sectionId] && typeof optimizedData[sectionId][0] === 'object')) && optimizedData[sectionId].map((exp, idx) => (
                               <div key={`${exp.id || idx}-${showHighlights ? 'hl' : 'no'}`} className="mb-1.5 last:mb-0 relative group/item transition-all duration-500 ease-in-out" draggable onDragStart={(e) => onSubDragStart(e, sectionId, idx)} onDragOver={(e) => onSubDragOver(e, sectionId, idx)} onDragEnd={onSubDragEnd}>
                                 <div className="absolute -left-4 top-1 opacity-0 group-hover/item:opacity-100 transition-opacity cursor-move p-1 text-slate-300 hover:text-blue-500"><Move className="w-3 h-3" /></div>
                                 {/* --- YENİ KONUM: İŞ DENEYİMİ SİLME BUTONU SOL TARAFTA (Taşıma ikonunun yanında) --- */}
                                 <button onClick={() => removeSectionItem(sectionId, idx)} className="absolute -left-9 top-1 p-1 text-red-300 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity" title="Bu kaydı sil"><Trash2 className="w-3 h-3" /></button>
                                 
                                 <div className="flex justify-between items-baseline mb-0.5">
                                   <h4 className="font-bold text-[13px] text-slate-900 leading-snug">
                                     <span className={editableClass} contentEditable suppressContentEditableWarning onBlur={(e) => updateArrayField(sectionId, idx, 'role', e.target.innerText)}>{highlightKeywords(exp.role)}</span>
                                     {activeTemplate !== 'professional' && <span className={`font-medium text-slate-600 ${editableClass}`} contentEditable suppressContentEditableWarning onBlur={(e) => updateArrayField(sectionId, idx, 'company', e.target.innerText)}>, {exp.company}</span>}
                                   </h4>
                                   {/* --- YENİ TARİH ALANI (PLACEHOLDER & SİLME BUTONLU) --- */}
                                   <div className="flex items-center gap-1 ml-auto flex-shrink-0 relative group/date">
                                      <span 
                                          className={`${editableClass} text-[11px] font-bold italic whitespace-nowrap ${!exp.date ? 'text-slate-300 print:hidden' : 'text-slate-500'}`} 
                                          contentEditable 
                                          suppressContentEditableWarning 
                                          onBlur={(e) => updateArrayField(sectionId, idx, 'date', e.target.innerText)}
                                      >
                                          {exp.date || "Tarih Ekle"}
                                      </span>
                                      {exp.date && (
                                          <button 
                                              onClick={() => updateArrayField(sectionId, idx, 'date', '')} 
                                              className="opacity-0 group-hover/date:opacity-100 text-red-400 hover:text-red-600 transition-opacity absolute -right-4 top-0 p-0.5"
                                              title="Tarihi Sil"
                                          >
                                              <Trash2 className="w-3 h-3"/>
                                          </button>
                                      )}
                                   </div>
                                 </div>
                                 {activeTemplate === 'professional' && <p className={`text-[12px] font-semibold text-slate-600 mb-1 ${editableClass}`} contentEditable suppressContentEditableWarning onBlur={(e) => updateArrayField(sectionId, idx, 'company', e.target.innerText)}>{exp.company}</p>}
                                 <ul className={`list-disc ml-4 space-y-0.5 ${textAlign}`}>
                                   {getActiveBullets(exp).map((b, bIdx) => (
                                    <li key={bIdx} className={`text-[11px] text-slate-700 ${editableClass} relative group/subitem pr-6`} contentEditable suppressContentEditableWarning onBlur={(e) => updateBulletPoint(sectionId, idx, bIdx, e.target.innerText)}>
                                            {highlightKeywords(b)}
                                            {/* --- YENİ KONUM: BULLET SİLME BUTONU İÇERİDE SAĞDA --- */}
                                            <button onClick={() => removeBulletPoint(sectionId, idx, bIdx)} className="absolute right-0 top-0 opacity-0 group-hover/subitem:opacity-100 text-red-300 hover:text-red-500 transition-opacity"><Trash2 className="w-3 h-3" /></button>
                                    </li>
                                   ))}
                                 </ul>
                               </div>
                            ))}

                            {sectionId === 'education' && optimizedData.education.map((edu, idx) => (
                               <div key={`${edu.id || idx}-${showHighlights ? 'hl' : 'no'}`} className="mb-1 last:mb-0 relative group/item transition-all duration-500 ease-in-out" draggable onDragStart={(e) => onSubDragStart(e, 'education', idx)} onDragOver={(e) => onSubDragOver(e, 'education', idx)} onDragEnd={onSubDragEnd}>
                                 <div className="absolute -left-4 top-1 opacity-0 group-hover/item:opacity-100 transition-opacity cursor-move p-1 text-slate-300 hover:text-blue-500"><Move className="w-3 h-3" /></div>
                                 {/* --- YENİ KONUM: EĞİTİM SİLME BUTONU SOL TARAFTA --- */}
                                 <button onClick={() => removeSectionItem('education', idx)} className="absolute -left-9 top-1 p-1 text-red-300 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity" title="Bu kaydı sil"><Trash2 className="w-3 h-3" /></button>
                                 
                                 <div className="flex justify-between items-baseline">
                                   <div className={`flex-1 leading-tight text-[13px] ${editableClass}`}>
                                      <span className="font-bold text-slate-900" contentEditable suppressContentEditableWarning onBlur={(e) => updateArrayField('education', idx, 'degree', e.target.innerText)}>{edu.degree}</span>
                                      <span className="mx-1.5 text-slate-300">|</span>
                                      <span className="font-medium text-slate-600" contentEditable suppressContentEditableWarning onBlur={(e) => updateArrayField('education', idx, 'school', e.target.innerText)}>{edu.school}</span>
                                   </div>
                                   {/* --- YENİ TARİH ALANI (EĞİTİM İÇİN) --- */}
                                   <div className="flex items-center gap-1 ml-2 flex-shrink-0 relative group/date">
                                      <span 
                                          className={`${editableClass} text-[11px] font-bold italic whitespace-nowrap ${!edu.date ? 'text-slate-300 print:hidden' : 'text-slate-500'}`} 
                                          contentEditable 
                                          suppressContentEditableWarning 
                                          onBlur={(e) => updateArrayField('education', idx, 'date', e.target.innerText)}
                                      >
                                          {edu.date || "Tarih Ekle"}
                                      </span>
                                      {edu.date && (
                                          <button 
                                              onClick={() => updateArrayField('education', idx, 'date', '')} 
                                              className="opacity-0 group-hover/date:opacity-100 text-red-400 hover:text-red-600 transition-opacity absolute -right-4 top-0 p-0.5"
                                              title="Tarihi Sil"
                                          >
                                              <Trash2 className="w-3 h-3"/>
                                          </button>
                                      )}
                                   </div>
                                 </div>
                                 {edu.details && (
                                    <div className="relative group/desc mt-0.5 pr-6">
                                            <p className={`text-[10px] text-slate-500 leading-snug ${editableClass} ${textAlign}`} contentEditable suppressContentEditableWarning onBlur={(e) => updateArrayField('education', idx, 'details', e.target.innerText)}>
                                                {highlightKeywords(edu.details)}
                                            </p>
                                            <button 
                                                onClick={() => updateArrayField('education', idx, 'details', '')}
                                                className="absolute right-0 top-0 opacity-0 group-hover/desc:opacity-100 text-red-300 hover:text-red-500 transition-opacity"
                                                title="Açıklamayı Sil"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                    </div>
                                 )}
                               </div>
                            ))}

                            {sectionId === 'skills' && (
                               <div key={`skills-${showHighlights ? 'hl' : 'no'}`} className="grid grid-cols-4 gap-x-2 gap-y-0.5">
                                 {optimizedData.skills.map((s, i) => (
                                   <div key={i} className={`text-[11px] text-slate-700 flex items-center gap-1 ${editableClass} relative group/item cursor-move leading-normal pr-4`} contentEditable suppressContentEditableWarning onBlur={(e) => updateSimpleList('skills', i, e.target.innerText)} draggable onDragStart={(e) => onSubDragStart(e, 'skills', i)} onDragOver={(e) => onSubDragOver(e, 'skills', i)} onDragEnd={onSubDragEnd}>
                                     <div className="absolute -left-3 opacity-0 group-hover/item:opacity-100 transition-opacity p-0.5 text-slate-300 hover:text-blue-500"><Move className="w-2.5 h-2.5" /></div>
                                     {/* --- YENİ KONUM: SKILL SİLME BUTONU İÇERİDE SAĞDA --- */}
                                     <button onClick={() => removeSectionItem('skills', i)} className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover/item:opacity-100 text-red-300 hover:text-red-500 transition-opacity"><Trash2 className="w-3 h-3" /></button>
                                     <span className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: themeColor }}></span> 
                                     <span className="break-words">{highlightKeywords(s)}</span>
                                   </div>
                                 ))}
                               </div>
                            )}

                            {/* --- GENEL "EK BİLGİLER" VEYA "BASİT (SIMPLE) CUSTOM" BÖLÜMLER --- */}
                            {(sectionId === 'additional' || (sectionId.startsWith('custom_') && optimizedData[sectionId] && typeof optimizedData[sectionId][0] !== 'object')) && optimizedData[sectionId] && (
                               <div key={`cust-${sectionId}-${showHighlights ? 'hl' : 'no'}`} className="grid grid-cols-3 gap-x-4 gap-y-1">
                                 {optimizedData[sectionId].map((a, i) => (
                                   <div key={i} className={`text-[11px] text-slate-700 ${editableClass} relative group/item cursor-move flex items-center gap-1 leading-normal pr-6`} contentEditable suppressContentEditableWarning onBlur={(e) => updateSimpleList(sectionId, i, e.target.innerText)} draggable onDragStart={(e) => onSubDragStart(e, sectionId, i)} onDragOver={(e) => onSubDragOver(e, sectionId, i)} onDragEnd={onSubDragEnd}>
                                     <div className="absolute -left-4 top-0.5 opacity-0 group-hover/item:opacity-100 transition-opacity p-0.5 text-slate-300 hover:text-blue-500"><Move className="w-3 h-3" /></div>
                                     {/* --- YENİ KONUM: CUSTOM ITEM SİLME BUTONU İÇERİDE SAĞDA --- */}
                                     <button onClick={() => removeSectionItem(sectionId, i)} className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover/item:opacity-100 text-red-300 hover:text-red-500 transition-opacity"><Trash2 className="w-3 h-3" /></button>
                                     <span className="mr-1">•</span> <span className="break-words">{highlightKeywords(a)}</span>
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
                <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-30 relative select-none">
                  <FileText className="w-20 h-20" style={{ color: themeColor }} />
                  <p className="text-sm font-bold tracking-widest uppercase text-center px-8">Verileri doldurun ve bir dil seçerek tasarlayın</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- UNDO NOTIFICATION (TOAST) --- */}
      {lastDeletedSection && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-4 z-50 animate-in slide-in-from-bottom-4 duration-300 border border-slate-700">
           <span className="text-sm font-medium">Bölüm silindi</span>
           <div className="h-4 w-px bg-slate-600"></div>
           <button onClick={handleUndoDelete} className="text-sm font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
              <Undo2 className="w-4 h-4" /> GERİ AL
           </button>
           <button onClick={() => setLastDeletedSection(null)} className="ml-2 text-slate-400 hover:text-white transition-colors">
              <XCircle className="w-5 h-5" />
           </button>
        </div>
      )}

    </div>
  );
};

export default App;