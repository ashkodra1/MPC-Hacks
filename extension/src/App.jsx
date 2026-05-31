import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import Header from "./components/Header";
import LogicScore from "./components/LogicScore";
import LogicSummary from "./components/LogicSummary";
import FallacyTimeline from "./components/FallacyTimeline";
import WidgetWrapper from "./components/WidgetWrapper";

function App() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [order, setOrder] = useState(() => null);
  const [visibility, setVisibility] = useState(() => null);
  const [showSettings, setShowSettings] = useState(false);
  const dragRef = useRef(null);

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

  const widgetsMeta = [
    { id: "logicScore", label: "Logic Score", Comp: LogicScore },
    { id: "logicSummary", label: "Logic Summary", Comp: LogicSummary },
    { id: "fallacyTimeline", label: "Fallacy Timeline", Comp: FallacyTimeline }
  ];

  useEffect(() => {
    // initialize order and visibility from localStorage
    const storedOrder = localStorage.getItem("widgetOrder");
    const storedVis = localStorage.getItem("widgetVisibility");
    if (storedOrder) {
      try {
        setOrder(JSON.parse(storedOrder));
      } catch {
        setOrder(widgetsMeta.map((w) => w.id));
      }
    } else {
      setOrder(widgetsMeta.map((w) => w.id));
    }

    if (storedVis) {
      try {
        setVisibility(JSON.parse(storedVis));
      } catch {
        const map = {};
        widgetsMeta.forEach((w) => (map[w.id] = true));
        setVisibility(map);
      }
    } else {
      const map = {};
      widgetsMeta.forEach((w) => (map[w.id] = true));
      setVisibility(map);
    }
  }, []);

  const saveOrder = (newOrder) => {
    setOrder(newOrder);
    localStorage.setItem("widgetOrder", JSON.stringify(newOrder));
  };

  const saveVisibility = (newVis) => {
    setVisibility(newVis);
    localStorage.setItem("widgetVisibility", JSON.stringify(newVis));
  };

  const handleDragStart = (e, id) => {
    dragRef.current = id;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
    e.currentTarget.classList.add("dragging");
  };

  const handleDragOver = (e, id) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    const draggedId = dragRef.current || e.dataTransfer.getData("text/plain");
    if (!draggedId || draggedId === targetId) return;

    const newOrder = order.slice();
    const from = newOrder.indexOf(draggedId);
    const to = newOrder.indexOf(targetId);
    if (from === -1 || to === -1) return;
    newOrder.splice(from, 1);
    newOrder.splice(to, 0, draggedId);
    saveOrder(newOrder);

    const el = document.querySelector('.dragging');
    if (el) el.classList.remove('dragging');
    dragRef.current = null;
  };

  const handleDragEnd = (e) => {
    const el = document.querySelector('.dragging');
    if (el) el.classList.remove('dragging');
    dragRef.current = null;
  };

  const toggleVisibility = (id) => {
    const newVis = { ...(visibility || {}) };
    newVis[id] = !newVis[id];
    saveVisibility(newVis);
  };

  const resetLayout = () => {
    const defaultOrder = widgetsMeta.map((w) => w.id);
    const defaultVis = {};
    widgetsMeta.forEach((w) => (defaultVis[w.id] = true));
    saveOrder(defaultOrder);
    saveVisibility(defaultVis);
  };

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
  const renderById = (id) => {
    const meta = widgetsMeta.find((w) => w.id === id);
    if (!meta) return null;
    const Comp = meta.Comp;
    return <Comp analysis={analysis} />;
  };

  return (
    <div className="extension-panel">
      <Header onOpenSettings={() => setShowSettings((s) => !s)} />

      {showSettings && (
        <div className="card settings-panel">
          <h3 style={{marginTop:0}}>Widgets</h3>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {widgetsMeta.map((w) => (
              <label key={w.id} style={{display:'flex',alignItems:'center',gap:8}}>
                <input
                  type="checkbox"
                  checked={visibility?.[w.id] ?? true}
                  onChange={() => toggleVisibility(w.id)}
                />
                <span>{w.label}</span>
              </label>
            ))}
            <div style={{display:'flex',gap:8,marginTop:8}}>
              <button className="primary-button" onClick={resetLayout}>Reset layout</button>
              <button className="primary-button" onClick={() => setShowSettings(false)} style={{background:'#ccc',color:'#111'}}>Close</button>
            </div>
          </div>
        </div>
      )}

      {order?.map((id) => {
        const meta = widgetsMeta.find((w) => w.id === id);
        if (!meta) return null;
        if (!visibility?.[id]) return null;
        return (
          <WidgetWrapper
            key={id}
            id={id}
            title={meta.label}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
            onToggleVisibility={toggleVisibility}
            visible={visibility?.[id]}
          >
            {renderById(id)}
          </WidgetWrapper>
        );
      })}
    </div>
  );
}

export default App;