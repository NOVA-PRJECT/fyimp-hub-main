import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import "./View.css";
import { FileText, Download, Eye, Loader2 } from "lucide-react";
import { supabase } from "../../supabaseClient";
import { useParams, useSearchParams, useOutletContext } from "react-router-dom";
import PdfViewer from "./PdfViewer";
import { downloadPdf } from "../../utils/download";

function Syllabus() {
  const { paperId, sem } = useParams();
  const { paperName } = useOutletContext();

  // 1. REPLACED local state with URL Search Params
  const [searchParams, setSearchParams] = useSearchParams();
  const isViewerOpen = searchParams.get("pdf") === "true";

  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(false);
    // The URL Cleaner
  useEffect(() => {
    const currentPdfParam = searchParams.get("pdf");
    // If there is a parameter, but it's not exactly "true", wipe it out
    if (currentPdfParam && currentPdfParam !== "true") {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("pdf");
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);


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

  // 2. DELETED the manual window.history.pushState useEffect!
  // React Router automatically handles the browser history now.

  // 3. New Open/Close Handlers using the URL
  const handleOpenViewer = () => {
    setSearchParams({ pdf: "true" }, {replace:true} );
  };

  const handleCloseViewer = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("pdf");
    setSearchParams(newParams,{replace:true});
  };

  const handleDownload = () => {
    downloadPdf(pdfUrl, `${paperName}_syllabus.pdf`);
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
          {/* 4. Updated the onClick to use handleOpenViewer */}
          <button
            className="view-btn"
            onClick={handleOpenViewer}
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
