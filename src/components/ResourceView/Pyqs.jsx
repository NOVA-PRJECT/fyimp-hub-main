import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FileText, Eye, Download, Loader2 } from "lucide-react";
import { supabase } from "../../supabaseClient";
import { useParams, useSearchParams } from "react-router-dom"; // ✅ Added useSearchParams
import PdfViewer from "./PdfViewer";
import { downloadPdf } from "../../utils/download";
import "./View.css";

/* Exam display order */
const EXAM_ORDER = {
  semester: 1,
  model: 2,
  supplementary: 3,
  reexam: 4,
  internal: 5,
};

function PYQs() {
  const { paperId } = useParams();

  // 1. URL Search Params Setup
  const [searchParams, setSearchParams] = useSearchParams();
  const activePdfId = searchParams.get("pdf"); // Grabs the ID from ?pdf=123

  const [pyqs, setPyqs] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Find the active PDF directly from the flat pyqs array
  const activePyq = activePdfId 
    ? pyqs.find((pyq) => pyq.id.toString() === activePdfId)
    : null;
  
  const activePdfUrl = activePyq?.pdf_url;

  /* Fetch PYQs */
  useEffect(() => {
    if (!paperId) return;

    const fetchPYQs = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("paper_pyqs")
        .select("*")
        .eq("paper_id", paperId)
        .eq("is_active", true)
        .order("exam_year", { ascending: false })
        .order("priority", { ascending: true });

      if (error) {
        console.error("PYQ fetch error:", error);
        setPyqs([]);
      } else {
        setPyqs(data || []);
      }

      setLoading(false);
    };

    fetchPYQs();
  }, [paperId]);

  // 3. The URL Cleaner (Replaces the old window.history popstate hack)
  useEffect(() => {
    // If loading is done, we have pyqs, there's an ID in the URL, BUT the pyq wasn't found...
    if (!loading && pyqs.length > 0 && activePdfId && !activePyq) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("pdf");
      setSearchParams(newParams, { replace: true }); // Wipe it cleanly
    }
  }, [activePdfId, activePyq, loading, pyqs, searchParams, setSearchParams]);

  // 4. URL-based Close Handler
  const handleCloseViewer = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("pdf");
    setSearchParams(newParams, { replace:true});
  };



  /* ---------- UI STATES ---------- */

  if (loading) {
    return (
      <div className="pyqs-view center">
        <Loader2 className="animate-spin" />
        <p>Loading previous year papers...</p>
      </div>
    );
  }

  if (!pyqs.length) {
    return (
      <div className="pyqs-view empty">
        <FileText size={48} opacity={0.4} />
        <p>No previous year question papers available</p>
      </div>
    );
  }

  /* Group by year */
  const groupedByYear = pyqs.reduce((acc, pyq) => {
    if (!acc[pyq.exam_year]) acc[pyq.exam_year] = [];
    acc[pyq.exam_year].push(pyq);
    return acc;
  }, {});

  return (
    <div className="pyqs-view">
      {Object.keys(groupedByYear)
        .sort((a, b) => b - a)
        .map((year) => {
          const yearPapers = groupedByYear[year].sort(
            (a, b) =>
              EXAM_ORDER[a.exam_category] -
              EXAM_ORDER[b.exam_category]
          );

          return (
            <div className="pyq-year-group" key={year}>
              <h3 className="pyq-year">{year}</h3>

              {yearPapers.map((pyq) => (
                <div className="pyq-card" key={pyq.id}>
                  <div className="pyq-left">
                    <FileText size={22} className="pyqicon" />
                    <span className="pyq-title">
                      {pyq.exam_category === "internal"
                        ? `Internal ${pyq.internal_number}`
                        : pyq.exam_category.replace(
                            /^\w/,
                            (c) => c.toUpperCase()
                          )}
                    </span>
                  </div>

                  <div className="pyq-actions">
                    {/* 5. Update URL state instead of local state */}
                    <button
                      className="icon-btn"
                      onClick={() => setSearchParams({ pdf: pyq.id },{ replace:true})}
                    >
                      <Eye size={18} />
                    </button>

                    <button
                      className="icon-btn"
                      onClick={() =>
                        downloadPdf(
                          pyq.pdf_url,
                          `PYQ_${pyq.exam_category}_${year}.pdf`
                        )
                      }
                    >
                      <Download size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          );
        })}

      {/* PDF VIEWER (PORTAL) */}
      {activePdfUrl &&
        createPortal(
          <PdfViewer
            fileUrl={activePdfUrl}
            onClose={handleCloseViewer}
          />,
          document.body
        )}
    </div>
  );
}

export default PYQs;
