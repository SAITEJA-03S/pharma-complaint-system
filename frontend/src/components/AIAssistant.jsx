import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  extractComplaintData, sendChatMessage, addUserChatMessage,
  setExtractionProgress 
} from '../store/complaintSlice';
import { 
  Upload, FileText, Send, Sparkles, AlertCircle, Bot, Zap, Clipboard
} from 'lucide-react';

export default function AIAssistant() {
  const dispatch = useDispatch();
  const { extraction, chat, apiKey, form } = useSelector((state) => state.complaint);
  const [pasteMode, setPasteMode] = useState(false);
  const [rawText, setRawText] = useState('');
  const [userMsg, setUserMsg] = useState('');

  const handleFileUpload = (file) => {
    if (!file) return;
    dispatch(extractComplaintData({ file, apiKey }));
  };

  const handlePasteSubmit = () => {
    if (!rawText.trim()) return;
    dispatch(extractComplaintData({ text: rawText, apiKey }));
    setPasteMode(false);
    setRawText('');
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!userMsg.trim()) return;

    const msg = userMsg;
    setUserMsg('');
    dispatch(addUserChatMessage(msg));
    dispatch(sendChatMessage({ message: msg, complaintContext: form, apiKey }));
  };

  const handleLoadSample = (sampleType) => {
    let text = '';
    if (sampleType === 'paracetamol') {
      text = `QUALITY INCIDENT REPORT
Date: 2026-07-28
Customer: Global Pharma Distributors Inc.
Product Name: Paracetamol 500mg Tablets
Batch Number: BATCH-2026-X88
Manufacturing Date: 2026-02-15
Expiry Date: 2028-02-15
Quantity Affected: 2,500 blister packs
Complaint Type: Quality/Purity
Severity: High
Description: Yellow-brownish spots and surface mottling observed on tablets in Batch BATCH-2026-X88 upon opening blister packs. Possible moisture degradation during secondary holding.`;
    } else if (sampleType === 'amoxicillin') {
      text = `URGENT DEFECT NOTIFICATION
From: Apex Healthcare Manufacturing
Product: Amoxicillin Trihydrate API Raw Powder
Batch Code: AMX-8910-FL
Quantity Affected: 120 kg
Mfg Date: 2025-11-20
Exp Date: 2027-11-20
Complaint Type: Contamination
Severity: Critical
Description: Foreign black particulate matter detected in drum during receiving inspection HPLC testing. Microscopic debris from synthesis reactor seal gasket wear.`;
    } else {
      text = `PACKAGING DEFECT REPORT
Customer: City General Hospital
Product: Ibuprofen Oral Suspension 100mg/5ml
Batch: IBU-2026-09
Mfg Date: 2026-03-15
Exp Date: 2028-03-15
Quantity: 450 bottles
Complaint Type: Packaging
Severity: Medium
Description: Defective seals on bottle caps leading to leakage during transit. Heat sealer temperature drift suspected.`;
    }

    dispatch(extractComplaintData({ text, apiKey }));
  };

  return (
    <div className="card" style={{ background: '#f8fafc' }}>
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} color="#2563eb" />
          <h2 className="card-title" style={{ fontSize: '16px' }}>AI Complaint Intake Assistant</h2>
        </div>
        <span className="pill pill-info">BETA</span>
      </div>

      {/* QUICK DEMO SAMPLER BAR */}
      <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px' }}>
        <div style={{ fontSize: '11px', fontWeight: '700', color: '#1e40af', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '6px' }}>
          <Zap size={13} />
          QUICK DEMO SAMPLES (Click to Auto-Extract & Fill Form):
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" style={{ fontSize: '11px', padding: '4px 8px' }} onClick={() => handleLoadSample('paracetamol')}>
            💊 Paracetamol Discoloration
          </button>
          <button className="btn btn-secondary" style={{ fontSize: '11px', padding: '4px 8px' }} onClick={() => handleLoadSample('amoxicillin')}>
            🧪 Amoxicillin API Contamination
          </button>
          <button className="btn btn-secondary" style={{ fontSize: '11px', padding: '4px 8px' }} onClick={() => handleLoadSample('ibuprofen')}>
            📦 Ibuprofen Packaging Leak
          </button>
        </div>
      </div>

      {/* DROPZONE / FILE UPLOAD */}
      {!pasteMode ? (
        <div 
          className="dropzone"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleFileUpload(e.dataTransfer.files[0]);
            }
          }}
        >
          <Upload size={32} color="#2563eb" style={{ marginBottom: '8px' }} />
          <p style={{ fontWeight: '600', fontSize: '14px', color: '#1e293b' }}>
            Drag & drop complaint document here
          </p>
          <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 12px 0' }}>
            or <label style={{ color: '#2563eb', cursor: 'pointer', textDecoration: 'underline' }}>
              click to browse
              <input 
                type="file" 
                accept=".pdf,.txt,.docx,.eml" 
                style={{ display: 'none' }}
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
              />
            </label>
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center', margin: '12px 0' }}>
            <span style={{ height: '1px', background: '#cbd5e1', flex: 1 }}></span>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8' }}>OR</span>
            <span style={{ height: '1px', background: '#cbd5e1', flex: 1 }}></span>
          </div>

          <button className="btn btn-secondary" onClick={() => setPasteMode(true)} style={{ margin: '0 auto' }}>
            <Clipboard size={14} />
            Paste Complaint Text / Email
          </button>

          <div style={{ marginTop: '14px', fontSize: '11px', color: '#64748b', background: '#f1f5f9', padding: '6px', borderRadius: '4px' }}>
            <AlertCircle size={12} style={{ display: 'inline', marginRight: '4px' }} />
            Supported formats: PDF, DOCX, TXT, EML (Max 10MB)
          </div>
        </div>
      ) : (
        <div style={{ marginBottom: '16px', background: 'white', padding: '16px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <label style={{ fontWeight: '700', fontSize: '13px' }}>Paste Customer Complaint Text / Email:</label>
            <button style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '12px' }} onClick={() => setPasteMode(false)}>
              Cancel
            </button>
          </div>
          <textarea 
            rows={5}
            placeholder="Paste raw email or complaint incident report text here..."
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button className="btn btn-primary" onClick={handlePasteSubmit}>
              <Sparkles size={14} />
              Extract & Populate Form
            </button>
          </div>
        </div>
      )}

      {/* EXTRACTION PROGRESS BAR */}
      {extraction.progress > 0 && (
        <div className="progress-bar-container">
          <div className="progress-header">
            <span>EXTRACTION PROGRESS</span>
            <span>{extraction.progress}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${extraction.progress}%` }}></div>
          </div>
          <p style={{ fontSize: '12px', color: '#475569', marginTop: '4px', fontWeight: '500' }}>
            {extraction.statusText}
          </p>
        </div>
      )}

      {/* CHAT ASSISTANT */}
      <div style={{ marginTop: '12px' }}>
        <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', marginBottom: '6px' }}>
          AI ASSISTANT CHAT
        </div>
        <div className="chat-box">
          <div className="chat-messages">
            {chat.messages.map((m, idx) => (
              <div key={idx} className={`msg-bubble ${m.sender === 'user' ? 'msg-user' : 'msg-assistant'}`}>
                {m.sender === 'assistant' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: '#2563eb', fontWeight: '700', marginBottom: '2px' }}>
                    <Bot size={12} /> AI ASSISTANT
                  </div>
                )}
                {m.text}
              </div>
            ))}
            {chat.isTyping && (
              <div className="msg-bubble msg-assistant" style={{ fontStyle: 'italic', color: '#64748b' }}>
                AI Assistant is processing...
              </div>
            )}
          </div>

          <form onSubmit={handleSendChat} className="chat-input-row">
            <input 
              type="text" 
              placeholder="Ask me anything about this complaint..."
              value={userMsg}
              onChange={(e) => setUserMsg(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '8px 12px' }}>
              <Send size={14} />
            </button>
          </form>
        </div>
        <div style={{ textAlign: 'center', fontSize: '11px', color: '#94a3b8', marginTop: '6px' }}>
          AI responses may contain errors. Please verify information in QA system.
        </div>
      </div>
    </div>
  );
}
