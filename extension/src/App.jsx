import React from "react";
import "./App.css";
import Header from "./components/Header";
import LogicScore from "./components/LogicScore";
import LogicSummary from "./components/LogicSummary";
import FallacyTimeline from "./components/FallacyTimeline";
import WorksDoesnt from "./components/WorksDoesnt";
import HiddenAssumptions from "./components/HiddenAssumptions";
import ImproveReasoning from "./components/ImproveReasoning";

function App() {
  return (
    <div className="extension-panel">
      <Header />
      <LogicScore />
      <LogicSummary />
      <FallacyTimeline />
      <WorksDoesnt />
      <HiddenAssumptions />
      <ImproveReasoning />
    </div>
  );
}

export default App;