import React from 'react';

interface CanvaEmbedProps {
  designId: string;
  width?: string;
  height?: string;
  className?: string;
}

export default function CanvaEmbed({ 
  designId, 
  width = "100%", 
  height = "600px",
  className = ""
}: CanvaEmbedProps) {
  return (
    <div 
      className={`canva-embed-container ${className}`}
      style={{
        position: 'relative',
        width: width,
        height: height,
        overflow: 'hidden'
      }}
    >
      <iframe
        loading="lazy"
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          border: 'none',
          padding: 0,
          margin: 0
        }}
        src={`https://www.canva.com/design/DAG4TRN_uYs/vW_LEw3aZz0nPHjP6VrRvQ/view?embed`}
        allowFullScreen
        allow="fullscreen"
      />
    </div>
  );
}