import React from "react";
const timeline = [
    { time: "00:42", fallacy: "False Dilemma", severity: "High" },
    { time: "01:18", fallacy: "Ad Hominem", severity: "Medium" },
    { time: "02:56", fallacy: "Correlation ≠ Cause", severity: "High" },
    { time: "04:12", fallacy: "Hasty Generalization", severity: "Low" },
  ];
  
  function FallacyTimeline() {
    return (
      <section className="card">
        <h3>Timeline</h3>
  
        <div className="timeline-list">
          {timeline.map((item, index) => (
            <div className="timeline-row" key={index}>
              <div>
                <strong>{item.time}</strong>
                <span>{item.fallacy}</span>
              </div>
  
              <span className={`pill ${item.severity.toLowerCase()}`}>
                {item.severity}
              </span>
            </div>
          ))}
        </div>
      </section>
    );
  }
  
  export default FallacyTimeline;