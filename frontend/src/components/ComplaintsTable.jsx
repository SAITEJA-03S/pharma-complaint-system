import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchComplaints } from '../store/complaintSlice';
import { Database, Download, RefreshCw, Eye } from 'lucide-react';

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
      c.id, `"${c.customer_name}"`, `"${c.product_name}"`, `"${c.batch_number}"`,
      `"${c.complaint_type}"`, c.initial_severity, c.risk_level, c.complaint_date, c.status
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `qms_complaints_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title">Complaints Registry & Database</h2>
          <p style={{ fontSize: '12px', color: '#64748b' }}>
            Historical Quality Audit Log stored in SQLite DB
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary" onClick={() => dispatch(fetchComplaints())}>
            <RefreshCw size={14} /> Refresh
          </button>
          <button className="btn btn-outline" onClick={exportCSV}>
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <input 
          type="text"
          placeholder="Filter by Product, Batch, Customer, or Defect Type..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          style={{ width: '100%', maxWidth: '400px' }}
        />
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Product / API</th>
              <th>Batch #</th>
              <th>Customer</th>
              <th>Complaint Type</th>
              <th>Severity</th>
              <th>Risk Score</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                  No complaints found in database.
                </td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.id}>
                  <td><strong>#{c.id}</strong></td>
                  <td>{c.product_name}</td>
                  <td><code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>{c.batch_number}</code></td>
                  <td>{c.customer_name}</td>
                  <td>{c.complaint_type}</td>
                  <td>
                    <span className={`badge-tag badge-${(c.initial_severity || 'medium').toLowerCase()}`}>
                      {c.initial_severity}
                    </span>
                  </td>
                  <td>
                    <strong style={{ color: c.risk_score > 70 ? '#dc2626' : '#2563eb' }}>
                      {c.risk_score || 50}/100
                    </strong>
                  </td>
                  <td>
                    <span className="pill pill-warning" style={{ fontSize: '11px', padding: '2px 8px' }}>
                      {c.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={() => setSelectedComplaint(c)}>
                      <Eye size={12} /> Details
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
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '600px', maxHeight: '80vh', overflowY: 'auto' }}>
            <div className="card-header">
              <h3 className="card-title">Complaint #{selectedComplaint.id} - Details</h3>
              <button className="btn btn-secondary" onClick={() => setSelectedComplaint(null)}>Close</button>
            </div>
            <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div><strong>Product Name:</strong> {selectedComplaint.product_name} ({selectedComplaint.product_strength})</div>
              <div><strong>Batch Number:</strong> {selectedComplaint.batch_number}</div>
              <div><strong>Customer:</strong> {selectedComplaint.customer_name} ({selectedComplaint.complaint_source})</div>
              <div><strong>Manufacturing / Expiry:</strong> {selectedComplaint.manufacturing_date} / {selectedComplaint.expiry_date}</div>
              <div><strong>Quantity Affected:</strong> {selectedComplaint.quantity_affected}</div>
              <div><strong>Complaint Type:</strong> {selectedComplaint.complaint_type}</div>
              <div><strong>Severity & Priority:</strong> {selectedComplaint.initial_severity} / {selectedComplaint.priority}</div>
              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px', marginTop: '8px' }}>
                <strong>Description:</strong>
                <p style={{ marginTop: '4px' }}>{selectedComplaint.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
