import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { X, ZoomIn, ZoomOut } from "lucide-react";
import "./View.css";

// Keep your existing worker (since this version already works for you)
pdfjs.GlobalWorkerOptions.workerSrc =
  `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function PdfViewer({ fileUrl, onClose }) {
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(1);

  return (
    <div className="pdf-modal-overlay">
      <div className="pdf-modal-container">

        {/* Toolbar */}
        <div className="pdf-toolbar">
          <div className="pdf-info">
            <button onClick={onClose} className="close-btn">
              <X size={24} />
            </button>
            <span>Syllabus Viewer</span>
          </div>

          <div className="pdf-zoom">
            <button onClick={() => setScale(s => Math.min(s + 0.2, 2))}>
              <ZoomIn size={20} />
            </button>
            <button onClick={() => setScale(s => Math.max(s - 0.2, 0.5))}>
              <ZoomOut size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable PDF */}
        <div className="pdf-viewer-content">
          <Document
            file={fileUrl}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            loading={<div className="loader">Loading PDF…</div>}
            error={<div className="loader error">Failed to load PDF</div>}
          >
            {Array.from(new Array(numPages), (_, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                scale={scale}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            ))}
          </Document>
        </div>

      </div>
    </div>
  );
}

export default PdfViewer;