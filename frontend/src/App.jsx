import { useState } from "react";
import {
  ArrowRight,
  Brain,
  Check,
  ChevronDown,
  CircleCheck,
  FileText,
  Flame,
  RotateCcw,
  Sparkles,
  Target,
  Upload,
  Zap,
} from "lucide-react";

const roles = [
  "AI Engineer",
  "Machine Learning Engineer",
  "Data Scientist",
  "Software Engineer",
  "Full Stack Developer",
  "Data Analyst",
];

const assessment = {
  question:
    "What is the primary purpose of feature scaling in a machine learning model?",
  options: [
    "To make all features contribute on a comparable scale",
    "To increase the number of training examples",
    "To automatically remove missing values",
    "To convert a model into a neural network",
  ],
  correct: 0,
  explanation:
    "Feature scaling puts numerical features on comparable ranges so algorithms that depend on distance or magnitude can learn more effectively.",
};

function App() {
  const [role, setRole] = useState("");
  const [showRoles, setShowRoles] = useState(false);
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [recalibrated, setRecalibrated] = useState(false);

  const handleFile = (event) => {
    const selected = event.target.files?.[0];

    if (!selected) return;

    setFile(selected);
    setAnalysis(null);
    setAssessmentResult(null);
    setRecalibrated(false);
    setError("");
  };

  const handleBuildPath = async () => {
    if (!role || !file) {
      setError("Choose a target role and upload your resume first.");
      return;
    }

    setLoading(true);
    setError("");
    setAnalysis(null);
    setAssessmentResult(null);
    setRecalibrated(false);

    try {
      const formData = new FormData();

      formData.append("role", role);
      formData.append("resume", file);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || "Unable to analyze resume.");
      }

      setAnalysis(data);
    } catch (err) {
      setError(
        err.message ||
          "Something went wrong while building your learning path."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAssessment = () => {
    if (selectedAnswer === null) return;

    const correct = selectedAnswer === assessment.correct;

    setAssessmentResult({
      correct,
      explanation: assessment.explanation,
    });

    if (!correct) {
      setRecalibrated(true);
    }
  };

  const resetAssessment = () => {
    setSelectedAnswer(null);
    setAssessmentResult(null);
    setRecalibrated(false);
  };

  const getAdaptivePlan = () => {
    if (!analysis?.seven_day_plan) return [];

    if (!recalibrated) {
      return analysis.seven_day_plan;
    }

    const original = [...analysis.seven_day_plan];

    const reviewDay = {
      day: 2,
      focus: "Foundational Review",
      task: "Review feature scaling, normalization, standardization, and when each technique should be used. Complete three small examples before moving forward.",
      adaptive: true,
    };

    const updated = original.map((item) => {
      if (item.day === 2) {
        return reviewDay;
      }

      if (item.day > 2) {
        return {
          ...item,
          day: item.day,
        };
      }

      return item;
    });

    return updated;
  };

  return (
    <div className="app-shell">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="brand">
          <div className="brand-mark">
            <Sparkles size={17} strokeWidth={2.5} />
          </div>
          <span>EduPath</span>
        </div>

        <div className="nav-right">
          <span className="nav-status">
            <span className="status-dot" />
            Adaptive learning
          </span>
        </div>
      </nav>

      {/* HERO */}
      <main>
        <section className="hero-section">
          <div className="hero-content">
            <div className="eyebrow">
              <span className="eyebrow-line" />
              AI-POWERED CAREER LEARNING
            </div>

            <h1>
              Your learning path
              <br />
              <span>should adapt to you.</span>
            </h1>

            <p className="hero-copy">
              EduPath analyzes where you are, identifies the skills you need,
              and builds a learning path that evolves as you learn.
            </p>

            <div className="hero-points">
              <div>
                <CircleCheck size={16} />
                Resume-aware
              </div>

              <div>
                <CircleCheck size={16} />
                Skill-gap driven
              </div>

              <div>
                <CircleCheck size={16} />
                Adaptive
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="orbit-card">
              <div className="orbit-center">
                <Brain size={30} />
              </div>

              <div className="orbit-node node-one">
                <FileText size={15} />
                Resume
              </div>

              <div className="orbit-node node-two">
                <Target size={15} />
                Skill gaps
              </div>

              <div className="orbit-node node-three">
                <Zap size={15} />
                Adapt
              </div>
            </div>
          </div>
        </section>

        {/* BUILDER */}
        <section className="builder-section">
          <div className="builder-card">
            <div className="builder-header">
              <div>
                <span className="section-label">01 / BUILD YOUR PATH</span>
                <h2>Tell us where you're going.</h2>
                <p>
                  We'll compare your current skills with what your target role
                  actually requires.
                </p>
              </div>

              <div className="builder-icon">
                <Target size={21} />
              </div>
            </div>

            <div className="builder-form">
              {/* ROLE */}
              <div className="field-group">
                <label>Target role</label>

                <div className="role-select-wrapper">
                  <button
                    className={`role-select ${
                      role ? "selected" : ""
                    }`}
                    onClick={() => setShowRoles(!showRoles)}
                  >
                    <span>{role || "Choose a career direction"}</span>
                    <ChevronDown
                      size={18}
                      className={showRoles ? "rotate" : ""}
                    />
                  </button>

                  {showRoles && (
                    <div className="role-menu">
                      {roles.map((item) => (
                        <button
                          key={item}
                          className="role-option"
                          onClick={() => {
                            setRole(item);
                            setShowRoles(false);
                          }}
                        >
                          {item}

                          {role === item && <Check size={16} />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* FILE */}
              <div className="field-group">
                <label>Current resume</label>

                <label className="upload-box">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFile}
                  />

                  <div className="upload-icon">
                    <Upload size={19} />
                  </div>

                  <div className="upload-text">
                    {file ? (
                      <>
                        <strong>{file.name}</strong>
                        <span>Ready to analyze</span>
                      </>
                    ) : (
                      <>
                        <strong>Upload your resume</strong>
                        <span>PDF format</span>
                      </>
                    )}
                  </div>

                  {file && (
                    <div className="upload-check">
                      <Check size={16} />
                    </div>
                  )}
                </label>
              </div>

              <button
                className="build-button"
                onClick={handleBuildPath}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner" />
                    Analyzing your profile...
                  </>
                ) : (
                  <>
                    Build my learning path
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>

            {error && <div className="error-box">{error}</div>}
          </div>
        </section>

        {/* LOADING */}
        {loading && (
          <section className="loading-section">
            <div className="loading-card">
              <div className="loading-orb">
                <Brain size={26} />
              </div>

              <div>
                <span>EDUPATH AI</span>
                <h3>Mapping your current skill profile...</h3>
                <p>
                  Comparing your resume with the requirements for{" "}
                  <strong>{role}</strong>.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* RESULTS */}
        {analysis && !loading && (
          <section className="results-section">
            <div className="results-heading">
              <div>
                <span className="section-label">02 / YOUR ADAPTIVE PATH</span>
                <h2>Your path starts here.</h2>
              </div>

              <div className="role-badge">
                <Target size={15} />
                {role}
              </div>
            </div>

            {/* SUMMARY */}
            <div className="summary-card">
              <div className="summary-icon">
                <Sparkles size={19} />
              </div>

              <div>
                <span>AI PROFILE SUMMARY</span>
                <p>{analysis.summary}</p>
              </div>
            </div>

            {/* GAPS */}
            <div className="result-grid">
              <div className="result-card">
                <div className="card-heading">
                  <div>
                    <span>CRITICAL GAPS</span>
                    <h3>What to work on</h3>
                  </div>

                  <Flame size={19} />
                </div>

                <div className="gap-list">
                  {analysis.critical_gaps?.map((gap, index) => (
                    <div className="gap-item" key={index}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <p>{gap}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="result-card focus-card">
                <div className="card-heading">
                  <div>
                    <span>RECOMMENDED FOCUS</span>
                    <h3>Start here</h3>
                  </div>

                  <Zap size={19} />
                </div>

                <p className="focus-text">
                  {analysis.recommended_focus}
                </p>

                <div className="focus-line">
                  <span />
                </div>
              </div>
            </div>

            {/* SKILL MATRIX */}
            <div className="result-card skill-card">
              <div className="card-heading">
                <div>
                  <span>SKILL GAP ANALYSIS</span>
                  <h3>Current → target</h3>
                </div>
              </div>

              <div className="skill-table">
                <div className="skill-table-head">
                  <span>Skill</span>
                  <span>Current</span>
                  <span>Target</span>
                  <span>Gap</span>
                </div>

                {analysis.skills?.map((skill, index) => (
                  <div className="skill-row" key={index}>
                    <strong>{skill.name}</strong>
                    <span className="level-pill current">
                      {skill.current_level}
                    </span>
                    <span className="level-pill target">
                      {skill.target_level}
                    </span>
                    <p>{skill.gap}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 7 DAY PLAN */}
            <div className="plan-header">
              <div>
                <span className="section-label">03 / LEARNING PLAN</span>
                <h2>
                  {recalibrated
                    ? "Your path has been recalibrated."
                    : "Your first 7 days."}
                </h2>
              </div>

              <div className="plan-meta">
                <span>
                  <Flame size={15} />
                  7 day sprint
                </span>
              </div>
            </div>

            {recalibrated && (
              <div className="adaptive-banner">
                <div className="adaptive-icon">
                  <RotateCcw size={18} />
                </div>

                <div>
                  <strong>PATH RECALIBRATED</strong>
                  <p>
                    You struggled with the assessment, so EduPath inserted a
                    foundational review before moving you forward.
                  </p>
                </div>
              </div>
            )}

            <div className="plan-list">
              {getAdaptivePlan().map((item, index) => (
                <div
                  className={`plan-item ${
                    item.adaptive ? "adaptive-plan-item" : ""
                  }`}
                  key={`${item.day}-${index}`}
                >
                  <div className="day-number">
                    {String(item.day).padStart(2, "0")}
                  </div>

                  <div className="plan-content">
                    <div className="plan-top">
                      <span>
                        DAY {item.day}
                        {item.adaptive && " • ADAPTIVE"}
                      </span>

                      {index === 0 && !recalibrated && (
                        <span className="today-badge">START HERE</span>
                      )}
                    </div>

                    <h3>{item.focus}</h3>
                    <p>{item.task}</p>
                  </div>

                  <ArrowRight size={18} />
                </div>
              ))}
            </div>

            {/* ASSESSMENT */}
            <div className="assessment-section">
              <div className="assessment-heading">
                <div>
                  <span className="section-label">
                    04 / ADAPTIVE CHECKPOINT
                  </span>
                  <h2>Let's see what you know.</h2>
                  <p>
                    EduPath uses your performance to decide what you should
                    learn next.
                  </p>
                </div>

                <div className="assessment-score">
                  <Brain size={19} />
                  <span>LIVE ASSESSMENT</span>
                </div>
              </div>

              <div className="assessment-card">
                <div className="question-number">QUESTION 01</div>

                <h3>{assessment.question}</h3>

                <div className="options">
                  {assessment.options.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const isCorrect =
                      assessmentResult &&
                      index === assessment.correct;

                    const isWrong =
                      assessmentResult &&
                      isSelected &&
                      index !== assessment.correct;

                    return (
                      <button
                        key={index}
                        className={`assessment-option ${
                          isSelected ? "selected" : ""
                        } ${isCorrect ? "correct" : ""} ${
                          isWrong ? "wrong" : ""
                        }`}
                        onClick={() => {
                          if (!assessmentResult) {
                            setSelectedAnswer(index);
                          }
                        }}
                      >
                        <span className="option-letter">
                          {String.fromCharCode(65 + index)}
                        </span>

                        <span>{option}</span>

                        {isCorrect && <Check size={17} />}
                      </button>
                    );
                  })}
                </div>

                {!assessmentResult ? (
                  <button
                    className="assessment-button"
                    disabled={selectedAnswer === null}
                    onClick={handleAssessment}
                  >
                    Check my answer
                    <ArrowRight size={17} />
                  </button>
                ) : (
                  <div
                    className={`assessment-feedback ${
                      assessmentResult.correct ? "success" : "adapt"
                    }`}
                  >
                    <div className="feedback-icon">
                      {assessmentResult.correct ? (
                        <Check size={19} />
                      ) : (
                        <RotateCcw size={19} />
                      )}
                    </div>

                    <div>
                      <strong>
                        {assessmentResult.correct
                          ? "Strong understanding."
                          : "We found a learning gap."}
                      </strong>

                      <p>{assessmentResult.explanation}</p>

                      {!assessmentResult.correct && (
                        <button
                          className="recalibrate-button"
                          onClick={() => {
                            setRecalibrated(true);

                            setTimeout(() => {
                              document
                                .querySelector(".plan-header")
                                ?.scrollIntoView({
                                  behavior: "smooth",
                                  block: "start",
                                });
                            }, 100);
                          }}
                        >
                          Recalibrate my path
                          <RotateCcw size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ADAPTIVE FOOTER */}
            <div className="adaptive-footer">
              <div className="adaptive-footer-icon">
                <Sparkles size={21} />
              </div>

              <div>
                <span>THE EDUPATH LOOP</span>
                <h3>Learn → assess → adapt → repeat.</h3>
              </div>

              <div className="loop-steps">
                <span>Learn</span>
                <ArrowRight size={14} />
                <span>Assess</span>
                <ArrowRight size={14} />
                <span className="active">Adapt</span>
              </div>
            </div>
          </section>
        )}

        {/* HOW IT WORKS */}
        <section className="process-section">
          <div className="process-heading">
            <span className="section-label">HOW EDUPATH WORKS</span>
            <h2>Not another static roadmap.</h2>
          </div>

          <div className="process-grid">
            <div className="process-card">
              <span>01</span>
              <FileText size={22} />
              <h3>Understand</h3>
              <p>
                Your resume gives EduPath a picture of what you already know.
              </p>
            </div>

            <div className="process-card">
              <span>02</span>
              <Target size={22} />
              <h3>Identify</h3>
              <p>
                AI compares your skills with the requirements of your target
                role.
              </p>
            </div>

            <div className="process-card">
              <span>03</span>
              <Brain size={22} />
              <h3>Adapt</h3>
              <p>
                Your learning path changes when your performance reveals a
                weakness.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="brand">
          <div className="brand-mark">
            <Sparkles size={15} />
          </div>
          <span>EduPath</span>
        </div>

        <span>Adaptive AI learning for the next generation of builders.</span>
      </footer>
    </div>
  );
}

export default App;