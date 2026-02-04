import React from 'react';
import { 
  Sparkles, 
  FileSearch, 
  FileDown, 
  RefreshCw,
  ShieldCheck,
  BookMarked,
  Zap,
  BookOpen
} from 'lucide-react';

function HomeView(){
  return (
    <div className="home-container">
      {/* 1. Header Section */}
      <section className="welcome-header">
        <div className="badge">
          <Sparkles className="icon-sparkle" />
          <span>KANNUR UNIVERSITY • FYIMP PORTAL</span>
        </div>
        <h1 className="hero-title">
          Master Your <br/><span className="highlight">FYIMP</span> Journey.
        </h1>
        <p className="hero-subtitle">
          The definitive resource engine for <strong>Kannur University</strong> students. Access official Syllabi, Notes, and PYQs instantly.
        </p>
      </section>

      {/* 2. Feature Cards */}
      <section className="features-grid">
        <div className="main-card">
          <div className="main-card-content">
            <div className="icon-wrapper-large">
              <FileDown className="icon-download" />
            </div>
            <div className="card-text">
              <h3>Universal PDF Hub</h3>
              <p>View <u>Any PDF</u> online or download for offline study.</p>
            </div>
          </div>
        </div>

        <div className="sub-features">
          <div className="feature-item">
            <div className="icon-box-blue">
              <FileSearch size={20} />
            </div>
            <h4>Live Viewer</h4>
            <p>Read documents instantly.</p>
          </div>
          <div className="feature-item">
            <div className="icon-box-indigo">
              <RefreshCw size={20} />
            </div>
            <h4>KU NEP Sync</h4>
            <p>Latest credit schemes.</p>
          </div>
        </div>
      </section>

      {/* 3. Official Verification Ribbon */}
      <div className="verification-ribbon">
        <div className="v-icon-box">
          <ShieldCheck size={24} />
        </div>
        <div className="v-text">
          <p className="v-title">Official Verification</p>
          <p className="v-sub">All PDFs match official KU curriculum standards.</p>
        </div>
      </div>

      {/* 4. Quick Links (Below where Dept used to be) */}
      <section className="quick-links">
        <div className="section-divider">
          <h2>Quick Resources</h2>
          <div className="line"></div>
        </div>
        <div className="links-grid">
           <button className="link-btn"><BookMarked size={16} className="text-crimson"/> Exam Portal</button>
           <button className="link-btn"><Zap size={16} className="text-amber"/> Results</button>
        </div>
      </section>

      {/* 5. Contribution CTA */}
      <div className="contribution-card">
        <BookOpen className="cta-icon" />
        <h4>Build the KU Hub</h4>
        <p>Missing a paper? Upload it to help others.</p>
        <button className="cta-button">Upload / Request PDF</button>
      </div>
    </div>
  );
};

export default HomeView;