import React from "react";

function secToTime(seconds) {
  if (!seconds && seconds !== 0) return "--:--";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function FallacyTimeline({ analysis }) {
  const fallacies = analysis?.possible_fallacies || [];

  if (fallacies.length === 0) {
    return (
      <section className="card">
        <h3>Timeline</h3>
        <p>No fallacies detected</p>
      </section>
    );
  }

  return (
    <section className="card">
      <h3>Timeline</h3>

      <div className="timeline-list">
        {fallacies.map((item, index) => {
          const severity =
            item.severity?.charAt(0).toUpperCase() +
              item.severity?.slice(1).toLowerCase() || "Low";
          const timeStr = item.timestamp || "--:--";

          return (
            <div className="timeline-row" key={index}>
              <div>
                <strong>{timeStr}</strong>
                <span>{item.name || "Unknown fallacy"}</span>
              </div>

              <span className={`pill ${severity.toLowerCase()}`}>
                {severity}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default FallacyTimeline;