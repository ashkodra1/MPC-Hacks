import React from "react";

function LogicSummary({ analysis }) {
  const summary = analysis?.argument_summary || "No summary available";

  return (
    <section className="card">
      <h3>Summary</h3>
      <p>{summary}</p>
    </section>
  );
}

export default LogicSummary;