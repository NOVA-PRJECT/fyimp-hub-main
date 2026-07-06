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
          <span>KUC MANGATTUPARAMBA • FYIMP PORTAL</span>
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
              <h3>Universal Resource Hub</h3>
              <p>Get <b>Any PDF</b> online and download for offline study.</p>
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
            <h4>6 departments</h4>
            <p>paper specific syllabus.</p>
          </div>
        </div>
      </section>

      {/* 3. Official Verification Ribbon */}
      <div className="verification-ribbon">
        <div className="v-icon-box">
          <ShieldCheck size={24} />
        </div>
        <div className="v-text">
          <p className="v-title">From students</p>
          <p className="v-sub">All resources available here are provided by the students.</p>
        </div>
      </div>

      {/* 4. Quick Links (Below where Dept used to be) */}
      <section className="quick-links">
        <div className="section-divider">
          <h2>Quick Resources</h2>
          <div className="line"></div>
        </div>
        <div className="links-grid"><a href="https://www.kannuruniversity.ac.in/en/">
           <button className="link-btn"><BookMarked size={30} className="text-crimson"/> Kannur University Official Website</button></a>
           
           <a href="https://kannur.kreap.co.in/">
           <button className="link-btn"><Zap size={30} className="text-amber"/> University Students portal</button></a>
        </div>
      </section>

      {/* 5. Contribution CTA */}
      <div className="contribution-card">
        <BookOpen className="cta-icon" />
        <h4>Build the KU Hub</h4>
        <p>Missing a resource? Upload it to help others.</p>
        <button className="cta-button">Upload / Request PDF</button>
      </div>
    </div>
  );
};

export default HomeView;
