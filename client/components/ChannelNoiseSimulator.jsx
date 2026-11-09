import React, { useState } from 'react';
import { simulateBitFlip } from '../utils/channelNoise';
import { SoundEngine } from '../utils/soundEngine';

export default function ChannelNoiseSimulator({ codes, treeData }) {
  const [sampleText, setSampleText] = useState("DISCRETE MATHEMATICS HUFFMAN CODING TRANSMISSION");
  const [flippedIndex, setFlippedIndex] = useState(12);

  const result = simulateBitFlip(sampleText, codes, treeData, flippedIndex);

  if (!result) return null;

  const handleRandomFlip = () => {
    SoundEngine.playGlitch();
    setFlippedIndex(Math.floor(Math.random() * result.totalBits));
  };

  const handleSliderChange = (newVal) => {
    SoundEngine.playGlitch();
    setFlippedIndex(newVal);
  };

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h3 className="font-heading" style={{ fontSize: '1.25rem', color: 'var(--accent-rose)' }}>
            💥 Channel Noise & Bit-Flip Desynchronization Simulator
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Shannon's noisy channel simulation: observe how a single flipped bit in variable-length codes causes catastrophic framing errors vs fixed 8-bit ASCII.
          </p>
        </div>
        <button 
          onClick={handleRandomFlip}
          className="badge badge-amber"
          style={{ cursor: 'pointer', padding: '8px 16px' }}
        >
          🎲 Inject Random Bit Flip
        </button>
      </div>

      {/* Bit Slider / Selector */}
      <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px', marginBottom: '18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <label style={{ fontSize: '0.88rem', fontWeight: 600 }}>
            Select Flipped Bit Position: <strong style={{ color: 'var(--accent-cyan)' }}>Bit #{result.flippedBitIndex}</strong> of {result.totalBits}
          </label>
          <span className="badge badge-rose">
            Inverting: '{result.originalBit}' ➔ '{result.invertedBit}'
          </span>
        </div>

        <input 
          type="range"
          min="0"
          max={result.totalBits - 1}
          value={result.flippedBitIndex}
          onChange={(e) => handleSliderChange(parseInt(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--accent-rose)' }}
        />

        {result.flippedOriginalChar && (
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            Flipped bit resides inside symbol: <strong style={{ color: 'var(--accent-cyan)' }}>'{result.flippedOriginalChar.char}'</strong> (Codeword: <code>{result.flippedOriginalChar.code}</code>)
          </div>
        )}
      </div>

      {/* Comparison Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        
        {/* Fixed ASCII impact */}
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderLeft: '4px solid var(--accent-blue)', borderRadius: '8px', padding: '16px' }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Fixed 8-Bit ASCII Resistance</div>
          <div className="font-mono" style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--accent-blue)', margin: '4px 0' }}>
            {result.asciiCorruptedCount} Character Corrupted ({result.asciiCorruptionPct}%)
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Rigid 8-bit boundaries confine corruption to only the single affected byte. Zero boundary shift.
          </div>
        </div>

        {/* Huffman Variable-Length impact */}
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderLeft: '4px solid var(--accent-rose)', borderRadius: '8px', padding: '16px' }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Huffman Variable-Length Cascading Error</div>
          <div className="font-mono" style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--accent-rose)', margin: '4px 0' }}>
            {result.huffCorruptedCount} Characters Corrupted ({result.huffCorruptionPct}%)
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Branch divergence causes framing desynchronization across subsequent codewords until self-synchronization.
          </div>
        </div>

      </div>

      {/* Decoded Output Diff Grid */}
      <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px' }}>
        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
          Character-by-Character Synchronization Trajectory:
        </div>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '4px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.9rem',
          maxHeight: '220px',
          overflowY: 'auto',
          background: 'var(--bg-input)',
          padding: '12px',
          borderRadius: '8px'
        }}>
          {result.comparison.map((item, idx) => (
            <span
              key={idx}
              title={`Original: '${item.orig}' | Decoded: '${item.deco}'`}
              style={{
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '4px 6px',
                borderRadius: '4px',
                background: item.isMismatch ? 'rgba(244, 63, 94, 0.2)' : 'rgba(16, 185, 129, 0.1)',
                border: item.isMismatch ? '1px solid var(--accent-rose)' : '1px solid rgba(16, 185, 129, 0.25)',
                color: item.isMismatch ? 'var(--accent-rose)' : 'var(--accent-emerald)'
              }}
            >
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{item.orig || '∅'}</span>
              <span style={{ fontWeight: 'bold' }}>{item.deco || '∅'}</span>
            </span>
          ))}
        </div>
      </div>

    </div>
  );
}
