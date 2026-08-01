import sqlite3
import json
import os
from datetime import datetime
from typing import List, Dict, Any, Optional

DB_PATH = os.path.join(os.path.dirname(__file__), "complaints.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS complaints (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            complaint_source TEXT,
            customer_name TEXT,
            product_name TEXT,
            product_strength TEXT,
            batch_number TEXT,
            manufacturing_date TEXT,
            expiry_date TEXT,
            quantity_affected TEXT,
            complaint_type TEXT,
            complaint_date TEXT,
            description TEXT,
            initial_severity TEXT,
            priority TEXT,
            status TEXT,
            risk_score INTEGER DEFAULT 0,
            risk_level TEXT DEFAULT 'Low',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()

    # Seed initial mock database entries if empty so duplicate detection & history table have rich data out of the box!
    cursor.execute("SELECT COUNT(*) FROM complaints")
    count = cursor.fetchone()[0]
    if count == 0:
        seed_sample_complaints(cursor)
        conn.commit()

    conn.close()

def seed_sample_complaints(cursor):
    samples = [
        (
            "Quality Audit Email", "PharmaDistributors Ltd", "Paracetamol 500mg Tablets", "500mg", "BATCH-2026-X88",
            "2026-01-10", "2028-01-10", "5000 units", "Quality/Purity", "2026-07-15",
            "Discoloration observed on batch BATCH-2026-X88. Tablets show yellowish spots after moisture exposure.",
            "High", "High", "Under Investigation", 75, "High"
        ),
        (
            "Customer Support Hotline", "Apex Health Care", "Amoxicillin API Powder", "USP Grade (99.8%)", "AMX-8910-FL",
            "2025-11-20", "2027-11-20", "120 kg", "Contamination", "2026-06-28",
            "Foreign black particulate matter detected in active raw ingredient drum during HPLC testing.",
            "Critical", "Critical", "CAPA Initiated", 92, "Critical"
        ),
        (
            "Hospital Procurement", "City General Hospital", "Ibuprofen Liquid Suspension", "100mg/5ml", "IBU-2026-09",
            "2026-03-15", "2028-03-15", "450 bottles", "Packaging", "2026-07-20",
            "Defective seals on bottle caps leading to leakage during transit.",
            "Medium", "Medium", "Pending Triage", 45, "Medium"
        )
    ]
    cursor.executemany("""
        INSERT INTO complaints (
            complaint_source, customer_name, product_name, product_strength, batch_number,
            manufacturing_date, expiry_date, quantity_affected, complaint_type, complaint_date,
            description, initial_severity, priority, status, risk_score, risk_level
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, samples)

def save_complaint(data: Dict[str, Any]) -> int:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO complaints (
            complaint_source, customer_name, product_name, product_strength, batch_number,
            manufacturing_date, expiry_date, quantity_affected, complaint_type, complaint_date,
            description, initial_severity, priority, status, risk_score, risk_level
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        data.get("complaint_source", ""),
        data.get("customer_name", ""),
        data.get("product_name", ""),
        data.get("product_strength", ""),
        data.get("batch_number", ""),
        data.get("manufacturing_date", ""),
        data.get("expiry_date", ""),
        data.get("quantity_affected", ""),
        data.get("complaint_type", ""),
        data.get("complaint_date", datetime.now().strftime("%Y-%m-%d")),
        data.get("description", ""),
        data.get("initial_severity", "Medium"),
        data.get("priority", "Medium"),
        data.get("status", "Pending Triage"),
        data.get("risk_score", 50),
        data.get("risk_level", "Medium")
    ))
    conn.commit()
    complaint_id = cursor.lastrowid
    conn.close()
    return complaint_id

def get_all_complaints() -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM complaints ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

def check_duplicates(batch_number: Optional[str], product_name: Optional[str], description: Optional[str]) -> Dict[str, Any]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM complaints")
    rows = [dict(row) for row in cursor.fetchall()]
    conn.close()

    if not rows:
        return {"is_duplicate": False, "confidence_score": 0.0, "matching_reason": "No historical complaints in database."}

    for comp in rows:
        # Match by exact batch number
        if batch_number and comp.get("batch_number") and batch_number.strip().lower() == comp["batch_number"].strip().lower():
            return {
                "is_duplicate": True,
                "confidence_score": 0.95,
                "matched_complaint_id": comp["id"],
                "matched_batch": comp["batch_number"],
                "matching_reason": f"Exact match found for Batch Number '{batch_number}' (Complaint #{comp['id']})."
            }

        # Match by product name + partial description similarity
        if product_name and comp.get("product_name") and product_name.strip().lower() in comp["product_name"].strip().lower():
            desc1 = (description or "").lower()
            desc2 = (comp.get("description") or "").lower()
            # Simple keyword matching
            common_words = set(desc1.split()) & set(desc2.split())
            if len(common_words) >= 3:
                return {
                    "is_duplicate": True,
                    "confidence_score": 0.82,
                    "matched_complaint_id": comp["id"],
                    "matched_batch": comp["batch_number"],
                    "matching_reason": f"High text similarity found for product '{product_name}' (Complaint #{comp['id']})."
                }

    return {
        "is_duplicate": False,
        "confidence_score": 0.12,
        "matched_complaint_id": None,
        "matched_batch": None,
        "matching_reason": "No duplicate complaints detected for this batch or product issue."
    }
