import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { checkDuplicateComplaint } from '../store/complaintSlice';
import { 
  CheckSquare, GitCommit, AlertTriangle, ShieldCheck, FileCheck, RefreshCw, Layers, ShieldAlert, Cpu 
} from 'lucide-react';

export default function AIToolsPanel() {
  const dispatch = useDispatch();
  const { aiAnalysis, form } = useSelector((state) => state.complaint);

  const {
    completeness_score, missing_fields, root_cause_analysis,
    capa_recommendation, risk_assessment, duplicate_check, summary
  } = aiAnalysis;

  const handleRecheckDuplicates = () => {
    dispatch(checkDuplicateComplaint(form));
  };

  return (
    <div style={{ paddingBottom: '30px' }}>
      <div className="card-header" style={{ marginBottom: '24px' }}>
        <div>
          <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu size={20} color="#2563eb" />
            AI Copilot & Risk Assessment Suite
          </h2>
          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
            Automated GMP Quality Tools, Root Cause Analysis & CAPA Recommendation Engine
          </p>
        </div>
        <span className="pill pill-success">
          <Layers size={13} />
          6 AI Tools Active
        </span>
      </div>

      <div className="tools-grid">

        {/* TOOL 1: COMPLAINT COMPLETENESS CHECKER */}
        <div className="tool-card">
          <div className="tool-header">
            <CheckSquare size={20} color="#2563eb" />
            <span>Complaint Completeness Checker</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', marginBottom: '14px' }}>
            <div className="score-display">{completeness_score}%</div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: completeness_score >= 85 ? '#16a34a' : '#d97706' }}>
                {completeness_score >= 85 ? '✅ Audit Ready Record' : '⚠️ Requires Review'}
              </div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Regulatory Completeness Score</div>
            </div>
          </div>

          {missing_fields && missing_fields.length > 0 ? (
            <div style={{ background: '#fffbe6', padding: '12px', borderRadius: '8px', fontSize: '12px', color: '#92400e', border: '1px solid #fde68a' }}>
              <strong>Missing Required GMP Fields:</strong>
              <ul style={{ paddingLeft: '18px', marginTop: '6px' }}>
                {missing_fields.map((f, i) => <li key={i} style={{ marginBottom: '2px' }}>{f}</li>)}
              </ul>
            </div>
          ) : (
            <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '8px', fontSize: '12px', color: '#166534', border: '1px solid #bbf7d0' }}>
              ✔️ All critical GMP compliance fields populated. Record is ready for quality audit trail.
            </div>
          )}
        </div>

        {/* TOOL 2: AI RISK CLASSIFICATION & MATRIX */}
        <div className="tool-card">
          <div className="tool-header">
            <ShieldCheck size={20} color="#dc2626" />
            <span>AI Risk Classification & Escalation</span>
          </div>

          {risk_assessment ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div>
                  <span className={`badge-tag badge-${(risk_assessment.risk_level || 'medium').toLowerCase()}`}>
                    {risk_assessment.risk_level} Risk
                  </span>
                  <span style={{ fontSize: '12px', marginLeft: '10px', fontWeight: '700', color: '#475569' }}>
                    {risk_assessment.criticality}
                  </span>
                </div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: risk_assessment.risk_score > 70 ? '#dc2626' : '#2563eb' }}>
                  {risk_assessment.risk_score}/100
                </div>
              </div>

              <p style={{ fontSize: '12px', color: '#334155', background: '#f8fafc', padding: '12px', borderRadius: '8px', marginBottom: '12px', border: '1px solid #e2e8f0' }}>
                <strong>Rationale:</strong> {risk_assessment.rationale}
              </p>

              <div style={{ 
                fontSize: '12px', 
                fontWeight: '700', 
                padding: '8px 12px', 
                borderRadius: '6px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px',
                background: risk_assessment.regulatory_escalation_required ? '#fef2f2' : '#f0fdf4',
                color: risk_assessment.regulatory_escalation_required ? '#dc2626' : '#16a34a',
                border: `1px solid ${risk_assessment.regulatory_escalation_required ? '#fca5a5' : '#86efac'}`
              }}>
                <ShieldAlert size={14} />
                {risk_assessment.regulatory_escalation_required 
                  ? '⚠️ Mandatory Health Authority (FDA/EMA) Escalation Triggered' 
                  : '✔️ Internal Quality Management Handling'}
              </div>
            </div>
          ) : (
            <p style={{ fontSize: '12px', color: '#94a3b8' }}>Extract a document or select a demo scenario to generate AI risk assessment.</p>
          )}
        </div>

        {/* TOOL 3: DUPLICATE COMPLAINT DETECTION */}
        <div className="tool-card">
          <div className="tool-header" style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={20} color="#d97706" />
              <span>Duplicate Complaint Detection</span>
            </div>
            <button className="btn btn-secondary" style={{ padding: '3px 8px', fontSize: '11px' }} onClick={handleRecheckDuplicates}>
              <RefreshCw size={11} /> Check DB
            </button>
          </div>

          {duplicate_check ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <span className={`pill ${duplicate_check.is_duplicate ? 'pill-warning' : 'pill-success'}`}>
                  {duplicate_check.is_duplicate ? 'Duplicate Match Found' : 'No Duplicates Detected'}
                </span>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b' }}>
                  {(duplicate_check.confidence_score * 100).toFixed(0)}% Match Confidence
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#334155', background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                {duplicate_check.matching_reason}
              </p>
            </div>
          ) : (
            <p style={{ fontSize: '12px', color: '#94a3b8' }}>Run extraction or click 'Check DB' to search historical SQLite database.</p>
          )}
        </div>

        {/* TOOL 4: ROOT CAUSE RECOMMENDATION (5-WHYS) */}
        <div className="tool-card" style={{ gridColumn: '1 / -1' }}>
          <div className="tool-header">
            <GitCommit size={20} color="#2563eb" />
            <span>Root Cause Analysis & 5-Why Investigation Tree</span>
          </div>

          {root_cause_analysis ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#1e40af', marginBottom: '8px' }}>
                  Category: {root_cause_analysis.category}
                </div>
                <p style={{ fontSize: '13px', background: '#eff6ff', padding: '12px', borderRadius: '8px', color: '#1e293b', marginBottom: '14px', borderLeft: '4px solid #2563eb' }}>
                  <strong>Probable Root Cause:</strong> {root_cause_analysis.probable_root_cause}
                </p>

                <div style={{ fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                  Recommended Investigation Steps:
                </div>
                <ul style={{ fontSize: '12px', color: '#334155', paddingLeft: '18px' }}>
                  {root_cause_analysis.investigation_steps?.map((step, i) => (
                    <li key={i} style={{ marginBottom: '4px' }}>{step}</li>
                  ))}
                </ul>
              </div>

              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '12px', fontWeight: '800', color: '#0f172a', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  AI 5-Why Root Cause Cascade:
                </div>
                {root_cause_analysis.five_whys?.map((why, i) => (
                  <div key={i} style={{ fontSize: '12px', color: '#334155', marginBottom: '8px', background: 'white', padding: '8px 10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    {why}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p style={{ fontSize: '12px', color: '#94a3b8' }}>Load or extract a complaint to view the automated 5-Why Root Cause tree.</p>
          )}
        </div>

        {/* TOOL 5: CAPA RECOMMENDATION ENGINE */}
        <div className="tool-card" style={{ gridColumn: '1 / -1' }}>
          <div className="tool-header">
            <FileCheck size={20} color="#16a34a" />
            <span>CAPA Recommendation Engine (Corrective & Preventive Action)</span>
          </div>

          {capa_recommendation ? (
            <div>
              <div style={{ display: 'flex', gap: '24px', marginBottom: '14px', fontSize: '13px', fontWeight: '600' }}>
                <span>Target CAPA Timeline: <strong style={{ color: '#2563eb' }}>{capa_recommendation.target_timeline}</strong></span>
                <span>Responsible Department: <strong style={{ color: '#2563eb' }}>{capa_recommendation.responsible_dept}</strong></span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#166534', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    Immediate Corrective Actions:
                  </div>
                  <ul style={{ fontSize: '12px', color: '#14532d', paddingLeft: '18px' }}>
                    {capa_recommendation.corrective_actions?.map((act, i) => <li key={i} style={{ marginBottom: '6px' }}>{act}</li>)}
                  </ul>
                </div>

                <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#1e40af', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    Long-term Preventive Actions:
                  </div>
                  <ul style={{ fontSize: '12px', color: '#1e3a8a', paddingLeft: '18px' }}>
                    {capa_recommendation.preventive_actions?.map((act, i) => <li key={i} style={{ marginBottom: '6px' }}>{act}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <p style={{ fontSize: '12px', color: '#94a3b8' }}>CAPA recommendations will be populated upon document intake.</p>
          )}
        </div>

        {/* TOOL 6: COMPLAINT EXECUTIVE SUMMARY */}
        <div className="tool-card" style={{ gridColumn: '1 / -1' }}>
          <div className="tool-header">
            <FileCheck size={20} color="#9333ea" />
            <span>Executive Complaint Briefing & Audit Summary</span>
          </div>

          <p style={{ fontSize: '13px', color: '#334155', background: '#fdf4ff', padding: '16px', borderRadius: '10px', borderLeft: '4px solid #9333ea', lineHeight: '1.6' }}>
            {summary || "Upload a document to automatically generate an executive summary for Quality Assurance leadership."}
          </p>
        </div>

      </div>
    </div>
  );
}
