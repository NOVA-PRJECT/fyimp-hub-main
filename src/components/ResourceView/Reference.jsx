import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "./Reference.css";
import {
  Youtube,
  Globe,
  FileText,
  BookOpen,
  Eye,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { supabase } from "../../supabaseClient";
import PdfViewer from "./PdfViewer";

/* ---------- ORDER & LABELS ---------- */

const TYPE_ORDER = {
  youtube_video: 1,
  youtube_playlist: 2,
  website: 3,
  blog: 4,
  book_pdf: 5,
};

const GROUP_LABELS = {
  youtube_video: "📺 Video References",
  youtube_playlist: "📺 Video References",
  website: "🌐 Web References",
  blog: "🌐 Web References",
  book_pdf: "📘 Books / PDFs",
};

const ICON_MAP = {
  youtube_video: <Youtube size={18} />,
  youtube_playlist: <Youtube size={18} />,
  website: <Globe size={18} />,
  blog: <Globe size={18} />,
  book_pdf: <FileText size={18} />,
};

function Reference({ paperid }) {
  const [refs, setRefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePdf, setActivePdf] = useState(null);

  /* ---------- FETCH ---------- */

  useEffect(() => {
    if (!paperid) return;

    const fetchRefs = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("paper_references")
        .select("*")
        .eq("paper_id", paperid)
        .eq("is_active", true);

      if (error) {
        console.error("Reference fetch error:", error);
        setRefs([]);
      } else {
        setRefs(data || []);
      }

      setLoading(false);
    };

    fetchRefs();
  }, [paperid]);

  /* ---------- SORT + GROUP ---------- */

  const ordered = [...refs].sort(
    (a, b) =>
      TYPE_ORDER[a.reference_type] -
        TYPE_ORDER[b.reference_type] ||
      (a.priority || 1) - (b.priority || 1)
  );

  const grouped = ordered.reduce((acc, ref) => {
    const key = GROUP_LABELS[ref.reference_type];
    if (!acc[key]) acc[key] = [];
    acc[key].push(ref);
    return acc;
  }, {});

  /* ---------- UI STATES ---------- */

  if (loading) {
    return (
      <div className="reference-view center">
        <Loader2 className="animate-spin" />
        <p>Loading references...</p>
      </div>
    );
  }

  if (!refs.length) {
    return (
      <div className="reference-view empty">
        <BookOpen size={48} opacity={0.4} />
        <p>No references available</p>
      </div>
    );
  }

  /* ---------- RENDER ---------- */

  return (
    <div className="reference-view">
      {Object.entries(grouped).map(([groupName, items]) => (
        <div key={groupName} className="reference-group">
          <h3 className="group-title">{groupName}</h3>

          {items.map((ref) => (
            <div className="reference-card" key={ref.id}>
              <div className="ref-left" >
                {ICON_MAP[ref.reference_type]}
                <div className="ref-text">
                  <span className="ref-title">{ref.title}</span>
                  {ref.author && (
                    <span className="ref-author">{ref.author}</span>
                  )}
                </div>
              </div>

              <div className="ref-actions">
                {/* VIEW (only for PDFs) */}
                {ref.reference_type === "pdf" && ref.url && (
                  <button
                    className="icon-btn"
                    onClick={() => setActivePdf(ref.url)}
                  >
                    <Eye size={18} />
                  </button>
                )}

                {/* OPEN LINK */}
                {ref.url && (
                  <button
                    className="icon-btn"
                    onClick={() => window.open(ref.url, "_blank")}
                  >
                    <ExternalLink size={18} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* PDF VIEWER */}
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

export default Reference;