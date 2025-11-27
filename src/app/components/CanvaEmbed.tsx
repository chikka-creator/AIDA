import React from 'react';

interface CanvaEmbedProps {
  designId?: string;
  embedUrl?: string;
  width?: string;
  height?: string;
  className?: string;
}

export default function CanvaEmbed({ 
  designId = "DAGzolF2lTM",
  embedUrl = "https://www.canva.com/design/DAGzolF2lTM/NFqa9_BhIBlkUXiesX4nDg/view?embed",
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
        src={embedUrl}
        allowFullScreen
        allow="fullscreen"
      />
    </div>
  );
}