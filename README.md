# 📄 Hazır CV (Resumatch) - AI-Powered Career Assistant

[![Live Demo](https://img.shields.io/badge/Live_Demo-hazircv.com.tr-blue?style=for-the-badge)](https://hazircv.com.tr)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Powered_by-Google_Gemini-8E75B2?style=for-the-badge)](https://deepmind.google/technologies/gemini/)

Hazır CV is an intelligent SaaS platform designed to solve the most time-consuming part of the job application process: tailoring your resume for every single job posting. By leveraging AI, it analyzes your base CV and the target job description to generate a highly optimized, ATS-friendly resume in seconds.

## ✨ Key Features

* **🎯 AI-Driven Resume Tailoring:** Upload your base CV (PDF) and paste the job description. The AI rewrites and reorganizes your experience to highlight the exact skills the employer is looking for.
* **📊 ATS Compatibility Analysis:** Get instant feedback on your resume. The system provides a match score, identifies skill gaps, and transparently shows which strategic keywords were added.
* **🎙️ Interactive Mock Interviews:** Practice before the real thing. Engage in dynamic, chat-based interviews with AI acting as an HR Specialist or Tech Lead, based specifically on your newly generated CV and the job posting. Get a detailed evaluation report at the end.
* **🎨 Live WYSIWYG Editing & Customization:** Edit your generated CV on the fly. Change templates, tweak color palettes, adjust text alignment, and switch between 1st-person and 3rd-person narrative voices with a single click.
* **🖨️ High-Fidelity PDF Export:** Download your polished, print-ready CV instantly without losing any formatting or styling.
* **🌍 Multilingual Support:** Generate and format resumes in both Turkish and English.

## 🛠️ Tech Stack

* **Frontend:** React.js, Vite, Tailwind CSS
* **Icons & UI:** Lucide React
* **AI Engine:** Google Gemini Pro API (via custom backend)
* **PDF Processing:** `pdf.js` (parsing), `html2canvas` & `jsPDF` (export rendering)
* **Hosting & Analytics:** Vercel

## 🚀 How It Works

1.  **Upload:** Drop your existing resume (PDF format).
2.  **Target:** Paste the job description of the role you are applying for.
3.  **Generate:** Click the optimize button (TR/EN). The AI engine processes the data and generates a tailored resume.
4.  **Review & Edit:** Check your ATS score, read the feedback, and make live edits directly on the preview panel.
5.  **Practice:** Start a mock interview simulation to prepare for HR or Technical screening.
6.  **Download:** Export your perfect CV as a PDF.

## 💻 Local Development

To run this project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone [https://github.com/yourusername/resumatch.git](https://github.com/yourusername/resumatch.git)
