import React, { useState } from 'react';

export default function AlgorithmRace({ codes, sfCodes, freqs }) {
  const [testText, setTestText] = useState("DISCRETE MATHEMATICS AND GRAPH THEORY OPTIMIZATION");
  const [racing, setRacing] = useState(false);
  const [raceProgress, setRaceProgress] = useState(1);

  // Compute total bits consumed on testText
  let hBits = 0;
  let sfBits = 0;
  for (const ch of testText) {
    hBits += (codes && codes[ch]) ? codes[ch].length : 4;
    sfBits += (sfCodes && sfCodes[ch]) ? sfCodes[ch].length : 4;
  }

  const handleStartRace = () => {
    setRacing(true);
    setRaceProgress(0);
    let p = 0;
    const interval = setInterval(() => {
      p += 0.05;
      if (p >= 1) {
        p = 1;
        clearInterval(interval);
        setRacing(false);
      }
      setRaceProgress(p);
    }, 40);
  };

  // Divergence analysis
  const divergenceRows = Object.keys(freqs || {}).map(ch => {
    const hLen = (codes && codes[ch]) ? codes[ch].length : 0;
    const sfLen = (sfCodes && sfCodes[ch]) ? sfCodes[ch].length : 0;
    return {
      char: ch,
      freq: freqs[ch],
      hCode: codes ? codes[ch] : '',
      sfCode: sfCodes ? sfCodes[ch] : '',
      hLen,
      sfLen,
      diff: sfLen - hLen
    };
  }).sort((a, b) => b.freq - a.freq);

  const shorterCount = divergenceRows.filter(r => r.diff > 0).length;

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h3 className="font-heading" style={{ fontSize: '1.25rem', color: 'var(--accent-cyan)' }}>
            ⚔️ Direct Head-to-Head Race: Huffman vs. Shannon-Fano
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Shannon-Fano is a top-down greedy heuristic; Huffman is bottom-up and mathematically proven optimal: L(C)_{`{Huff}`} ≤ L(C)_{`{SF}`}.
          </p>
        </div>
        <span className="badge badge-emerald">🏆 Huffman Provably Optimal</span>
      </div>

      {/* Race Input & Trigger */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input 
          type="text" 
          value={testText}
          onChange={(e) => setTestText(e.target.value.toUpperCase())}
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
          onClick={handleStartRace}
          disabled={racing}
          className="badge badge-cyan"
          style={{ cursor: racing ? 'not-allowed' : 'pointer', padding: '10px 20px', fontSize: '0.88rem' }}
        >
          {racing ? '🏎️ Racing...' : '🏁 Start Algorithm Race'}
        </button>
      </div>

      {/* Race Tracks */}
      <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '10px', padding: '18px', marginBottom: '20px' }}>
        
        {/* Huffman Bar */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 600, marginBottom: '6px' }}>
            <span style={{ color: 'var(--accent-emerald)' }}>🌳 Huffman Optimal Tree (Bottom-Up Greedy)</span>
            <span className="font-mono">{Math.round(hBits * raceProgress)} bits</span>
          </div>
          <div style={{ width: '100%', height: '14px', background: 'var(--bg-primary)', borderRadius: '9999px', overflow: 'hidden' }}>
            <div style={{
              width: `${(hBits / Math.max(hBits, sfBits)) * 100 * raceProgress}%`,
              height: '100%',
              background: 'var(--gradient-emerald)',
              transition: 'width 0.1s linear'
            }} />
          </div>
        </div>

        {/* Shannon-Fano Bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 600, marginBottom: '6px' }}>
            <span style={{ color: 'var(--accent-rose)' }}>✂️ Shannon-Fano (Top-Down Greedy Heuristic)</span>
            <span className="font-mono">{Math.round(sfBits * raceProgress)} bits</span>
          </div>
          <div style={{ width: '100%', height: '14px', background: 'var(--bg-primary)', borderRadius: '9999px', overflow: 'hidden' }}>
            <div style={{
              width: `${(sfBits / Math.max(hBits, sfBits)) * 100 * raceProgress}%`,
              height: '100%',
              background: 'var(--gradient-accent)',
              transition: 'width 0.1s linear'
            }} />
          </div>
        </div>

      </div>

      {/* Symbol Divergence Table */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h4 style={{ color: 'var(--text-main)', fontSize: '1rem' }}>Symbol Codeword Divergence:</h4>
        <span className="badge badge-emerald">
          {shorterCount > 0 ? `Huffman Shorter on ${shorterCount} Symbols` : 'Identical Expected Length'}
        </span>
      </div>

      <div style={{ maxHeight: '280px', overflowY: 'auto', border: '1px solid var(--border)', borderRadius: '8px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead style={{ background: 'var(--bg-secondary)', position: 'sticky', top: 0 }}>
            <tr>
              <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>Symbol</th>
              <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>Freq</th>
              <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>Huffman Code</th>
              <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>Huff Length</th>
              <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>SF Code</th>
              <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>SF Length</th>
              <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>Verdict</th>
            </tr>
          </thead>
          <tbody>
            {divergenceRows.slice(0, 25).map((row, idx) => (
              <tr 
                key={idx} 
                style={{ 
                  background: row.diff > 0 ? 'rgba(16, 185, 129, 0.12)' : (idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)'),
                  borderBottom: '1px solid var(--border)'
                }}
              >
                <td style={{ padding: '8px 10px', fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>
                  {row.char === ' ' ? "[Space]" : (row.char === '\n' ? "[\\n]" : `'${row.char}'`)}
                </td>
                <td style={{ padding: '8px 10px' }}>{row.freq}</td>
                <td style={{ padding: '8px 10px', fontFamily: 'var(--font-mono)', color: 'var(--accent-emerald)' }}>{row.hCode}</td>
                <td style={{ padding: '8px 10px', fontWeight: 'bold' }}>{row.hLen}</td>
                <td style={{ padding: '8px 10px', fontFamily: 'var(--font-mono)', color: 'var(--accent-rose)' }}>{row.sfCode}</td>
                <td style={{ padding: '8px 10px', fontWeight: 'bold' }}>{row.sfLen}</td>
                <td style={{ padding: '8px 10px' }}>
                  {row.diff > 0 ? (
                    <span className="badge badge-emerald">+{row.diff}b Shorter</span>
                  ) : (
                    <span style={{ color: 'var(--text-dim)' }}>Optimal Match</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
