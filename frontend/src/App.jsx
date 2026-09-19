import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  Check,
  ChevronDown,
  FileText,
  Sparkles,
  Target,
  Upload,
} from "lucide-react";

function App() {
  const [role, setRole] = useState("");
  const [showRoles, setShowRoles] = useState(false);
  const [file, setFile] = useState(null);

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const roles = [
    "AI Engineer",
    "Machine Learning Engineer",
    "Data Scientist",
    "Software Engineer",
    "Full Stack Developer",
    "Data Analyst",
  ];

  const handleFile = (event) => {
    const selected = event.target.files?.[0];

    if (selected) {
      setFile(selected);
      setAnalysis(null);
      setError("");
    }
  };

  const handleBuildPath = async () => {
    if (!role || !file) return;

    setLoading(true);
    setError("");
    setAnalysis(null);

    try {
      const formData = new FormData();

      formData.append("role", role);
      formData.append("resume", file);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            data.error ||
            "EduPath could not analyze your resume."
        );
      }

      console.log("EduPath AI result:", data);

      setAnalysis(data);
    } catch (err) {
      console.error("EduPath error:", err);

      setError(
        err.message ||
          "Something went wrong while building your learning path."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">

      {/* =========================
          NAVBAR
      ========================= */}

      <header className="navbar">
        <div className="brand">
          <div className="brand-mark">
            <Sparkles size={16} />
          </div>

          <span>EduPath</span>
        </div>

        <nav className="nav-links">
          <a href="#how-it-works">How it works</a>
          <a href="#adaptive">Adaptive learning</a>
          <a href="#about">About</a>
        </nav>

        <div className="nav-status">
          <span className="status-dot"></span>
          AI learning engine online
        </div>
      </header>

      {/* =========================
          HERO
      ========================= */}

      <main>

        <section className="hero">

          <div className="hero-copy">

            <div className="eyebrow">
              <Sparkles size={13} />
              ADAPTIVE CAREER LEARNING
            </div>

            <h1>
              Stop following
              <br />
              <em>generic roadmaps.</em>
            </h1>

            <p className="hero-description">
              EduPath reads where you are today, understands where you
              want to go, and builds a learning path that changes as
              you improve.
            </p>

            <div className="hero-proof">
              <div className="proof-item">
                <strong>01</strong>
                <span>Analyze your skills</span>
              </div>

              <div className="proof-line"></div>

              <div className="proof-item">
                <strong>02</strong>
                <span>Find your gaps</span>
              </div>

              <div className="proof-line"></div>

              <div className="proof-item">
                <strong>03</strong>
                <span>Adapt as you learn</span>
              </div>
            </div>

          </div>

          {/* =========================
              BUILDER CARD
          ========================= */}

          <div className="builder-card">

            <div className="builder-top">

              <div>
                <span className="builder-label">
                  BUILD YOUR PATH
                </span>

                <h2>
                  Tell us where
                  <br />
                  you're headed.
                </h2>
              </div>

              <div className="builder-number">
                01
              </div>

            </div>

            {/* TARGET ROLE */}

            <div className="field-group">

              <label>Target role</label>

              <div className="role-selector">

                <button
                  type="button"
                  className="role-button"
                  onClick={() => setShowRoles(!showRoles)}
                >
                  <div className="role-button-content">

                    <Target size={18} />

                    <span>
                      {role || "Choose your target role"}
                    </span>

                  </div>

                  <ChevronDown
                    size={18}
                    className={showRoles ? "rotate-icon" : ""}
                  />
                </button>

                {showRoles && (
                  <div className="role-menu">

                    {roles.map((item) => (
                      <button
                        type="button"
                        key={item}
                        onClick={() => {
                          setRole(item);
                          setShowRoles(false);
                        }}
                      >
                        {item}

                        {role === item && (
                          <Check size={15} />
                        )}
                      </button>
                    ))}

                  </div>
                )}

              </div>

            </div>

            {/* RESUME */}

            <div className="field-group">

              <label>Your current experience</label>

              <label className="upload-zone">

                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFile}
                  hidden
                />

                <div className="upload-icon">
                  {file ? (
                    <Check size={20} />
                  ) : (
                    <Upload size={20} />
                  )}
                </div>

                <div className="upload-copy">

                  {file ? (
                    <>
                      <strong>{file.name}</strong>
                      <span>Ready to analyze</span>
                    </>
                  ) : (
                    <>
                      <strong>
                        Upload your resume
                      </strong>

                      <span>
                        PDF only · We'll extract your skills
                      </span>
                    </>
                  )}

                </div>

                <ArrowUpRight size={18} />

              </label>

            </div>

            {/* BUILD BUTTON */}

            <button
              type="button"
              className="continue-button"
              disabled={!role || !file || loading}
              onClick={handleBuildPath}
            >

              {loading ? (
                <>
                  <span className="button-spinner"></span>
                  Building your path...
                </>
              ) : (
                <>
                  Build my learning path
                  <ArrowRight size={18} />
                </>
              )}

            </button>

            <p className="privacy-note">
              Your resume is analyzed only to create your personalized
              learning path.
            </p>

          </div>

        </section>

        {/* =========================
            LOADING
        ========================= */}

        {loading && (
          <section className="analysis-loading">

            <div className="loading-orb">
              <Sparkles size={21} />
            </div>

            <div>
              <p className="loading-title">
                Building your learning path
              </p>

              <p className="loading-text">
                EduPath is analyzing your resume against the{" "}
                <strong>{role}</strong> role...
              </p>
            </div>

          </section>
        )}

        {/* =========================
            ERROR
        ========================= */}

        {error && (
          <section className="analysis-error">

            <div className="error-icon">
              !
            </div>

            <div>
              <strong>
                We couldn't build your path.
              </strong>

              <p>{error}</p>
            </div>

          </section>
        )}

        {/* =========================
            AI RESULTS
        ========================= */}

        {analysis && (
          <section className="results-section">

            {/* RESULTS HEADER */}

            <div className="results-header">

              <div>

                <span className="eyebrow">
                  YOUR ADAPTIVE PATH
                </span>

                <h2>
                  Here's where
                  <br />
                  you stand.
                </h2>

                <p>
                  {analysis.summary}
                </p>

              </div>

              <div className="role-badge">
                <Target size={16} />
                {role}
              </div>

            </div>

            {/* TOP CARDS */}

            <div className="results-grid">

              {/* CRITICAL GAPS */}

              <div className="result-card">

                <div className="card-heading">

                  <div className="card-icon">
                    <Target size={18} />
                  </div>

                  <div>
                    <h3>
                      Critical skill gaps
                    </h3>

                    <p>
                      What needs attention first
                    </p>
                  </div>

                </div>

                <div className="gap-list">

                  {analysis.critical_gaps?.map(
                    (gap, index) => (
                      <div
                        className="gap-item"
                        key={index}
                      >

                        <span>
                          {String(index + 1).padStart(
                            2,
                            "0"
                          )}
                        </span>

                        <p>{gap}</p>

                      </div>
                    )
                  )}

                </div>

              </div>

              {/* RECOMMENDED FOCUS */}

              <div className="result-card focus-card">

                <div className="card-heading">

                  <div className="card-icon">
                    <BrainCircuit size={18} />
                  </div>

                  <div>
                    <h3>
                      Recommended focus
                    </h3>

                    <p>
                      Your highest-impact next step
                    </p>
                  </div>

                </div>

                <div className="focus-content">

                  <Sparkles size={22} />

                  <strong>
                    {analysis.recommended_focus}
                  </strong>

                </div>

              </div>

            </div>

            {/* SKILLS */}

            <div className="result-card skills-card">

              <div className="card-heading">

                <div className="card-icon">
                  <ArrowUpRight size={18} />
                </div>

                <div>
                  <h3>
                    Skill gap analysis
                  </h3>

                  <p>
                    Current capability vs target role
                  </p>
                </div>

              </div>

              <div className="skills-table">

                {analysis.skills?.map(
                  (skill, index) => (
                    <div
                      className="skill-row"
                      key={index}
                    >

                      <div className="skill-name">

                        <strong>
                          {skill.name}
                        </strong>

                        <span>
                          {skill.gap}
                        </span>

                      </div>

                      <div className="skill-level">

                        <span>
                          {skill.current_level}
                        </span>

                        <ArrowRight size={15} />

                        <strong>
                          {skill.target_level}
                        </strong>

                      </div>

                    </div>
                  )
                )}

              </div>

            </div>

            {/* 7 DAY PLAN */}

            <div className="result-card plan-card">

              <div className="card-heading">

                <div className="card-icon">
                  <Check size={18} />
                </div>

                <div>
                  <h3>
                    Your 7-day adaptive plan
                  </h3>

                  <p>
                    Built around your highest-impact gaps
                  </p>
                </div>

              </div>

              <div className="plan-list">

                {analysis.seven_day_plan?.map(
                  (day) => (
                    <div
                      className="day-row"
                      key={day.day}
                    >

                      <div className="day-number">
                        {String(day.day).padStart(
                          2,
                          "0"
                        )}
                      </div>

                      <div className="day-content">

                        <span>
                          DAY {day.day}
                        </span>

                        <h4>
                          {day.focus}
                        </h4>

                        <p>
                          {day.task}
                        </p>

                      </div>

                      <Check size={18} />

                    </div>
                  )
                )}

              </div>

            </div>

            {/* NEXT STEP */}

            <div className="adaptive-banner">

              <div className="adaptive-banner-icon">
                <BrainCircuit size={23} />
              </div>

              <div>

                <span>
                  THE PATH ISN'T STATIC
                </span>

                <h3>
                  Complete a task. EduPath
                  recalibrates what you learn next.
                </h3>

              </div>

              <ArrowUpRight size={22} />

            </div>

          </section>
        )}

        {/* =========================
            HOW IT WORKS
        ========================= */}

        {!analysis && (
          <section
            className="how-section"
            id="how-it-works"
          >

            <div className="section-heading">

              <span className="eyebrow">
                HOW IT WORKS
              </span>

              <h2>
                From resume
                <br />
                to real progress.
              </h2>

            </div>

            <div className="process-grid">

              <div className="process-card">

                <span>01</span>

                <FileText size={24} />

                <h3>
                  Understand
                </h3>

                <p>
                  EduPath extracts your existing
                  skills and experience from your
                  resume.
                </p>

              </div>

              <div className="process-card">

                <span>02</span>

                <Target size={24} />

                <h3>
                  Identify
                </h3>

                <p>
                  Your current capabilities are
                  compared with the requirements
                  of your target role.
                </p>

              </div>

              <div className="process-card">

                <span>03</span>

                <BrainCircuit size={24} />

                <h3>
                  Adapt
                </h3>

                <p>
                  Your learning path changes based
                  on what you actually understand,
                  not what a generic roadmap assumes.
                </p>

              </div>

            </div>

          </section>
        )}

      </main>

      {/* =========================
          FOOTER
      ========================= */}

      <footer id="about">

        <div className="footer-brand">

          <div className="brand">
            <div className="brand-mark">
              <Sparkles size={15} />
            </div>

            <span>EduPath</span>
          </div>

          <p>
            Learning paths that evolve with you.
          </p>

        </div>

        <div className="footer-meta">
          Adaptive AI · Built for learners
        </div>

      </footer>

    </div>
  );
}

export default App;