
import { useState } from "react";
import {
  Activity,
  Brain,
  ShieldCheck,
  AlertCircle,
  RotateCcw
} from "lucide-react";

import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

const initialForm = {
  RIDAGEYR: 45,
  BMXBMI: 27.5,
  BMXWAIST: 95,
  SLD012: 7,
  SLD013: 1,
  PAD615: 30,
  PAD630: 20,
  RIAGENDR: 1,
  RIDRETH1: 3,
  DMDEDUC2: 4,
  INDHHIN2: 10,
  DMDMARTL: 1,
  SLQ050: 2,
  SMQ020: 2,
  SMQ040: 3,
  PAQ605: 2,
  PAQ620: 2,
  HUQ010: 2,
  HUQ030: 1
};

function App() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateField = (name, value) => {
    setForm((previous) => ({
      ...previous,
      [name]: Number(value)
    }));
  };

  const assessRisk = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/assessment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Assessment failed.");
      }

      setResult(data);
    } catch (err) {
      console.error("Assessment error:", err);

      setError(
        "Unable to connect to the Flask assessment service. " +
        "Make sure the Flask backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm(initialForm);
    setResult(null);
    setError("");
  };

  const numericalFields = [
    ["RIDAGEYR", "Age (years)", 0, 120],
    ["BMXBMI", "Body Mass Index", 10, 70],
    ["BMXWAIST", "Waist Circumference", 30, 200],
    ["SLD012", "Weekday Sleep Duration (hours)", 0, 24],
    ["SLD013", "Weekend Sleep Duration (hours)", 0, 24],
    ["PAD615", "Physical Activity Measure 1", 0, 300],
    ["PAD630", "Physical Activity Measure 2", 0, 300]
  ];

  const categoricalFields = [
    ["RIAGENDR", "Sex"],
    ["RIDRETH1", "Race/Ethnicity"],
    ["DMDEDUC2", "Education"],
    ["INDHHIN2", "Household Income"],
    ["DMDMARTL", "Marital Status"],
    ["SLQ050", "Sleep Problem Indicator"],
    ["SMQ020", "Smoking History"],
    ["SMQ040", "Current Smoking Status"],
    ["PAQ605", "Physical Activity Indicator 1"],
    ["PAQ620", "Physical Activity Indicator 2"],
    ["HUQ010", "General Health"],
    ["HUQ030", "Healthcare Access/Utilisation"]
  ];

  return (
    <div className="app">

      <header className="header">
        <div className="brand">

          <div className="brandIcon">
            <Brain size={30} />
          </div>

          <div>
            <h1>Mental Health Risk Assessment</h1>
            <p>
              XAI-Enhanced Clinical Decision-Support Prototype
            </p>
          </div>

        </div>

        <div className="prototypeBadge">
          <ShieldCheck size={18} />
          Research Prototype
        </div>
      </header>


      <main className="container">

        <section className="introCard">
          <div>
            <h2>
              Depressive-Symptom Risk Assessment
            </h2>

            <p>
              Enter the available assessment information below and
              run the machine-learning model. The system estimates
              the probability of elevated depressive-symptom risk
              and provides model-based explanations.
            </p>
          </div>

          <Activity size={48} />
        </section>


        <div className="grid">

          <section className="card">

            <div className="cardHeader">
              <h2>Assessment Information</h2>

              <button
                type="button"
                className="resetButton"
                onClick={resetForm}
              >
                <RotateCcw size={16} />
                Reset
              </button>
            </div>


            <h3>Demographic Information</h3>

            <div className="formGrid">

              {numericalFields
                .slice(0, 1)
                .map(([name, label, min, max]) => (
                  <div className="field" key={name}>

                    <label htmlFor={name}>
                      {label}
                    </label>

                    <input
                      id={name}
                      type="number"
                      min={min}
                      max={max}
                      step="1"
                      value={form[name]}
                      onChange={(e) =>
                        updateField(name, e.target.value)
                      }
                    />

                    <small>
                      NHANES variable: {name}
                    </small>

                  </div>
                ))}


              {categoricalFields
                .slice(0, 5)
                .map(([name, label]) => (
                  <div className="field" key={name}>

                    <label htmlFor={name}>
                      {label}
                    </label>

                    <input
                      id={name}
                      type="number"
                      value={form[name]}
                      onChange={(e) =>
                        updateField(name, e.target.value)
                      }
                    />

                    <small>
                      NHANES code: {name}
                    </small>

                  </div>
                ))}

            </div>


            <h3>Body Measurements</h3>

            <div className="formGrid">

              {numericalFields
                .slice(1, 3)
                .map(([name, label, min, max]) => (
                  <div className="field" key={name}>

                    <label htmlFor={name}>
                      {label}
                    </label>

                    <input
                      id={name}
                      type="number"
                      min={min}
                      max={max}
                      step="0.1"
                      value={form[name]}
                      onChange={(e) =>
                        updateField(name, e.target.value)
                      }
                    />

                    <small>
                      NHANES variable: {name}
                    </small>

                  </div>
                ))}

            </div>


            <h3>Sleep</h3>

            <div className="formGrid">

              {numericalFields
                .slice(3, 5)
                .map(([name, label, min, max]) => (
                  <div className="field" key={name}>

                    <label htmlFor={name}>
                      {label}
                    </label>

                    <input
                      id={name}
                      type="number"
                      min={min}
                      max={max}
                      step="0.1"
                      value={form[name]}
                      onChange={(e) =>
                        updateField(name, e.target.value)
                      }
                    />

                    <small>
                      NHANES variable: {name}
                    </small>

                  </div>
                ))}


              {categoricalFields
                .slice(5, 6)
                .map(([name, label]) => (
                  <div className="field" key={name}>

                    <label htmlFor={name}>
                      {label}
                    </label>

                    <input
                      id={name}
                      type="number"
                      value={form[name]}
                      onChange={(e) =>
                        updateField(name, e.target.value)
                      }
                    />

                    <small>
                      NHANES code: {name}
                    </small>

                  </div>
                ))}

            </div>


            <h3>Physical Activity</h3>

            <div className="formGrid">

              {numericalFields
                .slice(5)
                .map(([name, label, min, max]) => (
                  <div className="field" key={name}>

                    <label htmlFor={name}>
                      {label}
                    </label>

                    <input
                      id={name}
                      type="number"
                      min={min}
                      max={max}
                      step="0.1"
                      value={form[name]}
                      onChange={(e) =>
                        updateField(name, e.target.value)
                      }
                    />

                    <small>
                      NHANES variable: {name}
                    </small>

                  </div>
                ))}


              {categoricalFields
                .slice(8, 10)
                .map(([name, label]) => (
                  <div className="field" key={name}>

                    <label htmlFor={name}>
                      {label}
                    </label>

                    <input
                      id={name}
                      type="number"
                      value={form[name]}
                      onChange={(e) =>
                        updateField(name, e.target.value)
                      }
                    />

                    <small>
                      NHANES code: {name}
                    </small>

                  </div>
                ))}

            </div>


            <h3>Smoking</h3>

            <div className="formGrid">

              {categoricalFields
                .slice(6, 8)
                .map(([name, label]) => (
                  <div className="field" key={name}>

                    <label htmlFor={name}>
                      {label}
                    </label>

                    <input
                      id={name}
                      type="number"
                      value={form[name]}
                      onChange={(e) =>
                        updateField(name, e.target.value)
                      }
                    />

                    <small>
                      NHANES code: {name}
                    </small>

                  </div>
                ))}

            </div>


            <h3>Healthcare Utilisation</h3>

            <div className="formGrid">

              {categoricalFields
                .slice(10)
                .map(([name, label]) => (
                  <div className="field" key={name}>

                    <label htmlFor={name}>
                      {label}
                    </label>

                    <input
                      id={name}
                      type="number"
                      value={form[name]}
                      onChange={(e) =>
                        updateField(name, e.target.value)
                      }
                    />

                    <small>
                      NHANES code: {name}
                    </small>

                  </div>
                ))}

            </div>


            <button
              type="button"
              className="assessmentButton"
              onClick={assessRisk}
              disabled={loading}
            >
              {loading
                ? "Running Assessment..."
                : "Run Risk Assessment"}
            </button>


            {error && (
              <div className="errorBox">

                <AlertCircle size={20} />

                <span>{error}</span>

              </div>
            )}

          </section>


          <section className="resultsColumn">

            {!result && !loading && (
              <div className="card waitingCard">

                <Brain size={52} />

                <h2>Assessment Results</h2>

                <p>
                  Results will appear here after the
                  assessment is completed.
                </p>

              </div>
            )}


            {loading && (
              <div className="card waitingCard">

                <Activity size={52} />

                <h2>Processing Assessment</h2>

                <p>
                  The Flask backend is preprocessing the
                  information and running the saved
                  machine-learning model.
                </p>

              </div>
            )}


            {result && (
              <>

                <div className="card resultCard">

                  <h2>Prediction Result</h2>

                  <div className="riskNumber">
                    {result.assessment.percentage}%
                  </div>

                  <div className="classification">
                    {result.assessment.classification}
                  </div>

                  <div className="threshold">
                    Decision threshold:{" "}
                    {(result.assessment.threshold * 100).toFixed(2)}%
                  </div>

                  <div className="modelInfo">
                    <strong>Prediction model:</strong>{" "}
                    {result.assessment.model}
                  </div>

                </div>


                <div className="card">

                  <h2>
                    Explainable Artificial Intelligence
                  </h2>

                  <p className="explanationIntro">
                    The following are the model factors
                    with the largest absolute SHAP
                    contributions for this assessment.
                  </p>


                  <div className="explanationList">

                    {result.explanation.top_features.map(
                      (item, index) => (
                        <div
                          className="explanationItem"
                          key={`${item.feature}-${index}`}
                        >

                          <div className="featureName">
                            {index + 1}. {item.feature}
                          </div>

                          <div
                            className={
                              item.contribution >= 0
                                ? "contribution positive"
                                : "contribution negative"
                            }
                          >
                            {item.contribution > 0 ? "+" : ""}
                            {item.contribution}
                          </div>

                          <div className="direction">
                            {item.direction}
                          </div>

                        </div>
                      )
                    )}

                  </div>


                  <div className="xaiFooter">

                    <strong>
                      Explanation model:
                    </strong>{" "}
                    {result.explanation.model}

                    <br />

                    <strong>
                      Method:
                    </strong>{" "}
                    {result.explanation.method}

                  </div>

                </div>


                <div className="card safetyCard">

                  <ShieldCheck size={28} />

                  <div>

                    <h3>
                      Human Oversight Required
                    </h3>

                    <p>
                      This system is a research prototype
                      for clinical decision support. It does
                      not diagnose depression and must not
                      replace professional clinical judgement.
                    </p>

                  </div>

                </div>


                <div className="card disclaimerCard">

                  <h3>
                    Research Use Only
                  </h3>

                  <p>
                    The prediction represents a machine-learning
                    estimate of elevated depressive-symptom risk
                    based on the variables supplied to the model.
                    It is not a clinical diagnosis.
                  </p>

                  <p>
                    Model explanations describe factors influencing
                    the model prediction and should not be interpreted
                    as evidence of causation.
                  </p>

                  <p>
                    External validation using appropriate NHS
                    primary-care data is required before any
                    clinical deployment.
                  </p>

                </div>

              </>
            )}

          </section>

        </div>

      </main>


      <footer>
        Mental Health XAI Risk Assessment Prototype
        · Research Use Only
      </footer>

    </div>
  );
}

export default App;
