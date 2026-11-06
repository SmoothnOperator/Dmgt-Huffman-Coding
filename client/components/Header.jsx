import React from 'react';

export const THEMES = [
  { id: 'theme-midnight', name: '🌌 Midnight Cyber', desc: 'Obsidian & Neon Cyan (Default)', accent: '#00F2FE' },
  { id: 'theme-synthwave', name: '🌇 Sunset Synthwave', desc: 'Neon Pink & Sunset Amber', accent: '#F43F5E' },
  { id: 'theme-nord', name: '❄️ Nord Arctic Frost', desc: 'Glacial Blue & Mint Aurora', accent: '#38BDF8' },
  { id: 'theme-luxury', name: '👑 Obsidian Gold', desc: 'Carbon Onyx & Imperial Gold', accent: '#F59E0B' },
  { id: 'theme-academic', name: '☀️ Academic Light', desc: 'Formal Platinum & Oxford Navy', accent: '#2563EB' }
];

export default function Header({ currentTheme, setTheme, viewMode3D, setViewMode3D }) {
  return (
    <header className="glass-card" style={{ marginBottom: '24px', padding: '20px 28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Left: University & Project Branding */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span className="badge badge-amber">🎓 JAIN (Deemed-to-be University)</span>
            <span className="badge badge-cyan">CSE - Blockchain & Core</span>
            <span className="badge badge-emerald">DMGT Topic 14</span>
          </div>
          <h1 className="font-display" style={{ 
            fontSize: '1.85rem', 
            fontWeight: 800, 
            letterSpacing: '-0.5px',
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '4px'
          }}>
            Optimal Prefix Codes & 3D Visual Simulation Model
          </h1>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)' }}>
            Course Evaluator: <strong style={{ color: 'var(--text-main)' }}>Dr. Priya Satish</strong> (Assistant Professor, Dept. of Mathematics)
          </p>
        </div>

        {/* Right: Theme Selector, 3D Toggle & Team Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          
          {/* 3D Visualizer Toggle */}
          <button 
            onClick={() => setViewMode3D(!viewMode3D)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: viewMode3D ? '1px solid var(--accent-cyan)' : '1px solid var(--border)',
              background: viewMode3D ? 'rgba(0, 242, 254, 0.15)' : 'var(--bg-card-hover)',
              color: viewMode3D ? 'var(--accent-cyan)' : 'var(--text-main)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: viewMode3D ? '0 0 16px rgba(0, 242, 254, 0.35)' : 'none',
              transition: 'all 0.25s ease'
            }}
          >
            <span>{viewMode3D ? '🌌 3D Spatial Tree: ON' : '🌳 Switch to 3D Tree'}</span>
          </button>

          {/* Theme Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Theme:</label>
            <select 
              value={currentTheme} 
              onChange={(e) => setTheme(e.target.value)}
              style={{
                background: 'var(--bg-input)',
                color: 'var(--text-main)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {THEMES.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Team Credits Pill */}
          <div style={{
            background: 'var(--bg-card-hover)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            padding: '8px 14px',
            fontSize: '0.82rem',
            textAlign: 'right'
          }}>
            <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>Team Topic 14</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
              Nikhil (Lead) • Piyush • Sakshi • Arushi • Harsh • Khyathi
            </div>
          </div>

        </div>

      </div>
    </header>
  );
}
