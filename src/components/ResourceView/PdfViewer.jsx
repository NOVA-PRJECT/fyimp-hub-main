import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useNavigate } from "react-router-dom";
import { X, ZoomIn, ZoomOut, AlertCircle } from "lucide-react";
import "./View.css";
import ShareButton from "../ShareButton";
pdfjs.GlobalWorkerOptions.workerSrc =
  `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const SkeletonLoader = () => (
  <div className="pdf-skeleton-wrapper">
    <div className="pdf-skeleton-page shimmer"></div>
    <div className="pdf-skeleton-page shimmer delay"></div>
  </div>
);

const ErrorFallback = ({ onClose }) => (
  <div className="pdf-error-wrapper">
    <AlertCircle size={48} className="error-icon" />
    <h3>Document Unavailable</h3>
    <p>We couldn't load this PDF. Please check your connection.</p>
    <button onClick={onClose} className="error-close-btn">
      Go Back
    </button>
  </div>
);

function PdfViewer({ fileUrl, onClose, title = "Document Viewer" }) {
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(1);
  // Calculate initial width to fit screen perfectly
  const [pageWidth, setPageWidth] = useState(window.innerWidth > 800 ? 800 : window.innerWidth);

const navigate=useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setPageWidth(window.innerWidth > 800 ? 800 : window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="pdf-modal-overlay">
      <div className="pdf-modal-container">
        
        <div className="pdf-top-header">
          <button onClick={onClose} className="pdf-icon-btn close-btn">
            <X size={24} />
          </button>
          <h2 className="pdf-title">{title}</h2>
          <div className="header-spacer"></div>
        </div>

        <div className="pdf-viewer-content">
          <Document
            file={fileUrl}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            loading={<SkeletonLoader />}
            error={<ErrorFallback onClose={onClose} />}
          >
            {Array.from(new Array(numPages), (_, index) => (
              <div key={`page_container_${index + 1}`} className="pdf-page-wrapper">
                <Page
                  pageNumber={index + 1}
                  scale={scale}
                  width={pageWidth}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="pdf-page"
                />
              </div>
            ))}
          </Document>
        </div>

        {numPages && (
          <div className="pdf-floating-toolbar">
            <button 
              onClick={() => setScale((s) => Math.max(s - 0.2, 0.5))}
              className="pdf-icon-btn zoom-btn"
              disabled={scale <= 0.5}
            >
              <ZoomOut size={20} />
            </button>
            <div className="zoom-indicator">{Math.round(scale * 100)}%</div>
            <button 
              onClick={() => setScale((s) => Math.min(s + 0.2, 3))}
              className="pdf-icon-btn zoom-btn"
              disabled={scale >= 3}
            >
              <ZoomIn size={20} />
            </button>
          </div>
        )}
        <ShareButton />
      </div>
    </div>
  );
}

export default PdfViewer;
