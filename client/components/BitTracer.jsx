import React, { useState } from 'react';
import { SoundEngine } from '../utils/soundEngine';

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
    if (!treeData || idx === 0) return { decoded: "", currentPath: "", justCompletedLeaf: false };
    let curr = treeData;
    let decoded = "";
    let path = "";
    let justCompletedLeaf = false;

    for (let i = 0; i < idx; i++) {
      const bit = bitstream[i];
      path += bit;
      if (bit === '0' && curr.left) curr = curr.left;
      else if (bit === '1' && curr.right) curr = curr.right;

      if (curr.char !== null) {
        decoded += curr.char;
        curr = treeData; // Reset to root
        path = "";
        if (i === idx - 1) justCompletedLeaf = true;
      }
    }
    return { decoded, currentPath: path, justCompletedLeaf };
  };

  const { decoded, currentPath } = decodeUpTo(bitIndex);

  const handleStep = () => {
    if (bitIndex < bitstream.length) {
      const nextIdx = bitIndex + 1;
      const bit = bitstream[bitIndex];
      const res = decodeUpTo(nextIdx);
      if (res.justCompletedLeaf) {
        SoundEngine.playLeafChime();
      } else {
        SoundEngine.playBit(bit);
      }
      setBitIndex(nextIdx);
    }
  };

  const handleDecodeAll = () => {
    setBitIndex(bitstream.length);
    SoundEngine.playSuccess();
  };

  const handleReset = () => {
    setBitIndex(0);
    SoundEngine.playClick();
  };

  return (
    <div className="glass-card">
      <h3 className="font-heading" style={{ fontSize: '1.25rem', color: 'var(--accent-cyan)', marginBottom: '8px' }}>
        ⚡ Interactive Bitstream Tracer & Lossless Decoder
      </h3>
      <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
        Observe how the prefix property enables unambiguous, instantaneous decoding without delimiter bits.
      </p>

      {/* Input phrase */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          value={testPhrase}
          onChange={(e) => { setTestPhrase(e.target.value.toUpperCase()); setBitIndex(0); }}
          placeholder="Enter text to trace..."
          style={{
            flex: 1,
            minWidth: '220px',
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
          onClick={handleStep}
          className="badge badge-emerald"
          style={{ cursor: 'pointer', padding: '10px 18px', fontSize: '0.85rem' }}
        >
          ▶ Step 1 Bit
        </button>
        <button 
          onClick={handleDecodeAll}
          className="badge badge-cyan"
          style={{ cursor: 'pointer', padding: '10px 18px', fontSize: '0.85rem' }}
        >
          ⚡ Decode All
        </button>
        <button 
          onClick={handleReset}
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
        fontSize: '1.05rem',
        letterSpacing: '2px',
        wordBreak: 'break-all'
      }}>
        {bitstream.split('').map((bit, idx) => (
          <span 
            key={idx}
            onClick={() => {
              setBitIndex(idx + 1);
              SoundEngine.playBit(bit);
            }}
            style={{
              padding: '2px 4px',
              borderRadius: '3px',
              cursor: 'pointer',
              background: idx === bitIndex - 1 
                ? 'var(--accent-cyan)' 
                : (idx < bitIndex ? 'rgba(0, 242, 254, 0.2)' : 'transparent'),
              color: idx === bitIndex - 1 
                ? '#000' 
                : (idx < bitIndex ? 'var(--accent-cyan)' : 'var(--text-dim)'),
              fontWeight: idx < bitIndex ? 800 : 400,
              boxShadow: idx === bitIndex - 1 ? '0 0 10px var(--accent-cyan)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            {bit}
          </span>
        ))}
      </div>

      {/* Progress & Current Traversal State */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
        
        <div style={{ background: 'var(--bg-secondary)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Progress</div>
          <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-cyan)', margin: '4px 0' }}>
            {bitIndex} / {bitstream.length} Bits ({((bitIndex / (bitstream.length || 1)) * 100).toFixed(0)}%)
          </div>
          <div style={{ width: '100%', height: '6px', background: 'var(--bg-input)', borderRadius: '9999px', overflow: 'hidden' }}>
            <div style={{ width: `${(bitIndex / (bitstream.length || 1)) * 100}%`, height: '100%', background: 'var(--gradient-primary)', transition: 'width 0.2s ease' }} />
          </div>
        </div>

        <div style={{ background: 'var(--bg-secondary)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Active Branch Path (Root ➔ Curr)</div>
          <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-amber)', margin: '4px 0' }}>
            {currentPath ? currentPath : '• At Tree Root'}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
            Branches followed since last leaf symbol
          </div>
        </div>

        <div style={{ background: 'var(--bg-secondary)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Decoded Output Stream</div>
          <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-emerald)', margin: '4px 0' }}>
            "{decoded}"
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
            Instantaneous prefix reconstruction
          </div>
        </div>

      </div>

    </div>
  );
}
