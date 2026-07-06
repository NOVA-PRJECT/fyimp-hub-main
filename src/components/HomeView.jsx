import React from "react";
import {
  Sparkles,
  FileSearch,
  FileDown,
  RefreshCw,
  ShieldCheck,
  BookMarked,
  Zap,
  BookOpen,
} from "lucide-react";

function HomeView() {
  return (
    <div className="home-container">
      {/* Header */}
      <section className="welcome-header">
        <div className="badge">
          <Sparkles className="icon-sparkle" />
          <span>KUC MANGATTUPARAMBA • FYIMP PORTAL</span>
        </div>

        <h1 className="hero-title">
          Master Your <br />
          <span className="highlight">FYIMP</span> Journey.
        </h1>

        <p className="hero-subtitle">
          The definitive resource engine for <strong>Kannur University</strong>{" "}
          students. Access official Syllabi, Notes, and PYQs instantly.
        </p>
      </section>

      {/* Features */}
      <section className="features-grid">
        {/* Card 1 */}
        <div className="main-card">
          <div className="main-card-content">
            <div className="icon-wrapper-large">
              <FileDown className="icon-download" />
            </div>

            <div className="card-text">
              <h3>Universal Resource Hub</h3>
              <p>
                Get <b>Any PDF</b> online and download for offline study.
              </p>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="feature-item">
          <div className="icon-box-blue">
            <FileSearch size={20} />
          </div>

          <h4>Live Viewer</h4>
          <p>Read documents instantly.</p>
        </div>

        {/* Card 3 */}
        <div className="feature-item">
          <div className="icon-box-indigo">
            <RefreshCw size={20} />
          </div>

          <h4>6 Departments</h4>
          <p>Paper specific syllabus.</p>
        </div>

        {/* Card 4 */}
        <div className="verification-ribbon">
          <div className="v-icon-box">
            <ShieldCheck size={24} />
          </div>

          <div className="v-text">
            <p className="v-title">From students</p>
            <p className="v-sub">
              All resources available here are provided by the students.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="quick-links">
        <div className="section-divider">
          <h2>Quick Resources</h2>
          <div className="line"></div>
        </div>

        <div className="links-grid">
          <a href="https://www.kannuruniversity.ac.in/en/">
            <button className="link-btn">
              <BookMarked size={30} className="text-crimson" />
              Kannur University Official Website
            </button>
          </a>

          <a href="https://kannur.kreap.co.in/">
            <button className="link-btn">
              <Zap size={30} className="text-amber" />
              University Students Portal
            </button>
          </a>
        </div>
      </section>

      {/* CTA */}
      <div className="contribution-card">
        <BookOpen className="cta-icon" />

        <h4>Build the KU Hub</h4>

        <p>Missing a resource? Upload it to help others.</p>

        <button className="cta-button">Upload / Request PDF</button>
      </div>
    </div>
  );
}

export default HomeView;