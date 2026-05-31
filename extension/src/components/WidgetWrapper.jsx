import React from "react";

export default function WidgetWrapper({
  id,
  title,
  children,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  visible = true,
  onToggleVisibility,
}) {
  if (!visible) return null;

  const handleDragStart = (e) => {
    if (onDragStart) onDragStart(e, id);
  };

  const handleDragOver = (e) => {
    if (onDragOver) onDragOver(e, id);
  };

  const handleDrop = (e) => {
    if (onDrop) onDrop(e, id);
  };

  const handleDragEnd = (e) => {
    if (onDragEnd) onDragEnd(e, id);
  };

  return (
    <div
      className="card widget"
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragEnd={handleDragEnd}
      data-id={id}
    >
      <div className="widget-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8}}>
        <h3 style={{margin:0}}>{title}</h3>
        <div style={{display:'flex', gap:8, alignItems:'center'}}>
          <button
            aria-label="toggle-visibility"
            onClick={(e) => { e.stopPropagation(); onToggleVisibility && onToggleVisibility(id); }}
            style={{background:'transparent', border:'none', cursor:'pointer'}}
          >
            👁️
          </button>
          <span className="drag-handle" style={{cursor:'grab'}}>≡</span>
        </div>
      </div>
      <div className="widget-body">{children}</div>
    </div>
  );
}
