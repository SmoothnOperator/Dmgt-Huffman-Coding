/**
 * Channel Noise & Bit-Flip Desynchronization Simulator
 * Compares error propagation in fixed-length 8-bit ASCII vs variable-length Huffman prefix codes.
 */

export function simulateBitFlip(text, codes, treeRoot, flippedBitIndex = 0) {
  if (!text || !treeRoot) return null;

  // 1. Build original Huffman bitstream and track character bit boundaries
  let huffBitstream = "";
  const charBitRanges = []; // { char, start, end }

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const code = (codes && codes[ch]) ? codes[ch] : "0";
    const start = huffBitstream.length;
    huffBitstream += code;
    const end = huffBitstream.length - 1;
    charBitRanges.push({ index: i, char: ch, start, end, code });
  }

  // 2. Build 8-bit ASCII bitstream
  let asciiBitstream = "";
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i) & 0xFF;
    asciiBitstream += code.toString(2).padStart(8, '0');
  }

  const safeFlipIndex = Math.max(0, Math.min(huffBitstream.length - 1, flippedBitIndex));

  // 3. Flip bit in Huffman stream
  const originalBit = huffBitstream[safeFlipIndex];
  const invertedBit = originalBit === '0' ? '1' : '0';
  const noisyHuffBitstream = huffBitstream.substring(0, safeFlipIndex) + invertedBit + huffBitstream.substring(safeFlipIndex + 1);

  // 4. Decode noisy Huffman stream
  let curr = treeRoot;
  let decodedChars = [];
  let bitsConsumed = 0;
  let lastSyncIdx = -1;

  for (let i = 0; i < noisyHuffBitstream.length; i++) {
    const bit = noisyHuffBitstream[i];
    curr = (bit === '0') ? curr.left : curr.right;

    if (curr && curr.char !== null) {
      decodedChars.push({
        char: curr.char,
        decodedAtBit: i,
        isCorrupted: false // evaluated below
      });
      curr = treeRoot;
    } else if (!curr) {
      // Reached dead end (can happen with invalid branch)
      decodedChars.push({ char: '', decodedAtBit: i, isCorrupted: true });
      curr = treeRoot;
    }
  }

  // Compare original text vs decoded text
  const originalChars = text.split('');
  let corruptedCount = 0;
  const comparison = [];
  const maxLen = Math.max(originalChars.length, decodedChars.length);

  for (let i = 0; i < maxLen; i++) {
    const orig = originalChars[i] || "";
    const deco = decodedChars[i] ? decodedChars[i].char : "";
    const isMismatch = orig !== deco;
    if (isMismatch) corruptedCount++;

    comparison.push({
      index: i,
      orig,
      deco,
      isMismatch
    });
  }

  // 5. Compute ASCII bit flip behavior
  const asciiFlippedCharIdx = Math.floor(safeFlipIndex / 8);
  const asciiCorruptedCount = asciiFlippedCharIdx < text.length ? 1 : 0;

  // Identify which character original bit flip happened inside
  const flippedOriginalChar = charBitRanges.find(r => safeFlipIndex >= r.start && safeFlipIndex <= r.end);

  return {
    totalBits: huffBitstream.length,
    flippedBitIndex: safeFlipIndex,
    originalBit,
    invertedBit,
    flippedOriginalChar,
    originalText: text,
    decodedText: decodedChars.map(d => d.char).join(''),
    huffCorruptedCount: corruptedCount,
    huffCorruptionPct: ((corruptedCount / text.length) * 100).toFixed(1),
    asciiCorruptedCount,
    asciiCorruptionPct: ((asciiCorruptedCount / text.length) * 100).toFixed(1),
    comparison
  };
}
