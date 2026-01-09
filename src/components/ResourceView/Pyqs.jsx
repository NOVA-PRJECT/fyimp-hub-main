import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "./Pyqs.css";
import { FileText, Eye, ExternalLink, Loader2 } from "lucide-react";
import { supabase } from "../../supabaseClient";
import PdfViewer from "./PdfViewer";

/* Exam display order */
const EXAM_ORDER = {
  semester: 1,
  model: 2,
  supplementary: 3,
  reexam: 4,
  internal: 5,
};

function PYQs({ paperid, selectedPaper }) {
  const [pyqs, setPyqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePdf, setActivePdf] = useState(null);

  /* Fetch PYQs */
  useEffect(() => {
    if (!paperid) return;

    const fetchPYQs = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("paper_pyqs")
        .select("*")
        .eq("paper_id", paperid)
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
  }, [paperid]);

  /* Mobile back handling for PDF viewer */
  useEffect(() => {
    if (!activePdf) return;

    window.history.pushState({ view: "pyq-pdf" }, "");
    const onPop = () => setActivePdf(null);

    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [activePdf]);

  /* Download handler */
  const handleDownload = async (url, name) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, "_blank");
    }
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
                    <FileText size={22} className="pyqicon"/>
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
                    <button
                      className="icon-btn"
                      onClick={() => setActivePdf(pyq.pdf_url)}
                    >
                      <Eye size={18} />
                    </button>

                    <button
                      className="icon-btn"
                      onClick={() =>
                        handleDownload(
                          pyq.pdf_url,
                          `${selectedPaper}_${pyq.exam_category}_${year}.pdf`
                        )
                      }
                    >
                      <ExternalLink size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          );
        })}

      {/* PDF VIEWER (PORTAL) */}
      {activePdf &&
        createPortal(
          <PdfViewer
            fileUrl={activePdf}
            onClose={() => setActivePdf(null)}
          />,
          document.body
        )}
    </div>
  );
}

export default PYQs;