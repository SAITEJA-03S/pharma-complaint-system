import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveTab, setApiKey } from '../store/complaintSlice';
import { FileText, Cpu, Database, Key, ShieldCheck, Activity, BarChart3, Pill } from 'lucide-react';

export default function Header() {
  const dispatch = useDispatch();
  const { activeTab, apiKey, form, aiAnalysis, isBackendConnected } = useSelector((state) => state.complaint);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [keyVal, setKeyVal] = useState(apiKey);

  const handleSaveKey = () => {
    dispatch(setApiKey(keyVal));
    setShowKeyInput(false);
  };

  const statusLabel = form.status || 'Pending Triage';

  return (
    <header>
      <div className="top-header">
        <div className="brand-section">
          <div className="logo-badge">
            <Pill size={18} />
            PharmaQMS AI
          </div>
          <div className="title-group">
            <h1>Customer Complaint Management System</h1>
            <p>API & FDF Quality Assurance Module — Active Pharmaceutical Ingredients & Finished Dosage Forms</p>
          </div>
        </div>

        <div className="status-pills">
          <button 
            className="btn btn-outline" 
            style={{ padding: '6px 12px', fontSize: '12px', borderColor: '#3b82f6', color: '#93c5fd' }}
            onClick={() => setShowKeyInput(!showKeyInput)}
          >
            <Key size={14} />
            {apiKey ? 'Groq Key Active' : 'Set Groq Key'}
          </button>

          <span className={`pill ${isBackendConnected ? 'pill-success' : 'pill-offline'}`}>
            <Activity size={13} />
            {isBackendConnected ? 'FastAPI Online' : 'Edge Client AI Active'}
          </span>

          <span className="pill pill-warning">
            <Activity size={13} />
            {statusLabel}
          </span>

          {aiAnalysis.risk_assessment && (
            <span className={`pill ${aiAnalysis.risk_assessment.risk_level === 'Critical' ? 'pill-warning' : 'pill-info'}`}>
              <ShieldCheck size={13} />
              Risk: {aiAnalysis.risk_assessment.risk_level} ({aiAnalysis.risk_assessment.risk_score}/100)
            </span>
          )}
        </div>
      </div>

      {showKeyInput && (
        <div style={{ background: '#1e293b', color: 'white', padding: '12px 32px', borderBottom: '1px solid #334155', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', fontWeight: '600' }}>Groq API Key (Optional - `gemma2-9b-it`):</span>
          <input 
            type="password" 
            placeholder="gsk_..." 
            value={keyVal} 
            onChange={(e) => setKeyVal(e.target.value)} 
            style={{ width: '320px', background: '#0f172a', border: '1px solid #475569', color: 'white' }}
          />
          <button className="btn btn-primary" onClick={handleSaveKey} style={{ padding: '6px 14px', fontSize: '12px' }}>Save Key</button>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>(If omitted, smart fallback AI heuristics engine will process complaints)</span>
        </div>
      )}

      <div className="tab-bar">
        <button 
          className={`tab-btn ${activeTab === 'log' ? 'active' : ''}`}
          onClick={() => dispatch(setActiveTab('log'))}
        >
          <FileText size={17} />
          Log Complaint & Intake
        </button>

        <button 
          className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => dispatch(setActiveTab('analytics'))}
        >
          <BarChart3 size={17} />
          Quality Analytics
        </button>

        <button 
          className={`tab-btn ${activeTab === 'tools' ? 'active' : ''}`}
          onClick={() => dispatch(setActiveTab('tools'))}
        >
          <Cpu size={17} />
          AI Copilot & CAPA
          {aiAnalysis.completeness_score > 0 && (
            <span style={{ background: '#2563eb', color: 'white', borderRadius: '10px', padding: '2px 8px', fontSize: '11px', fontWeight: '700' }}>
              {aiAnalysis.completeness_score}%
            </span>
          )}
        </button>

        <button 
          className={`tab-btn ${activeTab === 'registry' ? 'active' : ''}`}
          onClick={() => dispatch(setActiveTab('registry'))}
        >
          <Database size={17} />
          Complaints Registry
        </button>
      </div>
    </header>
  );
}
