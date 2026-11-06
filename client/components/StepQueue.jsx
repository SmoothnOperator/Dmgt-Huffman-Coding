import React, { useState } from 'react';

export default function StepQueue({ steps }) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!steps || steps.length === 0) {
    return <div style={{ color: 'var(--text-muted)' }}>No steps available.</div>;
  }

  const stepData = steps[currentStep] || steps[0];

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h3 className="font-heading" style={{ fontSize: '1.25rem', color: 'var(--accent-cyan)' }}>
            🔄 Priority Queue (Min-Heap) Step Simulator
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Watch the bottom-up greedy assembly as the 2 lowest frequency subtrees merge at each step.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            disabled={currentStep === 0}
            onClick={() => setCurrentStep(s => Math.max(0, s - 1))}
            className="badge badge-cyan"
            style={{ cursor: currentStep === 0 ? 'not-allowed' : 'pointer', opacity: currentStep === 0 ? 0.5 : 1 }}
          >
            ◀ Previous
          </button>
          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)', padding: '0 8px' }}>
            Step {currentStep + 1} of {steps.length}
          </span>
          <button 
            disabled={currentStep === steps.length - 1}
            onClick={() => setCurrentStep(s => Math.min(steps.length - 1, s + 1))}
            className="badge badge-cyan"
            style={{ cursor: currentStep === steps.length - 1 ? 'not-allowed' : 'pointer', opacity: currentStep === steps.length - 1 ? 0.5 : 1 }}
          >
            Next ▶
          </button>
        </div>
      </div>

      {/* Slider */}
      <input 
        type="range"
        min="0"
        max={steps.length - 1}
        value={currentStep}
        onChange={(e) => setCurrentStep(parseInt(e.target.value))}
        style={{ width: '100%', accentColor: 'var(--accent-cyan)', marginBottom: '20px' }}
      />

      {/* Step Detail Card */}
      {stepData.merged && (
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: '10px',
          padding: '20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px'
        }}>
          <div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Left Child (Extracted Min 1)</div>
            <div className="font-mono" style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--accent-cyan)', marginTop: '4px' }}>
              {stepData.merged.left.char ? `'${stepData.merged.left.char}'` : `Subtree #${stepData.merged.left.id}`}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Weight: {stepData.merged.left.freq}</div>
          </div>

          <div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Right Child (Extracted Min 2)</div>
            <div className="font-mono" style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--accent-rose)', marginTop: '4px' }}>
              {stepData.merged.right.char ? `'${stepData.merged.right.char}'` : `Subtree #${stepData.merged.right.id}`}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Weight: {stepData.merged.right.freq}</div>
          </div>

          <div style={{ borderLeft: '2px solid var(--border)', paddingLeft: '16px' }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>New Merged Parent Vertex</div>
            <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-emerald)', marginTop: '4px' }}>
              Vertex #{stepData.merged.id} (Weight: {stepData.merged.freq})
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Remaining in Priority Queue: {stepData.remainingCount}</div>
          </div>
        </div>
      )}
    </div>
  );
}
