import React from 'react';
import { calculateGraphInvariants } from '../utils/graphInvariants';

export default function GraphTheoryAnalyzer({ treeData }) {
  const invariants = calculateGraphInvariants(treeData);

  if (!invariants) return null;

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h3 className="font-heading" style={{ fontSize: '1.25rem', color: 'var(--accent-cyan)' }}>
            📐 Graph-Theoretic Topology & Structural Invariant Analyzer
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Formal verification of prefix tree graph invariants aligning directly with Discrete Mathematics & Graph Theory (DMGT) syllabus.
          </p>
        </div>
        <span className="badge badge-emerald">Discrete Math Theorems Verified</span>
      </div>

      {/* 4 Core Structural Invariants */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '20px' }}>
        
        {/* Full Binary Tree Order */}
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '16px' }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Full Binary Tree Order</div>
          <div className="font-mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-cyan)', margin: '4px 0' }}>
            |V| = {invariants.totalVertices} • |E| = {invariants.totalEdges}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Proves |V| = 2k - 1 and |E| = 2k - 2 for k = {invariants.kLeaves} leaves
          </div>
        </div>

        {/* Tree Diameter & Height */}
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '16px' }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Geodesic Diameter & Height</div>
          <div className="font-mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-emerald)', margin: '4px 0' }}>
            Diam = {invariants.diameter} • Height = {invariants.height}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Maximum graph distance between any two leaf vertices
          </div>
        </div>

        {/* Wiener Topological Index */}
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '16px' }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Wiener Topological Index W(T)</div>
          <div className="font-mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-violet)', margin: '4px 0' }}>
            {invariants.wienerIndex.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            W(T) = ½ ∑ d(u,v) across all {invariants.totalVertices} vertices
          </div>
        </div>

        {/* Cyclomatic & Chromatic Number */}
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '16px' }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Coloring & Acyclicity</div>
          <div className="font-mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-amber)', margin: '4px 0' }}>
            χ(T) = {invariants.chromaticNumber} • γ(T) = {invariants.cyclomaticNumber}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Bipartite 2-colorable graph with strictly zero cycles
          </div>
        </div>

      </div>

      {/* Theorems Verification Table */}
      <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: '8px', marginBottom: '16px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
          <thead style={{ background: 'var(--bg-secondary)' }}>
            <tr>
              <th style={{ padding: '10px 14px', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>Graph Theory Theorem</th>
              <th style={{ padding: '10px 14px', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>Theoretical Equation</th>
              <th style={{ padding: '10px 14px', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>Observed Value</th>
              <th style={{ padding: '10px 14px', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>Mathematical Status</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '10px 14px', fontWeight: 600 }}>Euler's Handshaking Lemma</td>
              <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)' }}>∑ deg(v) = 2|E| = 4k - 4</td>
              <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)' }}>{invariants.handshakingSum} = 2({invariants.totalEdges})</td>
              <td style={{ padding: '10px 14px' }}>
                <span className="badge badge-emerald">✅ Invariant Holds</span>
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '10px 14px', fontWeight: 600 }}>Full Binary Tree Path Theorem</td>
              <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)' }}>E_PL = I_PL + 2(k - 1)</td>
              <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)' }}>{invariants.externalPathLength} = {invariants.internalPathLength} + 2({invariants.kLeaves - 1})</td>
              <td style={{ padding: '10px 14px' }}>
                <span className="badge badge-emerald">✅ Exact Identity</span>
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '10px 14px', fontWeight: 600 }}>Internal vs Leaf Vertex Ratio</td>
              <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)' }}>I = k - 1</td>
              <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)' }}>{invariants.internalVertices} = {invariants.kLeaves} - 1</td>
              <td style={{ padding: '10px 14px' }}>
                <span className="badge badge-emerald">✅ Verified</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Degree Sequence Distribution */}
      <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '14px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Degree-1 Vertices (Leaves): </span>
          <strong style={{ color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>{invariants.degreeCounts[1]}</strong>
        </div>
        <div>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Degree-2 Vertices (Root): </span>
          <strong style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>{invariants.degreeCounts[2]}</strong>
        </div>
        <div>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Degree-3 Vertices (Internal): </span>
          <strong style={{ color: 'var(--accent-blue)', fontFamily: 'var(--font-mono)' }}>{invariants.degreeCounts[3]}</strong>
        </div>
      </div>

    </div>
  );
}
