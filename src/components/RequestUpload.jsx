import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  UploadCloud, 
  Send, 
  FileText, 
  HelpCircle, 
  CheckCircle, 
  AlertCircle,
  FileCheck,
  Link,
  BookOpen,
  User,
  FolderOpen
} from "lucide-react";
import { supabase } from "../supabaseClient";
import toast from "react-hot-toast";
import "./RequestUpload.css";

export default function RequestUpload() {
  const navigate = useNavigate();
  
  // Tab: 'request' or 'upload'
  const [formType, setFormType] = useState("request");

  // Form State
  const [userName, setUserName] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [selectedDeptId, setSelectedDeptId] = useState("");
  const [selectedSem, setSelectedSem] = useState("");
  const [selectedPaperId, setSelectedPaperId] = useState("");
  const [customPaperName, setCustomPaperName] = useState("");
  const [resourceType, setResourceType] = useState("notes");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  
  // File upload state
  const [file, setFile] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Dynamic Options
  const [departments, setDepartments] = useState([]);
  const [papers, setPapers] = useState([]);
  const [loadingDepts, setLoadingDepts] = useState(true);
  const [loadingPapers, setLoadingPapers] = useState(false);

  // Submit and UI States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Fetch Departments
  useEffect(() => {
    async function getDepartments() {
      try {
        setLoadingDepts(true);
        const { data, error } = await supabase
          .from("departments")
          .select("id, name")
          .order("name", { ascending: true });

        if (error) throw error;
        setDepartments(data || []);
      } catch (err) {
        console.error("Error fetching departments:", err);
        toast.error("Failed to load departments.");
      } finally {
        setLoadingDepts(false);
      }
    }
    getDepartments();
  }, []);

  // Fetch Papers based on selected Department & Semester
  useEffect(() => {
    if (!selectedDeptId || !selectedSem) {
      setPapers([]);
      setSelectedPaperId("");
      return;
    }

    async function getPapers() {
      try {
        setLoadingPapers(true);
        const { data, error } = await supabase
          .from("papers")
          .select("id, name")
          .eq("department_id", selectedDeptId)
          .eq("semester", Number(selectedSem))
          .order("name", { ascending: true });

        if (error) throw error;
        setPapers(data || []);
        setSelectedPaperId("");
      } catch (err) {
        console.error("Error fetching papers:", err);
      } finally {
        setLoadingPapers(false);
      }
    }

    getPapers();
  }, [selectedDeptId, selectedSem]);

  // Back Button Navigation
  const handleBack = () => {
    if (window.history.state && window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/", { state: { forceHome: true } });
    }
  };

  // Drag and Drop File Handlers - 2MB Limit
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 2 * 1024 * 1024) { // 2MB limit
        toast.error("File size exceeds the 2MB limit.");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      if (droppedFile.size > 2 * 1024 * 1024) { // 2MB limit
        toast.error("File size exceeds the 2MB limit.");
        return;
      }
      setFile(droppedFile);
    }
  };

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation - All are required
    if (!selectedDeptId) {
      toast.error("Please select a department.");
      return;
    }
    if (!selectedSem) {
      toast.error("Please select a semester.");
      return;
    }
    if (!selectedPaperId) {
      toast.error("Please select a subject or paper.");
      return;
    }
    if (selectedPaperId === "other" && !customPaperName.trim()) {
      toast.error("Please enter the custom subject name.");
      return;
    }
    if (!title.trim()) {
      toast.error("Please enter a title or topic name.");
      return;
    }
    if (!resourceType) {
      toast.error("Please select a resource type.");
      return;
    }
    if (formType === "request" && !description.trim()) {
      toast.error("Please describe what resource you need.");
      return;
    }
    if (formType === "upload" && !file && !externalUrl.trim()) {
      toast.error("Please upload a PDF file or provide a link to the document.");
      return;
    }

    setIsSubmitting(true);
    let finalFileUrl = externalUrl.trim();

    try {
      // 1. If we have a file and it's upload mode, upload to Supabase Storage
      if (formType === "upload" && file) {
        setUploadingFile(true);
        setUploadProgress(20);

        // Sanitize file name: remove special chars
        const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
        const filePath = `${selectedDeptId}/sem_${selectedSem}/${Date.now()}_${cleanFileName}`;

        setUploadProgress(50);
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("resource-uploads")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          console.error("Storage upload error:", uploadError);
          if (!finalFileUrl) {
            throw new Error("Failed to upload file to storage. Please use an external link instead.");
          } else {
            toast.warn("Direct file upload failed. Proceeding with external URL.");
          }
        } else {
          // Get public URL
          setUploadProgress(80);
          const { data: publicUrlData } = supabase.storage
            .from("resource-uploads")
            .getPublicUrl(filePath);

          finalFileUrl = publicUrlData?.publicUrl || "";
          setUploadProgress(100);
        }
      }

      // 2. Insert Request/Upload record into Supabase Table
      const { error: insertError } = await supabase
        .from("resource_requests")
        .insert([
          {
            type: formType,
            user_name: userName.trim() || null,
            contact_info: contactInfo.trim() || null,
            department_id: Number(selectedDeptId),
            semester: Number(selectedSem),
            paper_id: selectedPaperId !== "other" ? Number(selectedPaperId) : null,
            paper_name_custom: selectedPaperId === "other" ? customPaperName.trim() : null,
            resource_type: resourceType,
            title: title.trim(),
            description: description.trim() || null,
            file_url: finalFileUrl || null,
            status: "pending",
          },
        ]);

      if (insertError) throw insertError;

      // Reset form and show success
      setSubmitSuccess(true);
      toast.success(formType === "upload" ? "Resource uploaded successfully!" : "Resource request submitted!");
      
      // Clear values
      setUserName("");
      setContactInfo("");
      setSelectedDeptId("");
      setSelectedSem("");
      setSelectedPaperId("");
      setCustomPaperName("");
      setTitle("");
      setDescription("");
      setExternalUrl("");
      setFile(null);
    } catch (err) {
      console.error("Submit error:", err);
      toast.error(err.message || "Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
      setUploadingFile(false);
      setUploadProgress(0);
    }
  };

  return (
    <main className="request-upload-page allow-select">
      <div className="ru-container">
        
        {/* Back Button */}
        <button className="ru-back-btn" onClick={handleBack}>
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>

        {/* Success State */}
        {submitSuccess ? (
          <div className="success-card glass-card fade-in">
            <div className="success-icon-wrapper">
              <CheckCircle className="success-icon animate-bounce" size={48} />
            </div>
            <h2>Thank You!</h2>
            <p>
              {formType === "upload" 
                ? "Your document has been submitted for verification. It will show up in the app once approved." 
                : "Your resource request has been logged. Our student contributors will try to source it."}
            </p>
            <div className="success-actions">
              <button 
                className="ru-btn primary-btn" 
                onClick={() => {
                  setSubmitSuccess(false);
                }}
              >
                Submit Another
              </button>
              <button className="ru-btn secondary-btn" onClick={() => navigate("/")}>
                Back to Home
              </button>
            </div>
          </div>
        ) : (
          <div className="ru-card glass-card">
            
            {/* Header */}
            <div className="ru-header">
              <div className="ru-badge">
                <BookOpen size={14} className="accent-blue" />
                <span>COMMUNITY CONTRIBUTION</span>
              </div>
              <h1>Contribute to KU Hub</h1>
              <p className="ru-subtitle">
                Submit documents you have, or request items that are missing.
              </p>
            </div>

            {/* Tab Navigation */}
            <div className="tabs-container">
              <button 
                className={`tab-btn ${formType === "request" ? "active-tab" : ""}`}
                onClick={() => setFormType("request")}
              >
                <HelpCircle size={18} />
                <span>Request a PDF</span>
              </button>
              <button 
                className={`tab-btn ${formType === "upload" ? "active-tab" : ""}`}
                onClick={() => setFormType("upload")}
              >
                <UploadCloud size={18} />
                <span>Upload a PDF</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="ru-form">
              
              {/* SECTION 1: USER DETAILS */}
              <div className="ru-section-block">
                <div className="ru-section-header">
                  <User size={16} className="section-icon-color" />
                  <h3>User Details</h3>
                </div>
                
                <div className="form-row two-cols">
                  <div className="form-group">
                    <label htmlFor="userName">Your Name (Optional)</label>
                    <input
                      type="text"
                      id="userName"
                      placeholder="e.g., Amal Krishna"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contactInfo">Contact Info (Optional)</label>
                    <input
                      type="text"
                      id="contactInfo"
                      placeholder="e.g., WhatsApp number or Email"
                      value={contactInfo}
                      onChange={(e) => setContactInfo(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: RESOURCE DETAILS */}
              <div className="ru-section-block">
                <div className="ru-section-header">
                  <FolderOpen size={16} className="section-icon-color" />
                  <h3>Resource Details</h3>
                </div>

                {/* Row 2: Department and Semester */}
                <div className="form-row two-cols">
                  <div className="form-group">
                    <label htmlFor="department">Department *</label>
                    <select
                      id="department"
                      value={selectedDeptId}
                      onChange={(e) => setSelectedDeptId(e.target.value)}
                      disabled={loadingDepts}
                      required
                    >
                      <option value="">-- Select Department --</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="semester">Semester *</label>
                    <select
                      id="semester"
                      value={selectedSem}
                      onChange={(e) => setSelectedSem(e.target.value)}
                      required
                    >
                      <option value="">-- Select Semester --</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((semNum) => (
                        <option key={semNum} value={semNum}>
                          Semester {semNum}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Row 3: Subject / Paper Selection */}
                <div className="form-group">
                  <label htmlFor="paper">Subject / Paper *</label>
                  <select
                    id="paper"
                    value={selectedPaperId}
                    onChange={(e) => setSelectedPaperId(e.target.value)}
                    disabled={loadingPapers || (!selectedDeptId || !selectedSem)}
                    required
                  >
                    <option value="">
                      {!selectedDeptId || !selectedSem 
                        ? "-- Pick Dept & Sem First --" 
                        : "-- Select Subject --"}
                    </option>
                    {papers.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                    {(selectedDeptId && selectedSem) && (
                      <option value="other">Other / Not in List</option>
                    )}
                  </select>
                </div>

                {/* Custom Subject Name Input */}
                {(selectedPaperId === "other" || (!selectedPaperId && selectedDeptId && selectedSem)) && (
                  <div className="form-group fade-in">
                    <label htmlFor="customPaper">Subject Name *</label>
                    <input
                      type="text"
                      id="customPaper"
                      placeholder="e.g., Mathematical Physics II"
                      value={customPaperName}
                      onChange={(e) => setCustomPaperName(e.target.value)}
                      required
                    />
                  </div>
                )}

                {/* Row 4: Resource Type and Topic Title */}
                <div className="form-row two-cols">
                  <div className="form-group">
                    <label htmlFor="resourceType">Resource Type *</label>
                    <select
                      id="resourceType"
                      value={resourceType}
                      onChange={(e) => setResourceType(e.target.value)}
                      required
                    >
                      <option value="notes">Notes / Lecture Materials</option>
                      <option value="pyq">PYQ (Previous Year Questions)</option>
                      <option value="syllabus">Official Syllabus Copy</option>
                      <option value="reference">Reference Book / PDF Link</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="title">Resource Title / Topic *</label>
                    <input
                      type="text"
                      id="title"
                      placeholder={
                        formType === "upload" 
                          ? "e.g., Module 3 Graph Theory Notes" 
                          : "e.g., 2023 Real Analysis PYQ"
                      }
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="form-group">
                  <label htmlFor="description">
                    {formType === "upload" ? "Resource Description (Optional)" : "What exactly do you need? *"}
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    placeholder={
                      formType === "upload"
                        ? "Briefly describe the contents of this resource..."
                        : "Describe details like specific unit, year of PYQ, or author name..."
                    }
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required={formType === "request"}
                  />
                </div>

                {/* Upload PDF Section */}
                {formType === "upload" && (
                  <div className="upload-section fade-in">
                    <label className="section-subtitle">Add Your Document *</label>
                    
                    {/* Dropzone */}
                    <div 
                      className={`dropzone ${file ? "has-file" : ""}`}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                    >
                      <input 
                        type="file" 
                        id="fileInput" 
                        accept=".pdf" 
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                      />
                      <label htmlFor="fileInput" className="dropzone-label">
                        {file ? (
                          <>
                            <FileCheck className="dropzone-icon success-color" size={32} />
                            <div className="file-info">
                              <span className="file-name">{file.name}</span>
                              <span className="file-size">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                            </div>
                            <button 
                              type="button" 
                              className="remove-file-btn"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setFile(null);
                              }}
                            >
                              Remove
                            </button>
                          </>
                        ) : (
                          <>
                            <UploadCloud className="dropzone-icon" size={32} />
                            <p className="dropzone-text">
                              Drag and drop your PDF here, or <span>browse</span>
                            </p>
                            <span className="dropzone-sub">Max file size: 2MB</span>
                          </>
                        )}
                      </label>
                    </div>

                    <div className="or-divider">
                      <span className="line"></span>
                      <span className="text">OR</span>
                      <span className="line"></span>
                    </div>

                    {/* External Link */}
                    <div className="form-group">
                      <label htmlFor="externalUrl">
                        <Link size={14} style={{ marginRight: 6 }} />
                        Link to Document (Google Drive, Mega, etc.)
                      </label>
                      <input
                        type="url"
                        id="externalUrl"
                        placeholder="https://drive.google.com/..."
                        value={externalUrl}
                        onChange={(e) => setExternalUrl(e.target.value)}
                      />
                      <span className="help-text">
                        Make sure link sharing settings are set to "Anyone with the link can view".
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Progress Bar for file uploading */}
              {uploadingFile && (
                <div className="progress-container">
                  <div className="progress-bar-wrapper">
                    <div 
                      className="progress-bar" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">Uploading PDF: {uploadProgress}%</span>
                </div>
              )}

              {/* Action Buttons */}
              <button 
                type="submit" 
                className="ru-submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Submit to Hub</span>
                  </>
                )}
              </button>

            </form>
          </div>
        )}
      </div>
    </main>
  );
}
