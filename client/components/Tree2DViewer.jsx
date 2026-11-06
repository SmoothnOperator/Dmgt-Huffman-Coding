import React, { useState, useRef } from 'react';

export default function Tree2DViewer({ treeData, codes }) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [highlightedPath, setHighlightedPath] = useState([]);

  if (!treeData) return <div style={{ color: 'var(--text-muted)' }}>No tree data available.</div>;

  // Layout calculation for 2D tree
  let leafCounter = 0;
  const leafSpacing = 72;
  const levelSpacing = 75;

  function assignCoordinates(node, depth = 0) {
    if (!node) return null;
    if (node.char !== null) {
      node._x = leafCounter * leafSpacing + 50;
      node._y = depth * levelSpacing + 45;
      leafCounter++;
      return node;
    }
    assignCoordinates(node.left, depth + 1);
    assignCoordinates(node.right, depth + 1);

    if (node.left && node.right) {
      node._x = (node.left._x + node.right._x) / 2;
    } else if (node.left) {
      node._x = node.left._x;
    } else if (node.right) {
      node._x = node.right._x;
    } else {
      node._x = leafCounter * leafSpacing + 50;
      leafCounter++;
    }
    node._y = depth * levelSpacing + 45;
    return node;
  }

  // Clone tree to not mutate original
  const clone = JSON.parse(JSON.stringify(treeData));
  leafCounter = 0;
  assignCoordinates(clone);

  const totalWidth = Math.max(900, leafCounter * leafSpacing + 100);
  const totalHeight = 550;

  // Trace path from root to clicked leaf
  const handleNodeClick = (node) => {
    if (node.char && codes[node.char]) {
      const code = codes[node.char];
      setHighlightedPath(code.split(''));
    }
  };

  // Pan controls
  const handleMouseDown = (e) => {
    setIsPanning(true);
    setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };
  const handleMouseMove = (e) => {
    if (!isPanning) return;
    setPan({ x: e.clientX - startPan.x, y: e.clientY - startPan.y });
  };
  const handleMouseUp = () => setIsPanning(false);

  // Recursive element collector
  const elements = [];
  function renderSvgElements(node) {
    if (!node) return;

    if (node.left) {
      elements.push(
        <g key={`edge-${node.id}-${node.left.id}`}>
          <line
            x1={node._x}
            y1={node._y}
            x2={node.left._x}
            y2={node.left._y}
            stroke="var(--accent-blue)"
            strokeWidth="2"
            opacity="0.6"
          />
          <circle cx={(node._x + node.left._x) / 2 - 8} cy={(node._y + node.left._y) / 2} r="9" fill="var(--bg-primary)" stroke="var(--accent-cyan)" strokeWidth="1" />
          <text x={(node._x + node.left._x) / 2 - 8} y={(node._y + node.left._y) / 2 + 3} textAnchor="middle" fill="var(--accent-cyan)" fontSize="10" fontWeight="bold">0</text>
        </g>
      );
      renderSvgElements(node.left);
    }

    if (node.right) {
      elements.push(
        <g key={`edge-${node.id}-${node.right.id}`}>
          <line
            x1={node._x}
            y1={node._y}
            x2={node.right._x}
            y2={node.right._y}
            stroke="var(--accent-violet)"
            strokeWidth="2"
            opacity="0.6"
          />
          <circle cx={(node._x + node.right._x) / 2 + 8} cy={(node._y + node.right._y) / 2} r="9" fill="var(--bg-primary)" stroke="var(--accent-rose)" strokeWidth="1" />
          <text x={(node._x + node.right._x) / 2 + 8} y={(node._y + node.right._y) / 2 + 3} textAnchor="middle" fill="var(--accent-rose)" fontSize="10" fontWeight="bold">1</text>
        </g>
      );
      renderSvgElements(node.right);
    }

    const isLeaf = node.char !== null;
    elements.push(
      <g 
        key={`node-${node.id}`} 
        onClick={() => handleNodeClick(node)}
        style={{ cursor: isLeaf ? 'pointer' : 'default' }}
      >
        {isLeaf ? (
          <>
            <rect
              x={node._x - 22}
              y={node._y - 18}
              width="44"
              height="36"
              rx="8"
              fill="var(--bg-card)"
              stroke="var(--accent-emerald)"
              strokeWidth="2"
              filter="drop-shadow(0 0 10px rgba(16, 185, 129, 0.4))"
            />
            <text x={node._x} y={node._y - 1} textAnchor="middle" fill="var(--accent-emerald)" fontSize="13" fontWeight="bold" fontFamily="var(--font-mono)">
              {node.char === ' ' ? '␣' : (node.char === '\n' ? '↵' : node.char)}
            </text>
            <text x={node._x} y={node._y + 12} textAnchor="middle" fill="var(--text-muted)" fontSize="9">
              {node.freq}
            </text>
          </>
        ) : (
          <>
            <circle
              cx={node._x}
              cy={node._y}
              r="17"
              fill="var(--bg-card)"
              stroke="var(--accent-cyan)"
              strokeWidth="2"
              filter="drop-shadow(0 0 8px rgba(0, 242, 254, 0.35))"
            />
            <text x={node._x} y={node._y + 4} textAnchor="middle" fill="var(--text-main)" fontSize="10" fontWeight="bold">
              {node.freq}
            </text>
          </>
        )}
      </g>
    );
  }

  renderSvgElements(clone);

  return (
    <div style={{ position: 'relative' }}>
      
      {/* Zoom / Reset Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          🍃 Green Rectangles = Symbol Leaves • 🔵 Cyan Circles = Internal Merges • Click leaf to inspect code!
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => setZoom(z => Math.min(2.5, z + 0.15))}
            className="badge badge-cyan" 
            style={{ cursor: 'pointer' }}
          >
            🔍 Zoom In
          </button>
          <button 
            onClick={() => setZoom(z => Math.max(0.4, z - 0.15))}
            className="badge badge-cyan" 
            style={{ cursor: 'pointer' }}
          >
            🔍 Zoom Out
          </button>
          <button 
            onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
            className="badge badge-amber" 
            style={{ cursor: 'pointer' }}
          >
            ↺ Reset Pan/Zoom
          </button>
        </div>
      </div>

      {/* SVG Canvas with Pan & Zoom */}
      <div 
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          width: '100%',
          height: '520px',
          overflow: 'hidden',
          borderRadius: '12px',
          border: '1px solid var(--border)',
          background: 'var(--bg-secondary)',
          cursor: isPanning ? 'grabbing' : 'grab',
          position: 'relative'
        }}
      >
        <svg
          width={totalWidth}
          height={totalHeight}
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'top left',
            transition: isPanning ? 'none' : 'transform 0.1s ease-out'
          }}
        >
          {elements}
        </svg>
      </div>

    </div>
  );
}
