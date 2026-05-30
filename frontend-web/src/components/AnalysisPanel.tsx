const fallacyTags: string[] = ['Straw man', 'False cause', 'Ad hominem']

function AnalysisPanel() {
  return (
    <aside className="analysis-panel" aria-label="Fallacy detection preview">
      <div className="panel-topbar">
        <span />
        <span />
        <span />
      </div>
      <div className="video-frame">
        <div className="play-button" />
        <div className="timeline">
          <span />
        </div>
      </div>
      <div className="insight-card">
        <div>
          <span className="status-dot" />
          Detected claim
        </div>
        <strong>Possible false cause</strong>
        <p>Correlation is being treated as proof without a supporting link.</p>
      </div>
      <div className="fallacy-tags">
        {fallacyTags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
    </aside>
  )
}

export default AnalysisPanel
