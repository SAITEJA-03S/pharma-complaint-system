import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialFormState = {
  complaint_source: '',
  customer_name: '',
  product_name: '',
  product_strength: '',
  batch_number: '',
  manufacturing_date: '',
  expiry_date: '',
  quantity_affected: '',
  complaint_type: '',
  complaint_date: new Date().toISOString().split('T')[0],
  description: '',
  initial_severity: 'Medium',
  priority: 'Medium',
  status: 'Pending Triage'
};

export const extractComplaintData = createAsyncThunk(
  'complaint/extractData',
  async ({ text, file, apiKey }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setExtractionProgress({ progress: 20, statusText: 'Uploading complaint document...' }));

      const formData = new FormData();
      if (file) {
        formData.append('file', file);
      } else if (text) {
        formData.append('text', text);
      }
      if (apiKey) {
        formData.append('api_key', apiKey);
      }

      dispatch(setExtractionProgress({ progress: 50, statusText: 'Running LangGraph AI extraction agent...' }));

      const res = await fetch('/api/extract', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Extraction failed');

      dispatch(setExtractionProgress({ progress: 85, statusText: 'Evaluating risk assessment and duplicate match...' }));
      const data = await res.json();

      dispatch(setExtractionProgress({ progress: 100, statusText: 'Extraction complete!' }));

      // Also check duplicates directly against DB
      dispatch(checkDuplicateComplaint(data.complaint_data));

      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchComplaints = createAsyncThunk(
  'complaint/fetchComplaints',
  async () => {
    const res = await fetch('/api/complaints');
    if (!res.ok) throw new Error('Failed to fetch complaints');
    return await res.json();
  }
);

export const saveComplaintToDb = createAsyncThunk(
  'complaint/saveToDb',
  async (formData, { dispatch }) => {
    const res = await fetch('/api/complaints', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    dispatch(fetchComplaints());
    return data;
  }
);

export const checkDuplicateComplaint = createAsyncThunk(
  'complaint/checkDuplicate',
  async (complaintData) => {
    const res = await fetch('/api/analyze/duplicates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(complaintData),
    });
    return await res.json();
  }
);

export const sendChatMessage = createAsyncThunk(
  'complaint/sendChatMessage',
  async ({ message, complaintContext, apiKey }) => {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        complaint_context: complaintContext,
        api_key: apiKey
      }),
    });
    return await res.json();
  }
);

const complaintSlice = createSlice({
  name: 'complaint',
  initialState: {
    form: initialFormState,
    extractedKeys: [],
    apiKey: '',
    activeTab: 'log', // 'log' | 'tools' | 'registry'
    extraction: {
      isExtracting: false,
      progress: 0,
      statusText: 'Ready to extract document content',
      error: null
    },
    aiAnalysis: {
      completeness_score: 0,
      missing_fields: [],
      root_cause_analysis: null,
      capa_recommendation: null,
      risk_assessment: null,
      duplicate_check: null,
      summary: ''
    },
    chat: {
      messages: [
        { sender: 'assistant', text: 'Upload a complaint document or paste text above. I will automatically extract the details and populate the form for you.' }
      ],
      isTyping: false
    },
    savedComplaints: []
  },
  reducers: {
    updateFormField: (state, action) => {
      const { name, value } = action.payload;
      state.form[name] = value;
    },
    resetForm: (state) => {
      state.form = initialFormState;
      state.extractedKeys = [];
      state.aiAnalysis = {
        completeness_score: 0,
        missing_fields: [],
        root_cause_analysis: null,
        capa_recommendation: null,
        risk_assessment: null,
        duplicate_check: null,
        summary: ''
      };
    },
    setApiKey: (state, action) => {
      state.apiKey = action.payload;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setExtractionProgress: (state, action) => {
      state.extraction.progress = action.payload.progress;
      state.extraction.statusText = action.payload.statusText;
    },
    addUserChatMessage: (state, action) => {
      state.chat.messages.push({ sender: 'user', text: action.payload });
      state.chat.isTyping = true;
    }
  },
  extraReducers: (builder) => {
    builder
      // Extraction thunk
      .addCase(extractComplaintData.pending, (state) => {
        state.extraction.isExtracting = true;
        state.extraction.error = null;
      })
      .addCase(extractComplaintData.fulfilled, (state, action) => {
        state.extraction.isExtracting = false;
        const { complaint_data, completeness_score, missing_fields, root_cause_analysis, capa_recommendation, risk_assessment, summary } = action.payload;

        state.form = { ...state.form, ...complaint_data };
        state.extractedKeys = Object.keys(complaint_data);
        state.aiAnalysis.completeness_score = completeness_score;
        state.aiAnalysis.missing_fields = missing_fields;
        state.aiAnalysis.root_cause_analysis = root_cause_analysis;
        state.aiAnalysis.capa_recommendation = capa_recommendation;
        state.aiAnalysis.risk_assessment = risk_assessment;
        state.aiAnalysis.summary = summary;

        state.chat.messages.push({
          sender: 'assistant',
          text: `I have analyzed the document and extracted details for product **${complaint_data.product_name || 'N/A'}** (Batch: ${complaint_data.batch_number || 'N/A'}). Form populated!`
        });
      })
      .addCase(extractComplaintData.rejected, (state, action) => {
        state.extraction.isExtracting = false;
        state.extraction.error = action.payload;
        state.chat.messages.push({
          sender: 'assistant',
          text: `Extraction note: Using default structured parsing. ${action.payload || ''}`
        });
      })
      // Chat thunk
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.chat.isTyping = false;
        state.chat.messages.push({ sender: 'assistant', text: action.payload.reply });
      })
      // Duplicate check
      .addCase(checkDuplicateComplaint.fulfilled, (state, action) => {
        state.aiAnalysis.duplicate_check = action.payload;
      })
      // Complaints list
      .addCase(fetchComplaints.fulfilled, (state, action) => {
        state.savedComplaints = action.payload;
      });
  }
});

export const {
  updateFormField, resetForm, setApiKey, setActiveTab,
  setExtractionProgress, addUserChatMessage
} = complaintSlice.actions;

export default complaintSlice.reducer;
