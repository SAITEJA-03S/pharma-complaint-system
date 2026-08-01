import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveTab, setApiKey } from '../store/complaintSlice';
import { FileText, Cpu, Database, Key, ShieldCheck, Activity } from 'lucide-react';

export default function Header() {
  const dispatch = useDispatch();
  const { activeTab, apiKey, form, aiAnalysis } = useSelector((state) => state.complaint);
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
          <div className="logo-badge">AIVOA.AI</div>
          <div className="title-group">
            <h1>Log Customer Complaint</h1>
            <p>API & FDF Quality Assurance Module — Pharmaceutical Manufacturing</p>
          </div>
        </div>

        <div className="status-pills">
          <button 
            className="btn btn-outline" 
            style={{ padding: '4px 10px', fontSize: '12px' }}
            onClick={() => setShowKeyInput(!showKeyInput)}
          >
            <Key size={14} />
            {apiKey ? 'Groq Key Active' : 'Set Groq API Key'}
          </button>

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
        <div style={{ background: '#fffbe6', padding: '10px 28px', borderBottom: '1px solid #ffe58f', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', fontWeight: '600' }}>Groq API Key (Optional - gemma2-9b-it):</span>
          <input 
            type="password" 
            placeholder="gsk_..." 
            value={keyVal} 
            onChange={(e) => setKeyVal(e.target.value)} 
            style={{ width: '300px' }}
          />
          <button className="btn btn-primary" onClick={handleSaveKey} style={{ padding: '6px 12px', fontSize: '12px' }}>Save Key</button>
          <span style={{ fontSize: '12px', color: '#666' }}>(If empty, standard fallback AI parser activates)</span>
        </div>
      )}

      <div className="tab-bar">
        <button 
          className={`tab-btn ${activeTab === 'log' ? 'active' : ''}`}
          onClick={() => dispatch(setActiveTab('log'))}
        >
          <FileText size={16} />
          Log Complaint & Intake
        </button>

        <button 
          className={`tab-btn ${activeTab === 'tools' ? 'active' : ''}`}
          onClick={() => dispatch(setActiveTab('tools'))}
        >
          <Cpu size={16} />
          AI Risk & CAPA Tools
          {aiAnalysis.completeness_score > 0 && (
            <span style={{ background: '#2563eb', color: 'white', borderRadius: '10px', padding: '1px 6px', fontSize: '10px' }}>
              {aiAnalysis.completeness_score}%
            </span>
          )}
        </button>

        <button 
          className={`tab-btn ${activeTab === 'registry' ? 'active' : ''}`}
          onClick={() => dispatch(setActiveTab('registry'))}
        >
          <Database size={16} />
          Complaints Registry & Database
        </button>
      </div>
    </header>
  );
}
