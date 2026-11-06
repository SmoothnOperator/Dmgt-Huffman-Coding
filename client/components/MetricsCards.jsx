import React from 'react';

export default function MetricsCards({ metrics }) {
  if (!metrics) return null;

  return (
    <div style={{ marginBottom: '24px' }}>
      
      {/* 4 Primary Mathematical Metrics */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
        gap: '16px',
        marginBottom: '16px'
      }}>
        
        {/* Entropy Box */}
        <div className="glass-card" style={{ marginBottom: 0, padding: '18px 20px', borderLeft: '4px solid var(--accent-cyan)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Shannon Entropy H(X)</span>
            <span className="badge badge-cyan">Lower Bound</span>
          </div>
          <div className="font-mono" style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--accent-cyan)', margin: '8px 0 4px 0' }}>
            {metrics.entropy} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>bits/sym</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
            Theoretical limits: H(X) ≤ L(C) &lt; H(X) + 1
          </div>
        </div>

        {/* Expected Length Box */}
        <div className="glass-card" style={{ marginBottom: 0, padding: '18px 20px', borderLeft: '4px solid var(--accent-emerald)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Expected Code Length L(C)</span>
            <span className="badge badge-emerald">Optimal</span>
          </div>
          <div className="font-mono" style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--accent-emerald)', margin: '8px 0 4px 0' }}>
            {metrics.avgLength} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>bits/sym</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
            Shannon-Fano Avg: <strong>{metrics.sfAvgLength}</strong> bits/sym
          </div>
        </div>

        {/* Redundancy Box */}
        <div className="glass-card" style={{ marginBottom: 0, padding: '18px 20px', borderLeft: '4px solid var(--accent-amber)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Code Redundancy R</span>
            <span className="badge badge-amber">R = L(C) - H(X)</span>
          </div>
          <div className="font-mono" style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--accent-amber)', margin: '8px 0 4px 0' }}>
            {metrics.redundancy} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>bits/sym</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
            Zero redundancy when probabilities are powers of 2
          </div>
        </div>

        {/* Kraft McMillan Box */}
        <div className="glass-card" style={{ marginBottom: 0, padding: '18px 20px', borderLeft: '4px solid var(--accent-violet)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Kraft-McMillan Invariant</span>
            <span className="badge badge-violet">∑ 2^{`{-l_i}`} ≤ 1</span>
          </div>
          <div className="font-mono" style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--accent-violet)', margin: '8px 0 4px 0' }}>
            {metrics.kraftSum}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
            Full binary prefix tree property holds exactly
          </div>
        </div>

      </div>

      {/* Bit Storage & Compression Ratio Banner */}
      <div className="glass-card" style={{ marginBottom: 0, padding: '16px 22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Storage Compression Performance:</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
              Uncompressed Fixed ASCII: <span style={{ color: 'var(--accent-rose)' }}>{metrics.uncompressedBits?.toLocaleString()} bits</span> → Huffman Optimal: <span style={{ color: 'var(--accent-emerald)' }}>{metrics.compressedBits?.toLocaleString()} bits</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Net Bit Reduction</div>
            <div className="font-display" style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
              -{metrics.compressionRatio}%
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
