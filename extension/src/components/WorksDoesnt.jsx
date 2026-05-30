import React from "react";

function WorksDoesnt() {
    return (
      <section className="works-grid">
        <div className="mini-card good">
          <h3>What Works</h3>
          <ul>
            <li>Clear claim</li>
            <li>Some evidence</li>
            <li>Good structure</li>
          </ul>
        </div>
  
        <div className="mini-card bad">
          <h3>What Doesn’t</h3>
          <ul>
            <li>Causal leap</li>
            <li>Missing context</li>
            <li>Weak assumptions</li>
          </ul>
        </div>
      </section>
    );
  }
  
  export default WorksDoesnt;