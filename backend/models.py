from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class ComplaintData(BaseModel):
    id: Optional[int] = None
    complaint_source: Optional[str] = Field(default="", description="Source e.g. Customer Email, Field Report, Call")
    customer_name: Optional[str] = Field(default="", description="Name of customer/hospital/distributor")
    product_name: Optional[str] = Field(default="", description="Name of Active Pharmaceutical Ingredient (API) or Finished Dosage Form (FDF)")
    product_strength: Optional[str] = Field(default="", description="Strength or grade e.g. 500mg, USP Grade")
    batch_number: Optional[str] = Field(default="", description="Batch or Lot number")
    manufacturing_date: Optional[str] = Field(default="", description="YYYY-MM-DD")
    expiry_date: Optional[str] = Field(default="", description="YYYY-MM-DD")
    quantity_affected: Optional[str] = Field(default="", description="Quantity e.g. 500 kg, 1200 boxes")
    complaint_type: Optional[str] = Field(default="", description="Packaging, Quality/Purity, Contamination, Labeling, Efficacy")
    complaint_date: Optional[str] = Field(default="", description="Date complaint received YYYY-MM-DD")
    description: Optional[str] = Field(default="", description="Detailed description of defect/issue")
    initial_severity: Optional[str] = Field(default="Medium", description="Low, Medium, High, Critical")
    priority: Optional[str] = Field(default="Medium", description="Low, Medium, High, Critical")
    status: Optional[str] = Field(default="Pending Triage", description="Status of complaint")
    created_at: Optional[str] = None

class ExtractRequest(BaseModel):
    text: Optional[str] = None
    api_key: Optional[str] = None

class ExtractResponse(BaseModel):
    success: bool
    complaint_data: ComplaintData
    completeness_score: int
    missing_fields: List[str]
    root_cause_analysis: Dict[str, Any]
    capa_recommendation: Dict[str, Any]
    risk_assessment: Dict[str, Any]
    summary: str

class ChatRequest(BaseModel):
    message: str
    complaint_context: ComplaintData
    chat_history: Optional[List[Dict[str, str]]] = []
    api_key: Optional[str] = None

class ChatResponse(BaseModel):
    reply: str

class CompletenessCheckResponse(BaseModel):
    score: int
    missing_fields: List[str]
    audit_readiness: str
    recommendations: List[str]

class RootCauseResponse(BaseModel):
    five_whys: List[str]
    category: str
    probable_root_cause: str
    investigation_steps: List[str]

class CAPAResponse(BaseModel):
    corrective_actions: List[str]
    preventive_actions: List[str]
    target_timeline: str
    responsible_dept: str

class DuplicateCheckResponse(BaseModel):
    is_duplicate: bool
    confidence_score: float
    matched_complaint_id: Optional[int] = None
    matched_batch: Optional[str] = None
    matching_reason: str

class RiskAssessmentResponse(BaseModel):
    risk_score: int
    risk_level: str
    criticality: str
    regulatory_escalation_required: bool
    rationale: str
