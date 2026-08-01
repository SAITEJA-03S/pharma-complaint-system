# AI-Powered Customer Complaint Management System
## Pharmaceutical Manufacturing API & FDF Quality Assurance Module

[![Stack](https://img.shields.io/badge/Stack-React_|_Redux_|_FastAPI_|_LangGraph-blue.svg)](#mandatory-technology-stack)
[![LLM](https://img.shields.io/badge/LLM-Groq_gemma2--9b--it-orange.svg)](#llm-agent--langgraph-workflow)

This project is built for the **AIVOA.AI AI Product Engineer (Fresher)** assessment. It is an end-to-end AI-powered Quality Management System (QMS) Customer Complaint Processing Module tailored for pharmaceutical Active Pharmaceutical Ingredients (API) and Finished Dosage Forms (FDF).

---

## 🌟 Key Features & Workflow

### 1. Log Customer Complaint Module
Matches the official reference UI:
- **Origin & Customer Details**: Complaint Source, Customer Name.
- **Product & Batch Identification**: Product Name, Strength/Grade, Batch/Lot Number, Mfg Date, Expiry Date, Quantity Affected.
- **Complaint Details**: Complaint Type (Quality/Purity, Packaging, Contamination, Labeling, Efficacy), Complaint Date, Detailed Description.
- **Initial Assessment & Priority**: Initial Severity & Priority dropdowns.
- **Redux State Sync**: Auto-filled fields from AI extraction highlight in smooth soft green (`.extracted`).

### 2. AI Complaint Intake Assistant
- **File Drag & Drop**: Supports `PDF`, `DOCX`, `TXT`, `EML` files (with PyPDF2 document parsing).
- **Paste Text / Email**: Raw text intake option.
- **Live Progress Tracker**: 0-100% extraction state tracker with real-time status steps.
- **Interactive Q&A Chat**: Context-aware AI assistant to answer questions about the loaded complaint.
- **1-Click Demo Samplers**: Pre-loaded pharmaceutical complaint scenarios (*Paracetamol 500mg Discoloration*, *Amoxicillin API Contamination*, *Ibuprofen Packaging Leak*).

### 3. Bonus AI Tools Suite (6 Advanced Features)
1. **Complaint Completeness Checker**: Calculates completion %, missing required fields list, and audit readiness status.
2. **AI Risk Classification & Escalation**: Generates Risk Score (0-100), Risk Level (Critical/High/Medium/Low), and flags mandatory regulatory escalation (FDA/EMA).
3. **Duplicate Complaint Detection**: Matches against historical SQLite complaints database by batch number & semantic text similarity.
4. **Root Cause Analysis (5-Whys)**: Generates 5-Why investigation tree, root cause category, and probable cause.
5. **CAPA Recommendation Engine**: Recommends Immediate Corrective Actions, Long-term Preventive Actions, target timeline, and responsible department.
6. **Executive Complaint Summary**: One-click summary for Quality Assurance leadership.

---

## 🛠️ Mandatory Technology Stack

- **Frontend**: React.js with **Redux Toolkit** for state management, **Lucide Icons**, and Google Inter typography.
- **Backend**: Python 3.11 with **FastAPI** & Uvicorn.
- **AI Agent Framework**: **LangGraph** (`StateGraph`) state machine agent.
- **LLM Integration**: **Groq API** (`gemma2-9b-it` / `llama-3.3-70b-versatile`) with built-in heuristic fallback parsing if API key is not supplied.
- **Database**: SQLite (`complaints.db`).

---

## 🚀 Quick Start & Installation

### 1. Backend Setup (FastAPI + LangGraph)
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate

pip install -r requirements.txt

# Run FastAPI Server
uvicorn main:app --reload --port 8000
```
*Backend API will run at `http://localhost:8000` (Swagger docs at `http://localhost:8000/docs`).*

### 2. Frontend Setup (React + Redux Toolkit)
```bash
cd frontend
npm install
npm run dev
```
*Frontend UI will run at `http://localhost:3000`.*

---

## 🎥 Demo Video Guide (5-10 Minutes Submission Outline)

1. **Introduction**: Overview of the QMS Customer Complaint System for API & FDF pharmaceutical manufacturing.
2. **Document Intake**: Drag-and-drop a complaint PDF or click a 1-click demo sample (e.g. *Paracetamol Discoloration*).
3. **LangGraph Agent Pipeline**: Demonstrate text parsing, node execution, field extraction, and auto-population into the Redux store.
4. **Interactive Chat Assistant**: Ask questions like *"What is the batch number and root cause?"* in the chat box.
5. **AI Copilot & Risk Suite**: Showcase Completeness Score, 5-Why Root Cause tree, CAPA recommendations, and Duplicate detection against SQLite.
6. **Complaints Registry**: Save the complaint into the database, view in the registry table, and export CSV report.

---

## 📄 License & Attribution
Built for AIVOA.AI Candidate Evaluation.
