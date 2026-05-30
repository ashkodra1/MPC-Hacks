import React from "react";

function ImproveReasoning({ analysis }) {
  const steelman = analysis?.steelman_version || "";

  if (!steelman) {
    return (
      <section className="card">
        <h3>How to Improve</h3>
        <p>No improvements suggested</p>
      </section>
    );
  }

  return (
    <section className="card">
      <h3>How to Improve</h3>
      <p>{steelman}</p>
    </section>
  );
}

export default ImproveReasoning;