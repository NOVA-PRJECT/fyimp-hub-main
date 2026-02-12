import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import "./Syllabus.css";
import { FileText, Download, Eye, Loader2 } from "lucide-react";
import { supabase } from "../../supabaseClient";
import { useParams } from "react-router-dom";
import PdfViewer from "./PdfViewer";

function Syllabus() {
  const { paperId, sem } = useParams(); // ✅ URL is source of truth

  const [pdfUrl, setPdfUrl] = useState(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  /* Fetch syllabus */
  useEffect(() => {
    if (!paperId) return;

    const fetchSyllabus = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("paper_syllabus")
        .select("pdf_url")
        .eq("paper_id", paperId)
        .single();

      if (error) {
        console.error("Syllabus fetch error:", error);
        setPdfUrl(null);
      } else {
        setPdfUrl(data?.pdf_url || null);
      }

      setLoading(false);
    };

    fetchSyllabus();
  }, [paperId]);

  /* Mobile back handling */
  useEffect(() => {
    if (!isViewerOpen) return;

    window.history.pushState({ view: "syllabus-pdf" }, "");
    const onPop = () => setIsViewerOpen(false);

    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [isViewerOpen]);

  const handleCloseViewer = () => {
    if (window.history.state?.view === "syllabus-pdf") {
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
      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `Syllabus_Sem_${sem}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(pdfUrl, "_blank");
    }
  };

  /* ---------- UI ---------- */

  return (
    <div className="syllabus">
      <div className="syllabus-card">
        <div className="icon-container">
          <FileText className="card-icon" />
        </div>

        <div className="card-content">
          <h3>Course Syllabus</h3>
          <p>Official syllabus document</p>
        </div>

        <div className="button-group">
          <button
            className="view-btn"
            onClick={() => setIsViewerOpen(true)}
            disabled={loading || !pdfUrl}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              "View Syllabus"
            )}
            <Eye className="btn-icon" />
          </button>

          <button
            className="view-btn"
            onClick={handleDownload}
            disabled={loading || !pdfUrl}
          >
            Download Syllabus
            <Download className="btn-icon" />
          </button>
        </div>
      </div>

      {/* PDF VIEWER PORTAL */}
      {isViewerOpen &&
        pdfUrl &&
        createPortal(
          <PdfViewer fileUrl={pdfUrl} onClose={handleCloseViewer} />,
          document.body
        )}
    </div>
  );
}

export default Syllabus;