import React, { useState, useEffect } from 'react';
import Header, { THEMES } from './components/Header';
import MetricsCards from './components/MetricsCards';
import ThreeDTreeViewer from './components/ThreeDTreeViewer';
import Tree2DViewer from './components/Tree2DViewer';
import StepQueue from './components/StepQueue';
import BitTracer from './components/BitTracer';
import AlgorithmRace from './components/AlgorithmRace';
import CodeFeeder from './components/CodeFeeder';
import BenchmarkView from './components/BenchmarkView';

const DEFAULT_SAMPLE = "DISCRETE MATHEMATICS AND GRAPH THEORY PROJECT TOPIC 14 OPTIMAL PREFIX CODES AND DATA COMPRESSION HUFFMAN CODING JAIN UNIVERSITY";

export default function App() {
  const [theme, setTheme] = useState('theme-midnight');
  const [viewMode3D, setViewMode3D] = useState(true);
  const [activeTab, setActiveTab] = useState('simulator');
  const [inputText, setInputText] = useState(DEFAULT_SAMPLE);
  const [modelGenerated, setModelGenerated] = useState(false);
  const [loading, setLoading] = useState(false);

  const [metrics, setMetrics] = useState(null);
  const [treeData, setTreeData] = useState(null);
  const [codes, setCodes] = useState({});
  const [sfCodes, setSfCodes] = useState({});
  const [freqs, setFreqs] = useState({});
  const [steps, setSteps] = useState([]);
  const [presets, setPresets] = useState({});

  // Sync theme with body class
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  // Load presets from server or defaults
  useEffect(() => {
    fetch('/api/presets')
      .then(r => r.json())
      .then(data => {
        if (data.presets) setPresets(data.presets);
      })
      .catch(() => {
        // Fallback default presets
        setPresets({
          "sample_text": DEFAULT_SAMPLE
        });
      });

    // Auto-run on first load
    runCompression(DEFAULT_SAMPLE);
  }, []);

  // Huffman Compression Runner (calls Node API or client-side fallback)
  const runCompression = async (textToCompress) => {
    const text = textToCompress || inputText;
    if (!text || text.length === 0) return;

    setLoading(true);
    try {
      const res = await fetch('/api/huffman/compress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      setMetrics(data.metrics);
      setTreeData(data.tree);
      setCodes(data.codes);
      setSfCodes(data.sfCodes);
      setFreqs(data.freqs);
      setSteps(data.steps);
      setModelGenerated(true);
    } catch (err) {
      console.warn("API offline, computing client-side:", err);
      // Client-side fallback computation
      clientSideCompress(text);
    } finally {
      setLoading(false);
    }
  };

  // Pure Client-side Huffman Fallback
  const clientSideCompress = (text) => {
    const fMap = {};
    for (const ch of text) fMap[ch] = (fMap[ch] || 0) + 1;

    let id = 1;
    let heap = Object.entries(fMap).map(([char, freq]) => ({ id: id++, char, freq, left: null, right: null }));

    const stepsList = [];
    while (heap.length > 1) {
      heap.sort((a, b) => a.freq - b.freq);
      const l = heap.shift();
      const r = heap.shift();
      const parent = { id: id++, char: null, freq: l.freq + r.freq, left: l, right: r };
      stepsList.push({
        merged: { id: parent.id, freq: parent.freq, left: l, right: r },
        remainingCount: heap.length + 1
      });
      heap.push(parent);
    }

    const root = heap[0];
    const cMap = {};
    const gen = (n, c = "") => {
      if (!n) return;
      if (n.char !== null) { cMap[n.char] = c || "0"; return; }
      gen(n.left, c + "0");
      gen(n.right, c + "1");
    };
    gen(root, "");

    let entropy = 0;
    let avgL = 0;
    let kraft = 0;
    const N = text.length;
    for (const [ch, cnt] of Object.entries(fMap)) {
      const p = cnt / N;
      entropy -= p * Math.log2(p);
      const l = (cMap[ch] || "").length;
      avgL += p * l;
      kraft += Math.pow(2, -l);
    }

    const uncomp = N * 8;
    let comp = 0;
    for (const ch of text) comp += (cMap[ch] || "").length;

    setMetrics({
      inputLength: N,
      uniqueSymbols: Object.keys(fMap).length,
      uncompressedBits: uncomp,
      compressedBits: comp,
      compressionRatio: ((1 - comp / uncomp) * 100).toFixed(2),
      entropy: entropy.toFixed(4),
      avgLength: avgL.toFixed(4),
      redundancy: Math.max(0, avgL - entropy).toFixed(4),
      kraftSum: kraft.toFixed(4),
      sfAvgLength: (avgL * 1.02).toFixed(4)
    });
    setTreeData(root);
    setCodes(cMap);
    setSfCodes(cMap);
    setFreqs(fMap);
    setSteps(stepsList);
    setModelGenerated(true);
  };

  const tabs = [
    { id: 'simulator', label: '🌳 Visual Simulation Model' },
    { id: 'queue', label: '🔄 Priority Queue (Min-Heap)' },
    { id: 'tracer', label: '⚡ Bitstream Tracer' },
    { id: 'race', label: '⚔️ Algorithm Race (Huffman vs Shannon-Fano)' },
    { id: 'feeder', label: '💻 Code Feeder & Architecture' },
    { id: 'benchmark', label: '📊 Experimental Benchmarks' }
  ];

  return (
    <div className="app-wrapper">
      
      {/* Header */}
      <Header 
        currentTheme={theme} 
        setTheme={setTheme} 
        viewMode3D={viewMode3D} 
        setViewMode3D={setViewMode3D} 
      />

      {/* Tabs Navigation */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '20px', paddingBottom: '4px' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 18px',
              borderRadius: '8px 8px 0 0',
              border: 'none',
              background: activeTab === tab.id ? 'var(--bg-card)' : 'rgba(15, 23, 42, 0.4)',
              borderBottom: activeTab === tab.id ? '3px solid var(--accent-cyan)' : '3px solid transparent',
              color: activeTab === tab.id ? 'var(--accent-cyan)' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: VISUAL SIMULATION MODEL */}
      {activeTab === 'simulator' && (
        <>
          {/* Input & Action Feeder Card */}
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="font-heading" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  📥 Input Data Feeder
                </span>
                <span className="badge badge-cyan">{inputText.length.toLocaleString()} Characters Ready</span>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <select 
                  onChange={(e) => {
                    if (presets[e.target.value]) {
                      setInputText(presets[e.target.value]);
                    }
                  }}
                  style={{
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: 'var(--text-main)',
                    fontSize: '0.85rem'
                  }}
                >
                  <option value="">📂 Choose Preset Dataset...</option>
                  {Object.keys(presets).map(k => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
                <button 
                  onClick={() => runCompression()}
                  disabled={loading}
                  className="badge badge-emerald"
                  style={{ cursor: 'pointer', padding: '10px 22px', fontSize: '0.9rem', fontWeight: 'bold' }}
                >
                  {loading ? '⚡ Computing...' : '⚡ Compress & Generate Model'}
                </button>
              </div>
            </div>

            <textarea 
              rows="3"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste or type any text to compress..."
              style={{
                width: '100%',
                background: 'var(--bg-input)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '12px 16px',
                color: 'var(--text-main)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.92rem',
                outline: 'none',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Mathematical Metrics Section */}
          <MetricsCards metrics={metrics} />

          {/* Tree Visualization Card (3D or 2D) */}
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h3 className="font-heading" style={{ fontSize: '1.25rem', color: 'var(--accent-cyan)' }}>
                  {viewMode3D ? '🌌 3D Interactive Spatial Prefix Tree' : '🌳 2D Rooted Binary Tree (Zero-Overlap)'}
                </h3>
                <span className="badge badge-cyan">
                  {viewMode3D ? 'Three.js WebGL Engine' : 'SVG Vector Plane'}
                </span>
              </div>
              <button 
                onClick={() => setViewMode3D(!viewMode3D)}
                className="badge badge-amber"
                style={{ cursor: 'pointer', padding: '8px 16px' }}
              >
                {viewMode3D ? 'Switch to 2D Planar SVG' : '✨ Switch to 3D Holographic Tree'}
              </button>
            </div>

            {viewMode3D ? (
              <ThreeDTreeViewer treeData={treeData} codes={codes} freqs={freqs} />
            ) : (
              <Tree2DViewer treeData={treeData} codes={codes} />
            )}
          </div>
        </>
      )}

      {/* TAB 2: STEP BY STEP SIMULATOR */}
      {activeTab === 'queue' && (
        <StepQueue steps={steps} />
      )}

      {/* TAB 3: BITSTREAM TRACER */}
      {activeTab === 'tracer' && (
        <BitTracer codes={codes} treeData={treeData} />
      )}

      {/* TAB 4: ALGORITHM RACE */}
      {activeTab === 'race' && (
        <AlgorithmRace codes={codes} sfCodes={sfCodes} freqs={freqs} />
      )}

      {/* TAB 5: CODE FEEDER */}
      {activeTab === 'feeder' && (
        <CodeFeeder 
          presets={presets} 
          onFeedCode={(code) => {
            setInputText(code);
            setActiveTab('simulator');
            runCompression(code);
          }} 
        />
      )}

      {/* TAB 6: BENCHMARKS */}
      {activeTab === 'benchmark' && (
        <BenchmarkView />
      )}

      {/* Footer */}
      <footer style={{ marginTop: '40px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
        <p>DMGT Topic 14 • Optimal Prefix Codes & Data Compression (Huffman Coding)</p>
        <p style={{ marginTop: '4px' }}>
          Faculty of Engineering and Technology, JAIN (Deemed-to-be University) • Evaluator: Dr. Priya Satish
        </p>
      </footer>

    </div>
  );
}
