import React from 'react';
import { useSelector } from 'react-redux';
import Header from './components/Header';
import ComplaintForm from './components/ComplaintForm';
import AIAssistant from './components/AIAssistant';
import AIToolsPanel from './components/AIToolsPanel';
import ComplaintsTable from './components/ComplaintsTable';

export default function App() {
  const { activeTab } = useSelector((state) => state.complaint);

  return (
    <div className="app-container">
      <Header />

      <main className="main-content">
        {activeTab === 'log' && (
          <div className="grid-2col">
            <ComplaintForm />
            <AIAssistant />
          </div>
        )}

        {activeTab === 'tools' && (
          <AIToolsPanel />
        )}

        {activeTab === 'registry' && (
          <ComplaintsTable />
        )}
      </main>
    </div>
  );
}
