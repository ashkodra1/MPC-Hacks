import React from "react";

function HiddenAssumptions({ analysis }) {
  const assumptions = analysis?.hidden_assumptions || [];

  if (assumptions.length === 0) {
    return (
      <section className="card">
        <h3>Hidden Assumptions</h3>
        <p>No hidden assumptions detected</p>
      </section>
    );
  }

  return (
    <section className="card">
      <h3>Hidden Assumptions</h3>
      <ul>
        {assumptions.map((assumption, idx) => (
          <li key={idx}>{assumption}</li>
        ))}
      </ul>
    </section>
  );
}

export default HiddenAssumptions;