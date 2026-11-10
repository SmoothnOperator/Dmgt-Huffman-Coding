import React, { useState } from 'react';
import { SoundEngine } from '../utils/soundEngine';

export default function SymbolFrequencyCloud({ freqs, codes, sfCodes, totalChars, inputText, hoveredChar, setHoveredChar }) {
  const [selectedChar, setSelectedChar] = useState(null);
  const [sortBy, setSortBy] = useState('freq'); // 'freq', 'len', 'alpha'
  const [filterQuery, setFilterQuery] = useState('');

  if (!freqs || Object.keys(freqs).length === 0) return null;

  const N = totalChars || Object.values(freqs).reduce((a, b) => a + b, 0);

  // Format symbol display
  const formatChar = (ch) => {
    if (ch === ' ') return { display: '␣', label: 'SPACE', isSpecial: true };
    if (ch === '\n') return { display: '↵', label: 'NEWLINE', isSpecial: true };
    if (ch === '\t') return { display: '⇥', label: 'TAB', isSpecial: true };
    if (ch === '\r') return { display: '␍', label: 'CR', isSpecial: true };
    return { display: ch, label: `U+${ch.charCodeAt(0).toString(16).padStart(4, '0').toUpperCase()}`, isSpecial: false };
  };

  // Build sorted array
  const symbols = Object.entries(freqs).map(([char, count], idx) => {
    const p = count / N;
    const selfInfo = -Math.log2(p);
    const code = codes ? (codes[char] || '') : '';
    const sfCode = sfCodes ? (sfCodes[char] || '') : '';
    const len = code.length;
    const kraftTerm = Math.pow(2, -len);
    return {
      char,
      count,
      p,
      selfInfo,
      code,
      sfCode,
      len,
      kraftTerm,
      pct: ((count / N) * 100).toFixed(2),
      formatted: formatChar(char)
    };
  });

  // Filter
  const filtered = symbols.filter(s => {
    if (!filterQuery) return true;
    return s.char.toLowerCase().includes(filterQuery.toLowerCase()) || 
           s.formatted.label.toLowerCase().includes(filterQuery.toLowerCase()) ||
           s.code.includes(filterQuery);
  });

  // Sort
  filtered.sort((a, b) => {
    if (sortBy === 'freq') return b.count - a.count;
    if (sortBy === 'len') return a.len - b.len || b.count - a.count;
    if (sortBy === 'alpha') return a.char.localeCompare(b.char);
    return 0;
  });

  const activeSymbol = selectedChar 
    ? symbols.find(s => s.char === selectedChar) 
    : (hoveredChar ? symbols.find(s => s.char === hoveredChar) : symbols[0]);

  const handleMouseEnter = (char, idx) => {
    setHoveredChar(char);
    // Play tone between 350Hz and 1100Hz based on frequency rank
    const toneFreq = 380 + (idx % 18) * 38;
    SoundEngine.playTone(toneFreq, 0.06);
  };

  const handleMouseLeave = () => {
    setHoveredChar(null);
  };

  const handleClick = (char) => {
    setSelectedChar(selectedChar === char ? null : char);
    SoundEngine.playClick();
  };

  return (
    <div className="glass-card" style={{ marginTop: '20px' }}>
      
      {/* Header with Search and Sort Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 className="font-heading" style={{ fontSize: '1.2rem', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🧬 Interactive Symbol Frequency & Shannon Information Cloud</span>
            <span className="badge badge-cyan">{symbols.length} Unique Symbols</span>
          </h3>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            Hover or click any symbol chip to highlight text occurrences, hear its frequency pitch, and inspect Shannon self-information \(I(s_i) = -\log_2(p_i)\).
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <input 
            type="text"
            placeholder="🔍 Filter symbol or code..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            style={{
              background: 'var(--bg-input)',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              padding: '6px 10px',
              color: 'var(--text-main)',
              fontSize: '0.82rem',
              outline: 'none',
              width: '160px'
            }}
          />

          <div style={{ display: 'flex', background: 'var(--bg-input)', borderRadius: '6px', border: '1px solid var(--border)', padding: '2px' }}>
            <button
              onClick={() => { setSortBy('freq'); SoundEngine.playClick(); }}
              style={{
                border: 'none',
                background: sortBy === 'freq' ? 'var(--accent-cyan)' : 'transparent',
                color: sortBy === 'freq' ? '#000' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.78rem',
                padding: '4px 8px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Frequency
            </button>
            <button
              onClick={() => { setSortBy('len'); SoundEngine.playClick(); }}
              style={{
                border: 'none',
                background: sortBy === 'len' ? 'var(--accent-cyan)' : 'transparent',
                color: sortBy === 'len' ? '#000' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.78rem',
                padding: '4px 8px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Bit Length
            </button>
            <button
              onClick={() => { setSortBy('alpha'); SoundEngine.playClick(); }}
              style={{
                border: 'none',
                background: sortBy === 'alpha' ? 'var(--accent-cyan)' : 'transparent',
                color: sortBy === 'alpha' ? '#000' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.78rem',
                padding: '4px 8px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              A-Z
            </button>
          </div>
        </div>
      </div>

      {/* Symbol Chips Cloud */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        maxHeight: '220px',
        overflowY: 'auto',
        padding: '8px',
        background: 'var(--bg-secondary)',
        borderRadius: '10px',
        border: '1px solid var(--border)',
        marginBottom: '16px'
      }}>
        {filtered.map((s, idx) => {
          const isCurrent = (hoveredChar === s.char) || (selectedChar === s.char);
          return (
            <div
              key={idx}
              onMouseEnter={() => handleMouseEnter(s.char, idx)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick(s.char)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: '8px',
                background: isCurrent ? 'rgba(0, 242, 254, 0.22)' : 'var(--bg-card)',
                border: isCurrent ? '1.5px solid var(--accent-cyan)' : '1px solid var(--border)',
                boxShadow: isCurrent ? '0 0 14px rgba(0, 242, 254, 0.35)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                transform: isCurrent ? 'translateY(-2px) scale(1.04)' : 'none'
              }}
            >
              <div style={{
                background: s.formatted.isSpecial ? 'rgba(245, 158, 11, 0.2)' : 'rgba(56, 189, 248, 0.15)',
                color: s.formatted.isSpecial ? 'var(--accent-amber)' : 'var(--accent-cyan)',
                borderRadius: '4px',
                padding: '2px 6px',
                fontWeight: 800,
                fontFamily: 'var(--font-mono)',
                fontSize: '0.95rem'
              }}>
                {s.formatted.display}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="font-mono" style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {s.count}×
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                    ({s.pct}%)
                  </span>
                </div>
                <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
                  {s.code || '—'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Symbol Deep Inspector Card */}
      {activeSymbol && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 24, 40, 0.8) 0%, rgba(13, 19, 34, 0.95) 100%)',
          border: '1px solid var(--accent-cyan)',
          borderRadius: '10px',
          padding: '16px 20px',
          boxShadow: '0 8px 24px -4px rgba(0, 242, 254, 0.18)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '8px',
                background: 'rgba(0, 242, 254, 0.15)',
                border: '1px solid var(--accent-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                fontWeight: 800,
                fontFamily: 'var(--font-mono)',
                color: 'var(--accent-cyan)'
              }}>
                {activeSymbol.formatted.display}
              </div>
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Symbol: '{activeSymbol.char === ' ' ? 'SPACE' : activeSymbol.char}' 
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginLeft: '8px' }}>
                    ({activeSymbol.formatted.label})
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Total Occurrences: <strong style={{ color: 'var(--text-main)' }}>{activeSymbol.count}</strong> out of {N} characters
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <span className="badge badge-emerald font-mono" style={{ fontSize: '0.85rem' }}>
                Huffman: {activeSymbol.code} ({activeSymbol.len} bits)
              </span>
              {activeSymbol.sfCode && (
                <span className="badge badge-violet font-mono" style={{ fontSize: '0.85rem' }}>
                  Shannon-Fano: {activeSymbol.sfCode} ({activeSymbol.sfCode.length} bits)
                </span>
              )}
            </div>
          </div>

          {/* Deep Formula Breakdown Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '12px', fontSize: '0.85rem' }}>
            <div style={{ background: 'var(--bg-input)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>Empirical Probability \(p_i\)</div>
              <div className="font-mono" style={{ color: 'var(--accent-cyan)', fontSize: '1.1rem', fontWeight: 700, marginTop: '2px' }}>
                {activeSymbol.p.toFixed(5)}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {activeSymbol.count} / {N} chars
              </div>
            </div>

            <div style={{ background: 'var(--bg-input)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>Shannon Self-Information \(I(s_i)\)</div>
              <div className="font-mono" style={{ color: 'var(--accent-amber)', fontSize: '1.1rem', fontWeight: 700, marginTop: '2px' }}>
                {activeSymbol.selfInfo.toFixed(3)} bits
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                \(-\log_2({activeSymbol.p.toFixed(4)})\)
              </div>
            </div>

            <div style={{ background: 'var(--bg-input)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>Codeword Length vs Ideal Bound</div>
              <div className="font-mono" style={{ color: 'var(--accent-emerald)', fontSize: '1.1rem', fontWeight: 700, marginTop: '2px' }}>
                {activeSymbol.len} bits (Δ: {(activeSymbol.len - activeSymbol.selfInfo).toFixed(2)})
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Optimal integer ceiling \(\lceil I(s_i) \rceil\)
              </div>
            </div>

            <div style={{ background: 'var(--bg-input)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>Kraft Term Contribution</div>
              <div className="font-mono" style={{ color: 'var(--accent-violet)', fontSize: '1.1rem', fontWeight: 700, marginTop: '2px' }}>
                2^{`-${activeSymbol.len}`} = {activeSymbol.kraftTerm.toFixed(5)}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                \(\le 1.0\) Kraft-McMillan
              </div>
            </div>
          </div>

          {/* Interactive Path Breadcrumb */}
          <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Root-to-Leaf Traversal Path:</span>
            <span className="badge badge-amber" style={{ padding: '2px 8px', fontSize: '0.75rem' }}>ROOT</span>
            {(activeSymbol.code || '').split('').map((bit, bIdx) => (
              <React.Fragment key={bIdx}>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>➔</span>
                <span 
                  className={bit === '0' ? 'badge badge-cyan' : 'badge badge-emerald'}
                  style={{ padding: '2px 8px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}
                >
                  Branch {bit} ({bit === '0' ? 'Left' : 'Right'})
                </span>
              </React.Fragment>
            ))}
            <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>➔</span>
            <span className="badge badge-violet" style={{ padding: '2px 8px', fontSize: '0.75rem' }}>
              Leaf '{activeSymbol.char === ' ' ? 'SPACE' : activeSymbol.char}'
            </span>
          </div>

        </div>
      )}

    </div>
  );
}
