import React, { useState } from 'react';

export default function CodeFeeder({ presets, onFeedCode }) {
  const [selectedFile, setSelectedFile] = useState('huffman.py');

  const files = [
    { key: 'huffman.py', label: 'src/huffman.py (Nikhil - Lead)' },
    { key: 'codec.py', label: 'src/codec.py (Piyush - Codec)' },
    { key: 'shannon_fano.py', label: 'src/shannon_fano.py (Sakshi - Baseline)' },
    { key: 'visualizer.py', label: 'src/visualizer.py (Khyathi - Graph)' },
    { key: 'benchmark.py', label: 'experiments/benchmark.py (Harsh - Scaling)' },
    { key: 'main.py', label: 'main.py (Pipeline Integration)' },
    { key: 'test_huffman.py', label: 'tests/test_huffman.py (7 Unit Tests)' }
  ];

  const currentCode = (presets && presets[selectedFile]) || "# Code not loaded yet";

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h3 className="font-heading" style={{ fontSize: '1.25rem', color: 'var(--accent-cyan)' }}>
            💻 Source Code Feeder & Architecture Inspector
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Select any modular Python engine file and feed its exact source code directly into the Huffman tree model!
          </p>
        </div>
        <button 
          onClick={() => onFeedCode(currentCode)}
          className="badge badge-emerald"
          style={{ cursor: 'pointer', padding: '10px 18px', fontSize: '0.88rem' }}
        >
          ⚡ Feed This Code Into Compression Engine
        </button>
      </div>

      {/* File selector pills */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
        {files.map(f => (
          <button
            key={f.key}
            onClick={() => setSelectedFile(f.key)}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: selectedFile === f.key ? '1px solid var(--accent-cyan)' : '1px solid var(--border)',
              background: selectedFile === f.key ? 'rgba(0, 242, 254, 0.15)' : 'var(--bg-secondary)',
              color: selectedFile === f.key ? 'var(--accent-cyan)' : 'var(--text-muted)',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Code Display */}
      <div style={{
        background: 'var(--bg-input)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        padding: '16px',
        maxHeight: '400px',
        overflowY: 'auto'
      }}>
        <pre className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--text-main)', margin: 0, whiteSpace: 'pre-wrap' }}>
          {currentCode}
        </pre>
      </div>

    </div>
  );
}
