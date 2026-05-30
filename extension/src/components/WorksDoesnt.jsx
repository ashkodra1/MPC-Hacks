import React from "react";

function WorksDoesnt({ analysis }) {
  const reasoning_issues = analysis?.reasoning_issues || [];
  const counterargument = analysis?.strongest_counterargument || "";

  return (
    <section className="card">
      <h3>What Works / What Doesn't</h3>
      {reasoning_issues.length > 0 && (
        <div>
          <h4>Issues:</h4>
          <ul>
            {reasoning_issues.map((issue, idx) => (
              <li key={idx}>{issue}</li>
            ))}
          </ul>
        </div>
      )}
      {counterargument && (
        <div>
          <h4>Strongest Counterargument:</h4>
          <p>{counterargument}</p>
        </div>
      )}
    </section>
  );
}

export default WorksDoesnt;