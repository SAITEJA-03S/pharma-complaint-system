import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchComplaints } from '../store/complaintSlice';
import { Database, Download, RefreshCw, Eye, Printer, Search } from 'lucide-react';

export default function ComplaintsTable() {
  const dispatch = useDispatch();
  const { savedComplaints } = useSelector((state) => state.complaint);
  const [filterText, setFilterText] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  useEffect(() => {
    dispatch(fetchComplaints());
  }, [dispatch]);

  const filtered = savedComplaints.filter((c) => {
    const q = filterText.toLowerCase();
    return (
      (c.product_name || '').toLowerCase().includes(q) ||
      (c.batch_number || '').toLowerCase().includes(q) ||
      (c.customer_name || '').toLowerCase().includes(q) ||
      (c.complaint_type || '').toLowerCase().includes(q)
    );
  });

  const exportCSV = () => {
    if (savedComplaints.length === 0) return;
    const headers = ["ID", "Customer", "Product", "Batch", "Type", "Severity", "Risk Level", "Date", "Status"];
    const rows = savedComplaints.map(c => [
      c.id, `"${c.customer_name || ''}"`, `"${c.product_name || ''}"`, `"${c.batch_number || ''}"`,
      `"${c.complaint_type || ''}"`, c.initial_severity || 'Medium', c.risk_level || 'Medium', c.complaint_date || '', c.status || 'Pending Triage'
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `qms_complaints_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintModal = () => {
    window.print();
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={20} color="#2563eb" />
            Complaints Registry & Database
          </h2>
          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
            Historical Quality Audit Log & GMP Master Registry
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={() => dispatch(fetchComplaints())}>
            <RefreshCw size={14} /> Refresh DB
          </button>
          <button className="btn btn-outline" onClick={exportCSV}>
            <Download size={14} /> Export CSV Report
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '20px', position: 'relative', maxWidth: '440px' }}>
        <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
        <input 
          type="text"
          placeholder="Filter by Product, Batch, Customer, or Type..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          style={{ paddingLeft: '38px' }}
        />
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Product / API</th>
              <th>Batch Number</th>
              <th>Customer</th>
              <th>Defect Category</th>
              <th>Severity</th>
              <th>Risk Score</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                  No complaints match your search query.
                </td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.id}>
                  <td><strong>#{c.id}</strong></td>
                  <td style={{ fontWeight: '600' }}>{c.product_name}</td>
                  <td><code style={{ background: '#f1f5f9', padding: '3px 8px', borderRadius: '4px', fontWeight: '600' }}>{c.batch_number}</code></td>
                  <td>{c.customer_name}</td>
                  <td>{c.complaint_type}</td>
                  <td>
                    <span className={`badge-tag badge-${(c.initial_severity || c.risk_level || 'medium').toLowerCase()}`}>
                      {c.initial_severity || c.risk_level || 'Medium'}
                    </span>
                  </td>
                  <td>
                    <strong style={{ color: (c.risk_score || 50) > 70 ? '#dc2626' : '#2563eb' }}>
                      {c.risk_score || 50}/100
                    </strong>
                  </td>
                  <td>
                    <span className="pill pill-warning" style={{ fontSize: '11px', padding: '3px 10px' }}>
                      {c.status || 'Pending Triage'}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '11.5px' }} onClick={() => setSelectedComplaint(c)}>
                      <Eye size={13} /> View Audit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* DETAIL MODAL */}
      {selectedComplaint && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="card" style={{ width: '640px', maxWidth: '100%', maxHeight: '85vh', overflowY: 'auto', background: 'white', border: '1px solid #cbd5e1' }}>
            <div className="card-header">
              <div>
                <h3 className="card-title">Complaint Audit Record #{selectedComplaint.id}</h3>
                <p style={{ fontSize: '12px', color: '#64748b' }}>GMP Master Log details</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '12px' }} onClick={handlePrintModal}>
                  <Printer size={13} /> Print
                </button>
                <button className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '12px' }} onClick={() => setSelectedComplaint(null)}>Close</button>
              </div>
            </div>
            <div style={{ fontSize: '13.5px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div><strong>Product Name:</strong> {selectedComplaint.product_name} ({selectedComplaint.product_strength})</div>
              <div><strong>Batch Number:</strong> <code>{selectedComplaint.batch_number}</code></div>
              <div><strong>Customer Name:</strong> {selectedComplaint.customer_name} ({selectedComplaint.complaint_source})</div>
              <div><strong>Manufacturing / Expiry:</strong> {selectedComplaint.manufacturing_date} / {selectedComplaint.expiry_date}</div>
              <div><strong>Quantity Affected:</strong> {selectedComplaint.quantity_affected}</div>
              <div><strong>Complaint Type:</strong> {selectedComplaint.complaint_type}</div>
              <div><strong>Initial Severity & Priority:</strong> {selectedComplaint.initial_severity} / {selectedComplaint.priority}</div>
              <div><strong>Risk Score:</strong> <span style={{ color: selectedComplaint.risk_score > 70 ? '#dc2626' : '#2563eb', fontWeight: '800' }}>{selectedComplaint.risk_score}/100</span></div>
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '6px' }}>
                <strong>Defect Description:</strong>
                <p style={{ marginTop: '6px', color: '#334155' }}>{selectedComplaint.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
