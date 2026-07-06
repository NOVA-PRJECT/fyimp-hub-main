import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Layers, FileText, HelpCircle, GraduationCap, Users, Lightbulb } from "lucide-react";
import "./About.css";

export default function About() {
  const navigate = useNavigate();

  const handleBack = () => {
    // If they came from an in-app page, go back. Otherwise, go to home.
    if (window.history.state && window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/", { state: { forceHome: true } });
    }
  };

  return (
    <main className="about-page">
      <div className="about-container">
        
        {/* Back Button */}
        <button className="about-back-btn" onClick={handleBack}>
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>

        {/* Hero Section */}
        <section className="about-hero-section">
          <div className="hero-glowing-backdrop"></div>
          <div className="hero-content">
            <span className="hero-badge">Academic Portal</span>
            <h1>FYIMP HUB</h1>
            <p className="hero-subtitle">
              A premium academic resource repository custom-built for students of 
              <span> Kannur University, Mangattuparamba Campus</span>.
            </p>
          </div>
        </section>

        {/* Core Mission Section */}
        <section className="about-card-section glass-card mission-card">
          <div className="card-decor-line"></div>
          <div className="section-header">
            <Lightbulb className="section-icon accent-yellow" />
            <h2>Why FYIMP HUB Exists</h2>
          </div>
          <div className="section-body">
            <p>
              Finding academic resources shouldn't feel like searching in the dark. Notes get scattered across WhatsApp chats, 
              past papers disappear into unorganized drives, and syllabus copies take too long to search.
            </p>
            <p>
              <strong>FYIMP HUB</strong> serves as a single, curated repository. We centralize papers, syllabus details, module notes, 
              and student references so you can focus on learning instead of hunting.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="about-features-section">
          <h2>What You Can Do Here</h2>
          <div className="features-grid">
            <div className="feature-grid-card">
              <div className="feat-icon-wrapper"><Layers size={22} /></div>
              <h3>Browse Papers</h3>
              <p>Quickly access all core and elective subjects organized by semester.</p>
            </div>
            <div className="feature-grid-card">
              <div className="feat-icon-wrapper"><FileText size={22} /></div>
              <h3>Syllabus Details</h3>
              <p>Instantly fetch syllabus guidelines for every paper without leaving the tab.</p>
            </div>
            <div className="feature-grid-card">
              <div className="feat-icon-wrapper"><BookOpen size={22} /></div>
              <h3>Module Notes</h3>
              <p>Access high-quality module notes, from lecture outlines to exam reviews.</p>
            </div>
            <div className="feature-grid-card">
              <div className="feat-icon-wrapper"><HelpCircle size={22} /></div>
              <h3>Previous Papers</h3>
              <p>Boost your preparation with a comprehensive collection of PYQs.</p>
            </div>
          </div>
        </section>

        {/* Departments Section */}
        <section className="about-card-section glass-card dept-card">
          <div className="section-header">
            <GraduationCap className="section-icon accent-blue" />
            <h2>Departments Covered</h2>
          </div>
          <p className="dept-intro">We curating course syllabus and academic materials across 10 semesters for departments including:</p>
          <div className="dept-tags">
            <span className="dept-tag-chip">Mathematics</span>
            <span className="dept-tag-chip">Information Technology</span>
            <span className="dept-tag-chip">Statistics</span>
            <span className="dept-tag-chip">History</span>
            <span className="dept-tag-chip">Physical Education</span>
            <span className="dept-tag-chip">Psychology</span>
            <span className="dept-tag-chip">Environmental Studies</span>
          </div>
        </section>

        {/* Story Section */}
        <section className="about-card-section glass-card story-card">
          <div className="section-header">
            <Users className="section-icon accent-purple" />
            <h2>Our Story</h2>
          </div>
          <div className="section-body">
            <p>
              FYIMP HUB was originally envisioned and founded by <strong>Shad CT</strong>, an IT student from the 2024 batch of the Four Year Undergraduate Programme (FYIMP).
            </p>
            <p>
              Today, the platform is maintained, enhanced, and updated by <strong>Project Nova</strong> — a student-led engineering initiative by the 2025 IT batch. Our goal is to leverage software craftsmanship to build tools that make academic life easier for everyone.
            </p>
          </div>
        </section>

      </div>
    </main>
  );
}