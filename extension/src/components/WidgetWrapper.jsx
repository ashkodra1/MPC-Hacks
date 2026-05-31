import React, { useState, useEffect, useRef } from "react";

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
        <div style={{display:'flex', gap:8, alignItems:'center', position: 'relative'}}>
          <MenuButton visible={visible} onToggle={() => onToggleVisibility && onToggleVisibility(id)} />
          <span className="drag-handle" style={{cursor:'grab'}}>≡</span>
        </div>
      </div>
      <div className="widget-body">{children}</div>
    </div>
  );
}

function MenuButton({ visible = true, onToggle }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  return (
    <div ref={ref} style={{position:'relative'}}>
      <button
        aria-label="widget-menu"
        onClick={(e) => { e.stopPropagation(); setOpen((s) => !s); }}
        style={{background:'transparent', border:'none', cursor:'pointer', fontSize:18}}
        title="Widget options"
      >
        ⋯
      </button>

      {open && (
        <div style={{position:'absolute', right:0, top:28, background:'white', border:'1px solid rgba(0,0,0,0.12)', borderRadius:6, boxShadow:'0 6px 18px rgba(0,0,0,0.08)', zIndex:1000}}>
          <button
            onClick={(e) => { e.stopPropagation(); onToggle && onToggle(); setOpen(false); }}
            style={{display:'block', padding:'8px 12px', width:160, textAlign:'left', border:'none', background:'transparent', cursor:'pointer'}}
          >
            {visible ? 'Hide widget' : 'Show widget'}
          </button>
        </div>
      )}
    </div>
  );
}
