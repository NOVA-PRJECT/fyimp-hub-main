import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  FileText,
  NotebookText,
  Eye,
  Download,
  Loader2,
} from "lucide-react";
import { supabase } from "../../supabaseClient";
import { useParams, useSearchParams } from "react-router-dom";
import PdfViewer from "./PdfViewer";
import { downloadPdf } from "../../utils/download";
import "./View.css";

// ✅ The translation dictionary for your priorities
const priorityLabels = {
  1: "Faculty Note",
  2: "Student's Note",
  3: "Exam Prep",
  4: "Smart Note",
};

function Notes() {
  const { paperId } = useParams();

  const [searchParams, setSearchParams] = useSearchParams();
  const activePdfId = searchParams.get("pdf");

  const [notesByModule, setNotesByModule] = useState({});
  const [loading, setLoading] = useState(false);

  const activeNote = activePdfId
    ? Object.values(notesByModule).flat().find(note => note.id.toString() === activePdfId)
    : null;

  const activePdfUrl = activeNote?.pdf_url;

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

  const handleCloseViewer = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("pdf");
    setSearchParams(newParams, { replace: true});
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

                      {/* ✅ Translated the Priority into readable text */}
                      <p className="note-label">
                        {priorityLabels[note.priority] || `Priority ${note.priority}`}
                      </p>

                      <div className="note-actions">
                        <button
                          className="note-btn"
                          onClick={() => setSearchParams({ pdf: note.id }, { replace: true} )}
                        >
                          <Eye size={16} /> View
                        </button>

                        <button
                          className="note-btn"
                          onClick={() =>
                            downloadPdf(
                              note.pdf_url,
                              `Module_${module}_${priorityLabels[note.priority]?.replace(/\s+/g, '_') || 'Notes'}.pdf`
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

      {/* 5. Render portal based on URL state */}
      {activePdfUrl &&
        createPortal(
          <PdfViewer fileUrl={activePdfUrl} onClose={handleCloseViewer} title={`Module ${activeNote?.module_number} Notes`} />,
          document.body
        )}
    </div>
  );
}

export default Notes;
