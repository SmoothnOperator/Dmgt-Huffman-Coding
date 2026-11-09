import React, { useState } from 'react';
import { SoundEngine } from '../utils/soundEngine';

export default function BitstreamInspector({ inputText, codes, hoveredChar, setHoveredChar }) {
  const [viewFormat, setViewFormat] = useState('tokens'); // 'tokens', 'raw', 'hex'
  const [copied, setCopied] = useState(false);

  if (!inputText || !codes || Object.keys(codes).length === 0) return null;

  // Build sequential tokens
  const tokens = [];
  let fullBitstream = "";
  for (let i = 0; i < inputText.length; i++) {
    const ch = inputText[i];
    const code = codes[ch] || "0";
    tokens.push({
      index: i,
      char: ch,
      code: code,
      offset: fullBitstream.length
    });
    fullBitstream += code;
  }

  // Convert bitstream to Hex bytes
  const hexBytes = [];
  for (let i = 0; i < fullBitstream.length; i += 8) {
    const chunk = fullBitstream.substring(i, i + 8).padEnd(8, '0');
    hexBytes.push(parseInt(chunk, 2).toString(16).padStart(2, '0').toUpperCase());
  }

  const paddingBits = (8 - (fullBitstream.length % 8)) % 8;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullBitstream);
    setCopied(true);
    SoundEngine.playSuccess();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTokenHover = (t) => {
    setHoveredChar(t.char);
    // Play first bit tone
    if (t.code) SoundEngine.playBit(t.code[0]);
  };

  return (
    <div className="glass-card" style={{ marginTop: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h3 className="font-heading" style={{ fontSize: '1.2rem', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>⚡ Interactive Compressed Bitstream Inspector</span>
            <span className="badge badge-emerald font-mono">{fullBitstream.length} Bits ({hexBytes.length} Bytes)</span>
          </h3>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            Each colored packet represents an instantaneous prefix codeword. Hover to trace symbol provenance and byte alignment.
          </p>
        </div>

        {/* View Mode & Copy Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', background: 'var(--bg-input)', borderRadius: '6px', border: '1px solid var(--border)', padding: '2px' }}>
            <button
              onClick={() => { setViewFormat('tokens'); SoundEngine.playClick(); }}
              style={{
                border: 'none',
                background: viewFormat === 'tokens' ? 'var(--accent-cyan)' : 'transparent',
                color: viewFormat === 'tokens' ? '#000' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.78rem',
                padding: '4px 10px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Token Packets
            </button>
            <button
              onClick={() => { setViewFormat('raw'); SoundEngine.playClick(); }}
              style={{
                border: 'none',
                background: viewFormat === 'raw' ? 'var(--accent-cyan)' : 'transparent',
                color: viewFormat === 'raw' ? '#000' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.78rem',
                padding: '4px 10px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Raw Binary
            </button>
            <button
              onClick={() => { setViewFormat('hex'); SoundEngine.playClick(); }}
              style={{
                border: 'none',
                background: viewFormat === 'hex' ? 'var(--accent-cyan)' : 'transparent',
                color: viewFormat === 'hex' ? '#000' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.78rem',
                padding: '4px 10px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Hex Dump
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="badge badge-cyan"
            style={{ cursor: 'pointer', padding: '6px 14px' }}
          >
            {copied ? '✓ Copied!' : '📋 Copy Bits'}
          </button>
        </div>
      </div>

      {/* Stream Display Box */}
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: '10px',
        padding: '16px',
        maxHeight: '220px',
        overflowY: 'auto',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.88rem',
        lineHeight: 1.8
      }}>
        {viewFormat === 'tokens' && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {tokens.slice(0, 300).map((t, idx) => {
              const isMatch = hoveredChar === t.char;
              return (
                <span
                  key={idx}
                  onMouseEnter={() => handleTokenHover(t)}
                  onMouseLeave={() => setHoveredChar(null)}
                  title={`Char: '${t.char === ' ' ? 'SPACE' : t.char}' | Code: ${t.code} | Bit Offset: ${t.offset}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: isMatch ? 'rgba(0, 242, 254, 0.35)' : 'rgba(255, 255, 255, 0.05)',
                    border: isMatch ? '1px solid var(--accent-cyan)' : '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: isMatch ? '0 0 10px rgba(0, 242, 254, 0.4)' : 'none',
                    color: isMatch ? '#FFF' : 'var(--accent-blue)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.7rem', marginRight: '4px' }}>
                    {t.char === ' ' ? '␣' : t.char}
                  </span>
                  <strong>{t.code}</strong>
                </span>
              );
            })}
            {tokens.length > 300 && (
              <span style={{ color: 'var(--text-dim)', alignSelf: 'center', fontSize: '0.8rem', paddingLeft: '8px' }}>
                +{tokens.length - 300} more tokens...
              </span>
            )}
          </div>
        )}

        {viewFormat === 'raw' && (
          <div style={{ wordBreak: 'break-all', letterSpacing: '1px', color: 'var(--accent-cyan)' }}>
            {fullBitstream.slice(0, 2000)}
            {fullBitstream.length > 2000 && (
              <span style={{ color: 'var(--text-dim)' }}> ...[{fullBitstream.length - 2000} more bits]</span>
            )}
          </div>
        )}

        {viewFormat === 'hex' && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {hexBytes.slice(0, 200).map((byte, idx) => (
              <span 
                key={idx}
                style={{
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: 'rgba(139, 92, 246, 0.15)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  color: 'var(--accent-violet)',
                  fontSize: '0.82rem'
                }}
              >
                0x{byte}
              </span>
            ))}
            {hexBytes.length > 200 && (
              <span style={{ color: 'var(--text-dim)', alignSelf: 'center', fontSize: '0.8rem' }}>
                +{hexBytes.length - 200} more bytes
              </span>
            )}
          </div>
        )}
      </div>

      {/* Bitstream Footer Alignment Metrics */}
      <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
        <div>
          Byte Alignment: <strong style={{ color: 'var(--text-main)' }}>{fullBitstream.length} bits</strong> ➔ Packed into <strong style={{ color: 'var(--accent-emerald)' }}>{hexBytes.length} bytes</strong> ({paddingBits} padding bit{paddingBits === 1 ? '' : 's'})
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <span>Fixed ASCII: <span style={{ color: 'var(--accent-rose)' }}>{inputText.length * 8} bits</span></span>
          <span>Huffman: <span style={{ color: 'var(--accent-emerald)' }}>{fullBitstream.length} bits</span></span>
          <span>Savings: <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>{((1 - fullBitstream.length / (inputText.length * 8)) * 100).toFixed(1)}%</span></span>
        </div>
      </div>

    </div>
  );
}
