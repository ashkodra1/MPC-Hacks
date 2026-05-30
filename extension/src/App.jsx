import React, { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import LogicScore from "./components/LogicScore";
import LogicSummary from "./components/LogicSummary";
import FallacyTimeline from "./components/FallacyTimeline";
import WorksDoesnt from "./components/WorksDoesnt";
import HiddenAssumptions from "./components/HiddenAssumptions";
import ImproveReasoning from "./components/ImproveReasoning";

function App() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const analyzeVideo = async () => {
    setLoading(true);
    setStatus("Analyzing...");
    
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
      });

      const res = await fetch("http://localhost:3000/analyze-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          url: tab.url
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.details || data.error || "Backend error");
      }

      setAnalysis(data.analysis);
      setStatus(`Analysis complete!`);

      // Send fallacies to content script
      const rawFallacies = data.analysis?.possible_fallacies || 
                           data.analysis?.fallacies || 
                           data.analysis?.analysis?.fallacies || 
                           [];

      const fallacies = rawFallacies.map((f) => ({
        type: f.type || f.name || "Unknown fallacy",
        quote: f.quote || f.excerpt || "",
        explanation: f.explanation || "",
        confidence: typeof f.confidence === "number" ? f.confidence : 0.8,
        timestamp: f.timestamp || f.start || f.time || null,
      }));

      // Try to send message to content script, but don't fail if it's not there
      try {
        await chrome.tabs.sendMessage(tab.id, {
          type: "FALLACIES_READY",
          fallacies,
        });
        console.log("[App] Sent fallacies to content script");
      } catch (sendErr) {
        console.warn("[App] Could not send to content script (might not be on YouTube):", sendErr.message);
      }
    } catch (err) {
      console.error(err);
      setStatus("Error: " + err.message);
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if data was already set
    if (window.extensionAnalysis) {
      setAnalysis(window.extensionAnalysis);
    }

    // Listen for updates from popup.js
    const handleAnalysisReady = (event) => {
      setAnalysis(event.detail);
    };

    window.addEventListener("analysisReady", handleAnalysisReady);
    return () => {
      window.removeEventListener("analysisReady", handleAnalysisReady);
    };
  }, []);

  if (!analysis) {
    return (
      <div className="extension-panel">
        <Header />
        <div className="card" style={{ padding: "20px", textAlign: "center" }}>
          <button 
            onClick={analyzeVideo}
            disabled={loading}
            style={{
              padding: "12px 24px",
              fontSize: "16px",
              backgroundColor: "#ff8a3d",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Analyzing..." : "Analyze Video"}
          </button>
          {status && <p>{status}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="extension-panel">
      <Header />
      <LogicScore analysis={analysis} />
      <LogicSummary analysis={analysis} />
      <FallacyTimeline analysis={analysis} />
      <WorksDoesnt analysis={analysis} />
      <HiddenAssumptions analysis={analysis} />
      <ImproveReasoning analysis={analysis} />
    </div>
  );
}

export default App;