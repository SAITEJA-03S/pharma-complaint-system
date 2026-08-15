# 💊 PharmaQMS AI - Customer Complaint Management & Quality System
## Pharmaceutical Active Pharmaceutical Ingredients (API) & Finished Dosage Forms (FDF) Quality Assurance Module

[![Stack](https://img.shields.io/badge/Stack-React_|_Redux_Toolkit_|_Vite_|_FastAPI-blue.svg)](#mandatory-technology-stack)
[![AI Engine](https://img.shields.io/badge/AI-LangGraph_|_Groq_gemma2--9b--it_|_Edge_Fallback-orange.svg)](#ai-agent--langgraph-workflow)
[![Deployment](https://img.shields.io/badge/Deployment-Vercel_|_Render_Ready-success.svg)](#-deployment--hosting)

An end-to-end, high-tech AI-powered Quality Management System (QMS) Customer Complaint Processing & Intake Module engineered for pharmaceutical API and FDF manufacturing compliance. Built for the **AIVOA.AI AI Product Engineer** evaluation.

---

## 🌟 Key Modules & Next-Level Features

### 1. 📝 Log Customer Complaint & Intake Module
- **Origin & Customer Details**: Complaint Source, Customer/Hospital/Distributor Name.
- **Product & Batch Identification**: Product Name, Strength/Grade, Batch/Lot Number, Manufacturing Date, Expiry Date, Quantity Affected.
- **Defect Classification & Description**: Complaint Type (*Packaging & Sealing, Quality/Purity, Contamination, Labeling, Therapeutic Efficacy*), Complaint Date, Detailed Defect Description.
- **Initial Severity & Priority Triage**: Low, Medium, High, Critical.
- **Soft Glowing Field Highlights**: Fields auto-extracted by AI highlight in soft green (`.extracted`) with subtle glow animations.
- **Printable Audit Record**: 1-click printable GMP complaint log document.

### 2. 🤖 AI Document Intake & Copilot Assistant
- **File Drag & Drop**: Supports `PDF`, `DOCX`, `TXT`, and `EML` files (parsed using PyPDF2 & NLP heuristics).
- **Paste Text / Email**: Direct raw incident text intake.
- **Real-Time Progress Tracker**: Visual progress bar tracking document upload, LangGraph node execution, and risk assessment.
- **1-Click Demo Samplers**:
  - 💊 *Paracetamol 500mg Discoloration*
  - 🧪 *Amoxicillin API Contamination*
  - 📦 *Ibuprofen Packaging Leak*
- **Interactive Chat Copilot**: Context-aware assistant answering questions on current complaint batch, risk level, and CAPA.

### 3. 📊 Executive Quality & Risk Analytics Dashboard (NEW)
- **Real-Time KPIs**: Total Complaints, Critical Class I Defects, Regulatory Escalations (FDA/EMA), Average Audit Readiness Score.
- **Complaint Category Distribution**: Visual progress breakdown across Quality, Packaging, Contamination, Labeling, and Efficacy.
- **Severity Matrix Breakdown**: Critical, High, Medium, and Low risk volume distribution.

### 4. ⚙️ AI Copilot & Risk Assessment Suite (6 Advanced Tools)
1. **Complaint Completeness Checker**: Calculates completion %, missing required fields list, and audit readiness status.
2. **AI Risk Classification & Matrix**: Generates Risk Score (0-100), Risk Level (Critical/High/Medium/Low), and flags mandatory regulatory escalation (FDA Class I Recall / EMA notification).
3. **Duplicate Complaint Detection**: Matches against historical SQLite complaints database by batch number & semantic text similarity.
4. **Root Cause Analysis (5-Whys Cascade)**: Generates 5-Why investigation tree, root cause category, and probable cause.
5. **CAPA Recommendation Engine**: Recommends Immediate Corrective Actions, Long-term Preventive Actions, target timeline (14 days), and responsible department.
6. **Executive QA Audit Summary**: One-click summary briefing for Quality Assurance leadership.

### 5. 📂 Complaints Registry & Master Database
- **Search & Filter**: Real-time filtering by Product, Batch Number, Customer, or Defect Type.
- **Audit Detail View**: Pop-up modal with complete complaint history, risk score, and print option.
- **Export Capabilities**: 1-click CSV report export for QA quality review.

### 6. 🌐 Hybrid Standalone / Online Engine
- **Online Mode**: Connects directly to FastAPI backend (`http://localhost:8000`) for LangGraph execution & SQLite database.
- **Standalone Edge Mode**: If deployed statically (e.g. on Vercel) or running offline, the client seamlessly switches to an embedded **Edge AI Parser & LocalStorage DB** without throwing network error alerts.

---

## 🛠️ Mandatory Technology Stack

- **Frontend**: React.js with **Redux Toolkit**, **Vite**, **Lucide Icons**, and custom Glassmorphic CSS design system with Google `Inter` & `Outfit` typography.
- **Backend**: Python 3.11 with **FastAPI** & Uvicorn.
- **AI Agent Framework**: **LangGraph** (`StateGraph`) state machine agent.
- **LLM Integration**: **Groq API** (`gemma2-9b-it`) with built-in heuristic fallback parsing if API key is not supplied.
- **Database**: SQLite (`complaints.db`) with client-side localStorage fallback.

---

## 🚀 Quick Start & Local Setup

### 1. Backend Setup (FastAPI + LangGraph)
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt

# Run FastAPI Server
uvicorn main:app --reload --port 8000
```
*Backend Swagger API docs available at `http://localhost:8000/docs`.*

### 2. Frontend Setup (React + Redux Toolkit)
```bash
cd frontend
npm install
npm run dev
```
*Frontend UI will launch at `http://localhost:3000` (or `http://localhost:5173`).*

---

## ☁️ Deployment & Hosting

### Deploying Frontend to Vercel
1. Connect your GitHub repository to **Vercel**.
2. Set Root Directory to `frontend`.
3. Build command: `npm run build`, Output directory: `dist`.
4. Vercel automatically deploys the SPA with client-side Edge AI fallback.

### Deploying Backend to Render / Railway
1. Create a Web Service on **Render**.
2. Build Command: `pip install -r backend/requirements.txt`
3. Start Command: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`

---

## 📄 License & Attribution
Built for AIVOA.AI Candidate Evaluation (AI Product Engineer).
