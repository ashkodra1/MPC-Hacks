document.getElementById("analyzeBtn").addEventListener("click", async () => {
  const status = document.getElementById("status");
  status.textContent = "Analyzing...";

  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  try {
    console.log("[popup] Sending request to backend...");
    const res = await fetch("http://localhost:3000/analyze-video", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        url: tab.url
      })
    });

    console.log("[popup] Response status:", res.status);
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.details || errorData.error || `HTTP ${res.status}`);
    }

    const text = await res.text();
    console.log("[popup] Response length:", text.length);
    console.log("[popup] First 500 chars:", text.substring(0, 500));

    let data;
    try {
      data = JSON.parse(text);
    } catch (parseErr) {
      console.error("[popup] JSON Parse Error:", parseErr);
      throw new Error(`Invalid response format: ${parseErr.message}`);
    }

    console.log("[popup] Parsed data:", data);

    if (!data.analysis) {
      throw new Error("No analysis data in response");
    }

    const rawFallacies =
      data.analysis?.possible_fallacies ||
      data.analysis?.fallacies ||
      data.analysis?.analysis?.fallacies ||
      [];

    const fallacies = rawFallacies.map((f) => ({
      type: f.type || f.name || "Unknown fallacy",
      quote: f.quote || f.excerpt || "",
      explanation: f.explanation || "",
      confidence:
        typeof f.confidence === "number"
          ? f.confidence
          : f.severity === "high"
          ? 0.95
          : f.severity === "medium"
          ? 0.75
          : f.severity === "low"
          ? 0.5
          : 0,
      timestamp: f.timestamp || f.start || f.time || null,
    }));

    console.log("[popup] normalized fallacies", fallacies);

    // Pass analysis data to React app
    window.extensionAnalysis = data.analysis;

    // Trigger React update
    const updateEvent = new CustomEvent("analysisReady", {
      detail: data.analysis,
    });
    window.dispatchEvent(updateEvent);

    await chrome.tabs.sendMessage(tab.id, {
      type: "FALLACIES_READY",
      fallacies,
    });

    status.textContent = `Found ${fallacies.length} fallacies`;
  } catch (err) {
    console.error("[popup] Error:", err);
    status.textContent = "Error: " + err.message;
  }
});