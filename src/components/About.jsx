import "./About.css";

function About({ setabout }) {
  return (
    <div className="abtcon" onClick={() => setabout(false)}>
      <div className="abt" onClick={(e) => e.stopPropagation()}>
        <h3>About FYIMP HUB</h3>

        <p>
          <strong>FYIMP HUB</strong> is a centralized academic resource platform
          developed by students of the{" "}
          <a
            href="https://www.kannuruniversity.ac.in/en/academics/campus/all-departments/department-of-information-technology/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Department of Information Technology, Kannur University
            (Mangattuparamba Campus)
          </a>.
        </p>

        <p>
          The platform is designed to <strong>FYIMP students</strong> by providing structured access to course-aligned
          academic resources, <strong>including official syllabi, modular notes,
          previous year question papers, and curated reference materials.</strong>
        </p>

        <p>
          The current release focuses on clarity, reliability, and academic
          relevance. FYIMP HUB follows a priority-based content model and a
          scalable architecture, allowing future improvements to be introduced
          progressively while maintaining a focused learning experience.
        </p>

        <p>
          This initiative is collaboratively developed and maintained by{" "}
          <strong>NOVA</strong>, in association with <strong>SHAD CT</strong>, as a
          long-term academic support system for students.
        </p>

        <div className="version-info">
          <p>
            <strong>Version:</strong> 1.0
          </p>
          <p className="version-note">
            Designed for structured academic access · Future updates will be
            introduced based on academic requirements
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;