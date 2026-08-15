import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateFormField, resetForm, saveComplaintToDb, setActiveTab } from '../store/complaintSlice';
import { RotateCcw, Save, Printer, User, Package, FileWarning, ShieldCheck } from 'lucide-react';

export default function ComplaintForm() {
  const dispatch = useDispatch();
  const { form, extractedKeys, aiAnalysis } = useSelector((state) => state.complaint);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateFormField({ name, value }));
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all fields?")) {
      dispatch(resetForm());
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.product_name || !form.batch_number) {
      alert("Please fill in at least Product Name and Batch Number before saving.");
      return;
    }

    const payload = {
      ...form,
      risk_score: aiAnalysis.risk_assessment?.risk_score || 50,
      risk_level: aiAnalysis.risk_assessment?.risk_level || 'Medium'
    };

    const res = await dispatch(saveComplaintToDb(payload)).unwrap();
    alert(res.message || "Complaint saved successfully to database!");
    dispatch(setActiveTab('registry'));
  };

  const handlePrint = () => {
    window.print();
  };

  const isExtracted = (key) => extractedKeys.includes(key);

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title">Log Customer Complaint</h2>
          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
            API & FDF Quality Assurance Standard Complaint Entry Form
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="button" className="btn btn-secondary" style={{ padding: '6px 10px', fontSize: '12px' }} onClick={handlePrint}>
            <Printer size={14} /> Print Audit Record
          </button>
        </div>
      </div>

      <form onSubmit={handleSave}>
        {/* SECTION 1 */}
        <div className="section-label">
          <User size={14} color="#2563eb" />
          1. Origin & Customer Details
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label>Complaint Source</label>
            <input 
              type="text"
              name="complaint_source"
              placeholder="e.g. Customer Email, Quality Portal, Field Report"
              value={form.complaint_source}
              onChange={handleChange}
              className={isExtracted('complaint_source') ? 'extracted' : ''}
            />
          </div>
          <div className="form-group">
            <label>Customer Name</label>
            <input 
              type="text"
              name="customer_name"
              placeholder="e.g. Global Pharma Distributors Inc."
              value={form.customer_name}
              onChange={handleChange}
              className={isExtracted('customer_name') ? 'extracted' : ''}
            />
          </div>
        </div>

        {/* SECTION 2 */}
        <div className="section-label">
          <Package size={14} color="#2563eb" />
          2. Product & Batch Identification
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label>Product Name (API / FDF)</label>
            <input 
              type="text"
              name="product_name"
              placeholder="e.g. Paracetamol 500mg / Amoxicillin API"
              value={form.product_name}
              onChange={handleChange}
              className={isExtracted('product_name') ? 'extracted' : ''}
            />
          </div>
          <div className="form-group">
            <label>Product Strength / Grade</label>
            <input 
              type="text"
              name="product_strength"
              placeholder="e.g. 500mg / USP Grade"
              value={form.product_strength}
              onChange={handleChange}
              className={isExtracted('product_strength') ? 'extracted' : ''}
            />
          </div>
          <div className="form-group">
            <label>Batch / Lot Number</label>
            <input 
              type="text"
              name="batch_number"
              placeholder="e.g. BATCH-2026-X88"
              value={form.batch_number}
              onChange={handleChange}
              className={isExtracted('batch_number') ? 'extracted' : ''}
            />
          </div>
          <div className="form-group">
            <label>Manufacturing Date</label>
            <input 
              type="date"
              name="manufacturing_date"
              value={form.manufacturing_date}
              onChange={handleChange}
              className={isExtracted('manufacturing_date') ? 'extracted' : ''}
            />
          </div>
          <div className="form-group">
            <label>Expiry Date</label>
            <input 
              type="date"
              name="expiry_date"
              value={form.expiry_date}
              onChange={handleChange}
              className={isExtracted('expiry_date') ? 'extracted' : ''}
            />
          </div>
          <div className="form-group">
            <label>Quantity Affected</label>
            <input 
              type="text"
              name="quantity_affected"
              placeholder="e.g. 500 kg or 1,500 units"
              value={form.quantity_affected}
              onChange={handleChange}
              className={isExtracted('quantity_affected') ? 'extracted' : ''}
            />
          </div>
        </div>

        {/* SECTION 3 */}
        <div className="section-label">
          <FileWarning size={14} color="#2563eb" />
          3. Complaint Details & Defect Description
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label>Complaint Type</label>
            <select 
              name="complaint_type"
              value={form.complaint_type}
              onChange={handleChange}
              className={isExtracted('complaint_type') ? 'extracted' : ''}
            >
              <option value="">-- Select Category --</option>
              <option value="Packaging">Packaging & Sealing Defect</option>
              <option value="Quality/Purity">Quality & Purity Defect</option>
              <option value="Contamination">Contamination / Foreign Particle</option>
              <option value="Labeling">Labeling / Misbranding</option>
              <option value="Efficacy">Therapeutic Efficacy Issue</option>
            </select>
          </div>
          <div className="form-group">
            <label>Complaint Date</label>
            <input 
              type="date"
              name="complaint_date"
              value={form.complaint_date}
              onChange={handleChange}
              className={isExtracted('complaint_date') ? 'extracted' : ''}
            />
          </div>
          <div className="form-group full-width">
            <label>Detailed Complaint Description</label>
            <textarea 
              name="description"
              placeholder="Detailed description of defect observed..."
              value={form.description}
              onChange={handleChange}
              rows={4}
              className={isExtracted('description') ? 'extracted' : ''}
            />
          </div>
        </div>

        {/* SECTION 4 */}
        <div className="section-label">
          <ShieldCheck size={14} color="#2563eb" />
          4. Initial Assessment & Priority Triage
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label>Initial Severity</label>
            <select 
              name="initial_severity"
              value={form.initial_severity}
              onChange={handleChange}
              className={isExtracted('initial_severity') ? 'extracted' : ''}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
          <div className="form-group">
            <label>Priority</label>
            <select 
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className={isExtracted('priority') ? 'extracted' : ''}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
        </div>

        <div className="button-row">
          <button type="button" className="btn btn-secondary" onClick={handleReset}>
            <RotateCcw size={15} />
            Reset Form
          </button>
          <button type="submit" className="btn btn-primary">
            <Save size={15} />
            Save Complaint to DB
          </button>
        </div>
      </form>
    </div>
  );
}
