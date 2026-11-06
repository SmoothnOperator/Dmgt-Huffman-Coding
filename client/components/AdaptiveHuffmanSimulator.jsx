import React, { useState } from 'react';
import { simulateAdaptiveHuffman } from '../utils/adaptiveHuffman';

export default function AdaptiveHuffmanSimulator() {
  const [streamInput, setStreamInput] = useState("BOOKKEEPER");
  const [stepIdx, setStepIdx] = useState(0);

  const simulation = simulateAdaptiveHuffman(streamInput);
  const steps = simulation.steps || [];
  const currentStep = steps[stepIdx] || steps[0];

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h3 className="font-heading" style={{ fontSize: '1.25rem', color: 'var(--accent-cyan)' }}>
            🔄 Dynamic / Adaptive Huffman Streaming Simulator (Vitter & FGK Algorithm)
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Single-pass compression: builds and restructures the prefix tree dynamically on-the-fly using the <strong>Sibling Property</strong> without sending frequency tables upfront.
          </p>
        </div>
        <span className="badge badge-cyan">1-Pass Adaptive Streaming</span>
      </div>

      {/* Stream Input */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
        <input 
          type="text" 
          value={streamInput}
          onChange={(e) => { setStreamInput(e.target.value.toUpperCase()); setStepIdx(0); }}
          placeholder="Type characters to stream..."
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
          onClick={() => { setStreamInput("ABRACADABRA"); setStepIdx(0); }}
          className="badge badge-amber"
          style={{ cursor: 'pointer', padding: '8px 14px' }}
        >
          Preset: ABRACADABRA
        </button>
        <button 
          onClick={() => { setStreamInput("BOOKKEEPER"); setStepIdx(0); }}
          className="badge badge-amber"
          style={{ cursor: 'pointer', padding: '8px 14px' }}
        >
          Preset: BOOKKEEPER
        </button>
      </div>

      {/* Step Stepper & Slider */}
      {steps.length > 0 && (
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>
              Streaming Stream Step: {stepIdx + 1} of {steps.length}
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                disabled={stepIdx === 0}
                onClick={() => setStepIdx(s => Math.max(0, s - 1))}
                className="badge badge-cyan"
                style={{ cursor: stepIdx === 0 ? 'not-allowed' : 'pointer', opacity: stepIdx === 0 ? 0.5 : 1 }}
              >
                ◀ Prev Symbol
              </button>
              <button 
                disabled={stepIdx === steps.length - 1}
                onClick={() => setStepIdx(s => Math.min(steps.length - 1, s + 1))}
                className="badge badge-cyan"
                style={{ cursor: stepIdx === steps.length - 1 ? 'not-allowed' : 'pointer', opacity: stepIdx === steps.length - 1 ? 0.5 : 1 }}
              >
                Stream Next Symbol ▶
              </button>
            </div>
          </div>

          <input 
            type="range"
            min="0"
            max={steps.length - 1}
            value={stepIdx}
            onChange={(e) => setStepIdx(parseInt(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--accent-cyan)' }}
          />

          {/* Current Step Analysis */}
          {currentStep && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginTop: '16px' }}>
              <div style={{ background: 'var(--bg-card)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Incoming Streamed Character</div>
                <div className="font-mono" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-cyan)', margin: '4px 0' }}>
                  '{currentStep.char}'
                </div>
                <span className={currentStep.isNew ? "badge badge-amber" : "badge badge-emerald"}>
                  {currentStep.isNew ? "New Symbol (NYT Split)" : "Seen Symbol (Weight++)"}
                </span>
              </div>

              <div style={{ background: 'var(--bg-card)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Emitted Transmission Bitstream</div>
                <div className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-emerald)', margin: '6px 0', wordBreak: 'break-all' }}>
                  {currentStep.emittedCode}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                  {currentStep.isNew ? "NYT Escape Code + 8-bit ASCII" : "Current Prefix Codeword"}
                </div>
              </div>

              <div style={{ background: 'var(--bg-card)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sibling Property & Restructuring</div>
                <div style={{ marginTop: '6px' }}>
                  {currentStep.swaps.length > 0 ? (
                    currentStep.swaps.map((sw, i) => (
                      <div key={i} style={{ fontSize: '0.85rem', color: 'var(--accent-rose)', fontWeight: 600 }}>
                        🔀 {sw}
                      </div>
                    ))
                  ) : (
                    <div style={{ fontSize: '0.88rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
                      ✅ Sibling Property Valid (No Swaps Required)
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Educational Explanation Box */}
      <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '16px' }}>
        <h4 style={{ color: 'var(--accent-cyan)', marginBottom: '8px' }}>
          💡 Why Adaptive Huffman is Crucial in Real Systems:
        </h4>
        <ul style={{ fontSize: '0.88rem', color: 'var(--text-muted)', paddingLeft: '20px', lineHeight: 1.6 }}>
          <li><strong>Zero Latency / Streaming</strong>: Static Huffman cannot compress a live network audio/sensor stream because it needs to read the entire file first to count frequencies. Adaptive Huffman starts streaming immediately.</li>
          <li><strong>No Header Overhead</strong>: Because both the sender and receiver maintain identical synchronized trees by updating after every character, no frequency table needs to be transmitted!</li>
          <li><strong>The Sibling Property (Gallager, 1978)</strong>: A binary prefix tree is optimal if and only if all nodes can be ordered n(1), n(2), ..., n(2k-1) such that their weights are monotonically non-decreasing and siblings are adjacent.</li>
        </ul>
      </div>

    </div>
  );
}
