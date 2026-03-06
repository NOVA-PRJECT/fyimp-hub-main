import "./About.css";

export default function About() {
  return (
    <main className="about-page">

      {/* HERO */}
      <section className="about-hero">
        <h1>FYIMP HUB</h1>
        <p>
          A student-built academic platform created for learners of 
          Kannur University Mangattuparamba Campus.
        </p>
      </section>


      {/* WHY EXISTS */}
      <section className="about-section">
        <h2>Why FYIMP HUB Exists</h2>

        <p>
          Finding academic resources shouldn’t feel like searching in the dark.
          Notes are scattered across WhatsApp groups, PYQs are buried in
          someone’s drive, and syllabus details often take too long to locate.
        </p>

        <p>
          FYIMP HUB was created to solve that problem — a single place where
          students can quickly access papers, notes, PYQs, syllabus, and
          reference materials without wasting time.
        </p>

        <p>
          It is designed to help students focus on learning instead of
          searching.
        </p>
      </section>


      {/* FEATURES */}
      <section className="about-section">
        <h2>What You Can Do Here</h2>

        <div className="feature-grid">

          <div className="feature-card">
            <h3>Browse Papers</h3>
            <p>Explore subjects by department and semester.</p>
          </div>

          <div className="feature-card">
            <h3>Syllabus Access</h3>
            <p>View detailed syllabus for every paper.</p>
          </div>

          <div className="feature-card">
            <h3>Module Notes</h3>
            <p>Each module can contain up to four curated notes.</p>
          </div>

          <div className="feature-card">
            <h3>Previous Year Questions</h3>
            <p>Prepare better using PYQs.</p>
          </div>

          <div className="feature-card">
            <h3>Reference Materials</h3>
            <p>Books and videos recommended for deeper learning.</p>
          </div>

          <div className="feature-card">
            <h3>Search</h3>
            <p>Instantly search papers like a mini academic search engine.</p>
          </div>

        </div>
      </section>


      {/* DEPARTMENTS */}
      <section className="about-section">
        <h2>Departments Covered</h2>

        <div className="dept-grid">
          <span>Mathematics</span>
          <span>Information Technology</span>
          <span>Statistics</span>
          <span>History</span>
          <span>Physical Education</span>
          <span>Psychology</span>
          <span>Environmental Studies</span>
        </div>

        <p className="semester-info">
          Content is organized across all 10 semesters.
        </p>
      </section>


      {/* STORY */}
      <section className="about-section">
        <h2>Our Story</h2>

        <p>
          FYIMP HUB started as an idea by Shad CT, a FYIMP IT student
          from the 2024 batch.
        </p>

        <p>
          The platform is now being developed by FYIMP IT students
          of the 2025 batch as part of a student initiative under
          Project Nova.
        </p>

        <p>
          The goal is simple: build tools that make academic life
          easier for students.
        </p>
      </section>

    </main>
  );
}