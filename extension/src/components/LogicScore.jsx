import React from "react";

function LogicScore({ analysis }) {
  const score = analysis?.logic_score?.score || 0;
  const scoreStr = `${Math.round(score)}%`;

  return (
    <section className="score-card">
      <div>
        <p className="section-label">Logic Score</p>
        <h2>{scoreStr} Logical</h2>
      </div>

      <div className="score-ring">{Math.round(score)}</div>

      <div className="score-metrics">
        <span>Reasoning</span>
        <span>Evidence</span>
        <span>Assumptions</span>
        <span>Risk</span>
      </div>
    </section>
  );
}

export default LogicScore;