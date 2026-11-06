import React, { useState } from 'react';

export default function BitTracer({ codes, treeData }) {
  const [testPhrase, setTestPhrase] = useState("DISCRETE MATH");
  const [bitIndex, setBitIndex] = useState(0);

  // Generate encoded bitstream
  let bitstream = "";
  for (const ch of testPhrase) {
    bitstream += (codes && codes[ch]) ? codes[ch] : "000";
  }

  // Decode bits up to bitIndex
  const decodeUpTo = (idx) => {
    if (!treeData || idx === 0) return { decoded: "", currentPath: "" };
    let curr = treeData;
    let decoded = "";
    let path = "";

    for (let i = 0; i < idx; i++) {
      const bit = bitstream[i];
      path += bit;
      if (bit === '0' && curr.left) curr = curr.left;
      else if (bit === '1' && curr.right) curr = curr.right;

      if (curr.char !== null) {
        decoded += curr.char;
        curr = treeData; // Reset to root
        path = "";
      }
    }
    return { decoded, currentPath: path };
  };

  const { decoded, currentPath } = decodeUpTo(bitIndex);

  return (
    <div className="glass-card">
      <h3 className="font-heading" style={{ fontSize: '1.25rem', color: 'var(--accent-cyan)', marginBottom: '8px' }}>
        ⚡ Interactive Bitstream Tracer & Lossless Decoder
      </h3>
      <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
        Observe how the prefix property enables unambiguous, instantaneous decoding without delimiter bits.
      </p>

      {/* Input phrase */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
        <input 
          type="text" 
          value={testPhrase}
          onChange={(e) => { setTestPhrase(e.target.value.toUpperCase()); setBitIndex(0); }}
          placeholder="Enter text to trace..."
          style={{
            flex: 1,
            background: 'var(--bg-input)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '10px 14px',
            color: 'var(--text-main)',
            fontSize: '0.95rem',
            fontFamily: 'var(--font-mono)'
          }}
        />
        <button 
          onClick={() => setBitIndex(b => Math.min(bitstream.length, b + 1))}
          className="badge badge-emerald"
          style={{ cursor: 'pointer', padding: '10px 18px', fontSize: '0.85rem' }}
        >
          ▶ Step 1 Bit
        </button>
        <button 
          onClick={() => setBitIndex(bitstream.length)}
          className="badge badge-cyan"
          style={{ cursor: 'pointer', padding: '10px 18px', fontSize: '0.85rem' }}
        >
          ⚡ Decode All
        </button>
        <button 
          onClick={() => setBitIndex(0)}
          className="badge badge-amber"
          style={{ cursor: 'pointer', padding: '10px 18px', fontSize: '0.85rem' }}
        >
          ↺ Reset
        </button>
      </div>

      {/* Bitstream Display */}
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: '10px',
        padding: '16px',
        marginBottom: '16px',
        fontFamily: 'var(--font-mono)',
        fontSize: '1rem',
        letterSpacing: '2px',
        wordBreak: 'break-all'
      }}>
        {bitstream.split('').map((bit, idx) => (
          <span 
            key={idx}
            style={{
              padding: '2px 4px',
              borderRadius: '3px',
              background: idx < bitIndex ? 'rgba(16, 185, 129, 0.25)' : (idx === bitIndex ? 'rgba(0, 242, 254, 0.45)' : 'transparent'),
              color: idx === bitIndex ? 'var(--accent-cyan)' : (idx < bitIndex ? 'var(--accent-emerald)' : 'var(--text-dim)'),
              fontWeight: idx === bitIndex ? 'bold' : 'normal',
              border: idx === bitIndex ? '1px solid var(--accent-cyan)' : 'none'
            }}
          >
            {bit}
          </span>
        ))}
      </div>

      {/* Decoded Stream Output */}
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: '10px',
        padding: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Decoded Output Accumulator:</div>
          <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-emerald)', marginTop: '4px' }}>
            "{decoded}"
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Active Tree Branch:</div>
          <div className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-cyan)', marginTop: '4px' }}>
            {currentPath ? `Traversing: ${currentPath}` : 'At Root Vertex'}
          </div>
        </div>
      </div>

    </div>
  );
}
