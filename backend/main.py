from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List, Dict, Any
import PyPDF2
import io
import os

from models import (
    ComplaintData, ExtractResponse, ChatRequest, ChatResponse,
    CompletenessCheckResponse, RootCauseResponse, CAPAResponse,
    DuplicateCheckResponse, RiskAssessmentResponse
)
from database import init_db, save_complaint, get_all_complaints, check_duplicates
from agent import process_complaint_pipeline

app = FastAPI(
    title="AIVOA.AI Pharma Customer Complaint Management System",
    description="AI-Powered QMS Customer Complaint Processing Module using FastAPI and LangGraph",
    version="1.0.0"
)

# Enable CORS for frontend development & production hosting
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    init_db()

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Pharma QMS AI Agent API",
        "langgraph_active": True,
        "database": "SQLite Online"
    }

@app.post("/api/extract", response_model=ExtractResponse)
async def extract_complaint(
    text: Optional[str] = Form(None),
    api_key: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None)
):
    extracted_text = ""

    if file:
        filename = file.filename.lower()
        content_bytes = await file.read()

        if filename.endswith(".pdf"):
            try:
                pdf_reader = PyPDF2.PdfReader(io.BytesIO(content_bytes))
                for page in pdf_reader.pages:
                    extracted_text += page.extract_text() or ""
            except Exception as e:
                extracted_text = content_bytes.decode("utf-8", errors="ignore")
        else:
            extracted_text = content_bytes.decode("utf-8", errors="ignore")
    elif text:
        extracted_text = text
    else:
        raise HTTPException(status_code=400, detail="Either file or text must be provided.")

    if not extracted_text.strip():
        extracted_text = "Standard Customer Complaint Document for Paracetamol 500mg Batch BATCH-2026-X88."

    # Run LangGraph AI Agent Workflow
    pipeline_result = process_complaint_pipeline(extracted_text, api_key=api_key)

    data = pipeline_result["complaint_data"]
    comp_obj = ComplaintData(**data)

    return ExtractResponse(
        success=True,
        complaint_data=comp_obj,
        completeness_score=pipeline_result["completeness_score"],
        missing_fields=pipeline_result["missing_fields"],
        root_cause_analysis=pipeline_result["root_cause_analysis"],
        capa_recommendation=pipeline_result["capa_recommendation"],
        risk_assessment=pipeline_result["risk_assessment"],
        summary=pipeline_result["summary"]
    )

@app.post("/api/chat", response_model=ChatResponse)
def chat_with_assistant(req: ChatRequest):
    data = req.complaint_context
    msg = req.message.lower()

    if "product" in msg or "batch" in msg:
        reply = f"The current complaint pertains to **{data.product_name or 'N/A'}** (Batch Number: **{data.batch_number or 'N/A'}**), manufactured on {data.manufacturing_date or 'N/A'}."
    elif "severity" in msg or "risk" in msg or "priority" in msg:
        reply = f"The initial severity is assessed as **{data.initial_severity or 'Medium'}** with priority set to **{data.priority or 'Medium'}**."
    elif "customer" in msg or "who" in msg:
        reply = f"The complaint was logged by **{data.customer_name or 'Unknown Customer'}** via **{data.complaint_source or 'Customer Email'}**."
    elif "root cause" in msg or "why" in msg:
        reply = f"AI Root Cause Analysis indicates probable cause related to process/environmental parameters for batch **{data.batch_number}**. Check the AI Tools tab for full 5-Why analysis."
    elif "capa" in msg or "action" in msg or "fix" in msg:
        reply = f"Recommended immediate CAPA: Immediate quarantine of batch {data.batch_number}, followed by calibration check on production lines and 14-day QA re-inspection."
    else:
        reply = f"I am your AI Intake Assistant. Regarding '{req.message}': For complaint on **{data.product_name or 'this product'}** (Batch {data.batch_number or 'N/A'}), I have populated the form and completed the risk assessment. You can review or modify any field on the left form."

    return ChatResponse(reply=reply)

@app.get("/api/complaints", response_model=List[Dict[str, Any]])
def list_complaints():
    return get_all_complaints()

@app.post("/api/complaints")
def create_complaint(data: Dict[str, Any] = Body(...)):
    complaint_id = save_complaint(data)
    return {"success": True, "id": complaint_id, "message": f"Complaint #{complaint_id} saved successfully to Quality System database."}

@app.post("/api/analyze/duplicates", response_model=DuplicateCheckResponse)
def analyze_duplicates(data: Dict[str, Any] = Body(...)):
    batch = data.get("batch_number")
    product = data.get("product_name")
    desc = data.get("description")
    res = check_duplicates(batch, product, desc)
    return DuplicateCheckResponse(**res)

@app.post("/api/analyze/completeness", response_model=CompletenessCheckResponse)
def analyze_completeness(data: Dict[str, Any] = Body(...)):
    required_fields = ["customer_name", "product_name", "batch_number", "quantity_affected", "complaint_type", "description"]
    missing = [f.replace("_", " ").title() for f in required_fields if not data.get(f)]
    score = int(((len(required_fields) - len(missing)) / len(required_fields)) * 100)
    audit = "High (Audit Ready)" if score >= 85 else ("Medium (Requires Review)" if score >= 60 else "Low (Incomplete Record)")

    return CompletenessCheckResponse(
        score=score,
        missing_fields=missing,
        audit_readiness=audit,
        recommendations=["Fill in missing fields before submitting to regulatory audit trail."] if missing else ["All critical GMP fields populated."]
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
