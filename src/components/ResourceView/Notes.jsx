import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  FileText,
  NotebookText,
  Eye,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { supabase } from "../../supabaseClient";
import { useParams } from "react-router-dom";
import PdfViewer from "./PdfViewer";
import "./Notes.css";

function Notes() {
  const { paperId } = useParams(); // ✅ URL is the source of truth

  const [notesByModule, setNotesByModule] = useState({});
  const [loading, setLoading] = useState(false);

  const [activePdf, setActivePdf] = useState(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  useEffect(() => {
    if (!paperId) return;

    async function fetchNotes() {
      setLoading(true);

      const { data, error } = await supabase
        .from("paper_notes")
        .select("*")
        .eq("paper_id", paperId)
        .eq("is_active", true)
        .order("priority", { ascending: true });

      if (error) {
        console.error("Notes fetch error:", error);
        setNotesByModule({});
        setLoading(false);
        return;
      }

      const grouped = {};
      data.forEach((note) => {
        if (!grouped[note.module_number]) {
          grouped[note.module_number] = [];
        }
        grouped[note.module_number].push(note);
      });

      setNotesByModule(grouped);
      setLoading(false);
    }

    fetchNotes();
  }, [paperId]);

  // Handle back button for PDF viewer
  useEffect(() => {
    if (!isViewerOpen) return;

    window.history.pushState({ view: "pdf" }, "");
    const handlePopState = () => setIsViewerOpen(false);
    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, [isViewerOpen]);

  const handleCloseViewer = () => {
    if (window.history.state?.view === "pdf") {
      window.history.back();
    } else {
      setIsViewerOpen(false);
    }
  };

  const handleDownload = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="notes-loading">
        <Loader2 className="animate-spin" />
        <p>Loading notes...</p>
      </div>
    );
  }

  return (
    <div className="notes">
      {[1, 2, 3, 4].map((module) => (
        <div key={module} className="module-block">
          <h3 className="module-title">Module {module}</h3>

          <div className="notes-row-wrapper">
            <div className="notes-row">
              {notesByModule[module]?.length ? (
                <>
                  {notesByModule[module].map((note) => (
                    <div key={note.id} className="note-card">
                      <NotebookText className="note-icon" />

                      <p className="note-label">
                        Priority {note.priority}
                      </p>

                      <div className="note-actions">
                        <button
                          className="note-btn"
                          onClick={() => {
                            setActivePdf(note.pdf_url);
                            setIsViewerOpen(true);
                          }}
                        >
                          <Eye size={16} /> View
                        </button>

                        <button
                          className="note-btn"
                          onClick={() =>
                            handleDownload(
                              note.pdf_url,
                              `Module_${module}_Priority_${note.priority}.pdf`
                            )
                          }
                        >
                          <ExternalLink size={16} /> Download
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="note-coming-soon">
                    <FileText className="note-icon-muted" />
                    <p className="note-label">More coming soon</p>
                  </div>
                </>
              ) : (
                <div className="note-coming-soon">
                  <FileText className="note-icon-muted" />
                  <p className="note-label">More coming soon</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {isViewerOpen &&
        activePdf &&
        createPortal(
          <PdfViewer fileUrl={activePdf} onClose={handleCloseViewer} />,
          document.body
        )}
    </div>
  );
}

export default Notes;