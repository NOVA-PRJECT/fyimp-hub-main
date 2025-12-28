import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; // Added for teleporting the component
import './Syllabus.css';
import { FileText, ExternalLink, Eye, Loader2 } from 'lucide-react';
import { supabase } from '../../supabaseClient'; 
import PdfViewer from './PdfViewer';

function Syllabus({ selectedDept, selectedSem, selectedPaper, activeTab, paperid }) {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSyllabus = async () => {
      if (!paperid) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('paper_syllabus')
        .select('pdf_url')
        .eq('paper_id', paperid)
        .single();

      if (error) {
        console.error('Supabase Error: ' + error.message);
      } else if (data) {
        setPdfUrl(data.pdf_url);
      }
      setLoading(false);
    };
    fetchSyllabus();
  }, [paperid]);

  // Mobile Back Button Logic
  useEffect(() => {
    if (isViewerOpen) {
      window.history.pushState({ view: 'pdf' }, '');
      const handlePopState = () => setIsViewerOpen(false);
      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, [isViewerOpen]);

  const handleCloseViewer = () => {
    if (window.history.state?.view === 'pdf') {
      window.history.back();
    } else {
      setIsViewerOpen(false);
    }
  };

  const handleDownload = async () => {
    if (!pdfUrl) return;
    try {
      const response = await fetch(pdfUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${selectedPaper}_Syllabus.pdf`; 
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      window.open(pdfUrl, '_blank'); 
    }
  };

  return (
    <div className="syllabus">
      <div className="syllabus-card">
        <div className="icon-container">
          <FileText className="card-icon" />
        </div>

        <div className="card-content">
          <h3>Course Syllabus</h3>
          <p>{`Official syllabus document for ${selectedPaper} (Semester ${selectedSem})`}</p>
        </div>

        <div className="button-group">
          <button 
            className="view-btn" 
            onClick={() => setIsViewerOpen(true)}
            disabled={loading || !pdfUrl}
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : "View Syllabus"}
            <Eye className="btn-icon"/>
          </button>

          <button 
            className="view-btn" 
            onClick={handleDownload}
            disabled={loading || !pdfUrl}
          >
            Download Syllabus 
            <ExternalLink className="btn-icon" />
          </button>
        </div>
      </div>

      {/* PORTAL RENDERING: This moves the viewer to the very top of the DOM */}
      {isViewerOpen && pdfUrl && createPortal(
        <PdfViewer 
          fileUrl={pdfUrl} 
          onClose={handleCloseViewer} 
        />,
        document.body
      )}
    </div>
  );
}

export default Syllabus;
