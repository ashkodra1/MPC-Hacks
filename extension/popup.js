document.getElementById("analyzeBtn").addEventListener("click", async () => {
  const status = document.getElementById("status");
  status.textContent = "Analyzing...";

  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  try {
    const res = await fetch("http://localhost:3001/analyze-video", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        url: tab.url
      })
    });

    const data = await res.json();
    console.log("[popup] analyze-video response", data);

    if (!res.ok) {
      throw new Error(data.details || data.error || "Backend error");
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

    await chrome.tabs.sendMessage(tab.id, {
      type: "FALLACIES_READY",
      fallacies,
    });

    status.textContent = `Found ${fallacies.length} fallacies`;
  } catch (err) {
    console.error(err);
    status.textContent = "Error: " + err.message;
  }
});