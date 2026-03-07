import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  FileText,
  NotebookText,
  Eye,
  Download,
  Loader2,
  Info, // ✅ Imported Info icon for the subtle hint
} from "lucide-react";
import { supabase } from "../../supabaseClient";
import { useParams, useSearchParams } from "react-router-dom";
import PdfViewer from "./PdfViewer";
import "./View.css";

function Notes() {
  const { paperId } = useParams();

  // 1. URL Search Params Setup
  const [searchParams, setSearchParams] = useSearchParams();
  const activePdfId = searchParams.get("pdf");

  const [notesByModule, setNotesByModule] = useState({});
  const [loading, setLoading] = useState(false);

  // 2. Find the active PDF URL by flattening our grouped modules
  const activeNote = activePdfId 
    ? Object.values(notesByModule).flat().find(note => note.id.toString() === activePdfId)
    : null;
  
  const activePdfUrl = activeNote?.pdf_url;

  // The URL Cleaner
  useEffect(() => {
    if (!loading && Object.keys(notesByModule).length > 0 && activePdfId && !activeNote) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("pdf");
      setSearchParams(newParams, { replace: true });
    }
  }, [activePdfId, activeNote, loading, notesByModule, searchParams, setSearchParams]);

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

  // 3. New URL-based Close Handler
  const handleCloseViewer = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("pdf");
    setSearchParams(newParams);
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
                          onClick={() => setSearchParams({ pdf: note.id })}
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
                          <Download size={16} /> Download
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

      {/* ✅ Subtle Priority Hint at the bottom */}
      <div className="priority-hint">
        <Info size={14} />
        <p>
          <strong>Priority Guide:</strong> 1 = Faculty Notes &nbsp;&bull;&nbsp; 2 = student's Notes &nbsp;&bull;&nbsp; 3 = Exam Prep &nbsp;&bull;&nbsp; 4 = AI-Generated Notes
        </p>
      </div>

      {/* Render portal based on URL state */}
      {activePdfUrl &&
        createPortal(
          <PdfViewer fileUrl={activePdfUrl} onClose={handleCloseViewer} title={`Module ${activeNote?.module_number} Notes`} />,
          document.body
        )}
    </div>
  );
}

export default Notes;
