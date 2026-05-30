import React from "react";

function LogicScore() {
    return (
      <section className="score-card">
        <div>
          <p className="section-label">Logic Score</p>
          <h2>78% Logical</h2>
        </div>
  
        <div className="score-ring">78</div>
  
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