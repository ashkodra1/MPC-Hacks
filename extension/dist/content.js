let fallacies = [];
let shownFallacies = new Set();

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "FALLACIES_READY") {
    console.log("[content] FALLACIES_READY message:", message);

    fallacies = message.fallacies.map((f, index) => ({
      ...f,
      id: index,
      seconds: timestampToSeconds(f.timestamp),
    }));

    shownFallacies.clear();

    console.log("[content] parsed fallacies:", fallacies);
    startWatchingVideo();
  }
});

function timestampToSeconds(timestamp) {
  if (!timestamp) return null;

  if (typeof timestamp === "number") {
    return Number.isFinite(timestamp) ? timestamp : null;
  }

  const cleaned = String(timestamp).replace(/[[\]]/g, "").trim();
  const timestampMatch = cleaned.match(/\b(\d{1,2}:\d{2}(?::\d{2})?)\b/);
  const value = timestampMatch ? timestampMatch[1] : cleaned;
  const numericValue = Number(value);

  if (Number.isFinite(numericValue)) {
    return numericValue;
  }

  const parts = value.split(":").map(Number);
  if (!parts.every(Number.isFinite)) return null;

  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }

  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }

  return null;
}

function startWatchingVideo() {
  const video = document.querySelector("video");

  if (!video) {
    console.error("No video found");
    return;
  }

  setInterval(() => {
    const currentTime = video.currentTime;

    fallacies.forEach((fallacy) => {
      if (fallacy.seconds === null) {
        console.warn("[content] fallacy missing timestamp, skipping:", fallacy);
        return;
      }
      if (shownFallacies.has(fallacy.id)) return;

      const difference = Math.abs(currentTime - fallacy.seconds);

      if (difference < 1) {
        shownFallacies.add(fallacy.id);
        video.pause();
        showFallacyPopup(fallacy);
      }
    });
  }, 500);
}

function showFallacyPopup(fallacy) {
  const oldPopup = document.getElementById("fallacy-popup");
  if (oldPopup) oldPopup.remove();

  const popup = document.createElement("div");
  popup.id = "fallacy-popup";

  popup.style.position = "fixed";
  popup.style.top = "80px";
  popup.style.right = "20px";
  popup.style.zIndex = "999999";
  popup.style.background = "white";
  popup.style.color = "black";
  popup.style.padding = "16px";
  popup.style.width = "320px";
  popup.style.border = "2px solid black";
  popup.style.borderRadius = "8px";
  popup.style.fontFamily = "Arial";

  popup.innerHTML = `
    <h3>⚠️ ${fallacy.type}</h3>
    <p><strong>Quote:</strong> ${fallacy.quote}</p>
    <p>${fallacy.explanation}</p>
    <p><strong>Confidence:</strong> ${Math.round((fallacy.confidence || 0) * 100)}%</p>
    <button id="continue-video">Continue</button>
  `;

  document.body.appendChild(popup);

  document.getElementById("continue-video").addEventListener("click", () => {
    popup.remove();

    const video = document.querySelector("video");
    if (video) video.play();
  });
}
