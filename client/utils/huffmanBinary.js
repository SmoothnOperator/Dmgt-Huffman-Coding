/**
 * Binary Bit-Packing and .huff File Serializer / Deserializer
 * Formats:
 * Magic Bytes: 4 bytes "HUFF" (0x48, 0x55, 0x46, 0x46)
 * Header:
 *   - Distinct symbols count (2 bytes uint16)
 *   - For each symbol: 1 byte ASCII char + 4 bytes uint32 frequency
 *   - Padding bits count in last payload byte (1 byte uint8: 0 to 7)
 *   - Payload byte count (4 bytes uint32)
 * Payload:
 *   - Bit-packed array of bytes
 */

export function packHuffmanBinary(text, codes, freqs) {
  const encoder = new TextEncoder();
  const textBytes = encoder.encode(text);
  
  // 1. Build bitstream string
  let bitstream = "";
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    bitstream += (codes && codes[ch]) ? codes[ch] : "0";
  }

  const validBits = bitstream.length;
  const paddingBits = (8 - (validBits % 8)) % 8;
  const fullBitstream = bitstream + "0".repeat(paddingBits);
  const payloadByteCount = fullBitstream.length / 8;

  // 2. Pack bits into Uint8Array
  const payloadBytes = new Uint8Array(payloadByteCount);
  for (let i = 0; i < payloadByteCount; i++) {
    const byteStr = fullBitstream.substr(i * 8, 8);
    payloadBytes[i] = parseInt(byteStr, 2);
  }

  // 3. Serialize Header:
  // Magic: 4 bytes
  // Symbols count: 2 bytes
  // Symbols entries: k * (1 byte char + 4 bytes freq)
  // Padding bits: 1 byte
  // Payload byte length: 4 bytes
  const symbolEntries = Object.entries(freqs);
  const headerSize = 4 + 2 + (symbolEntries.length * 5) + 1 + 4;
  const totalBufferSize = headerSize + payloadByteCount;

  const buffer = new ArrayBuffer(totalBufferSize);
  const view = new DataView(buffer);
  const byteView = new Uint8Array(buffer);

  // Magic "HUFF"
  byteView[0] = 0x48; // 'H'
  byteView[1] = 0x55; // 'U'
  byteView[2] = 0x46; // 'F'
  byteView[3] = 0x46; // 'F'

  // Symbols count (uint16)
  view.setUint16(4, symbolEntries.length, false);

  let offset = 6;
  for (const [ch, freq] of symbolEntries) {
    const charCode = ch.charCodeAt(0) & 0xFF;
    byteView[offset] = charCode;
    view.setUint32(offset + 1, freq, false);
    offset += 5;
  }

  // Padding bits (uint8)
  view.setUint8(offset, paddingBits);
  offset += 1;

  // Payload byte length (uint32)
  view.setUint32(offset, payloadByteCount, false);
  offset += 4;

  // Payload copy
  byteView.set(payloadBytes, offset);

  return {
    buffer,
    originalBytes: textBytes.length,
    compressedBytes: totalBufferSize,
    payloadOnlyBytes: payloadByteCount,
    ratio: ((1 - (totalBufferSize / textBytes.length)) * 100).toFixed(2),
    bitstreamLength: validBits,
    paddingBits
  };
}

export function unpackHuffmanBinary(arrayBuffer) {
  const view = new DataView(arrayBuffer);
  const byteView = new Uint8Array(arrayBuffer);

  // Verify Magic "HUFF"
  if (byteView[0] !== 0x48 || byteView[1] !== 0x55 || byteView[2] !== 0x46 || byteView[3] !== 0x46) {
    throw new Error("Invalid .huff file: Magic bytes 'HUFF' not found.");
  }

  const symbolCount = view.getUint16(4, false);
  let offset = 6;
  const freqs = {};

  for (let i = 0; i < symbolCount; i++) {
    const charCode = byteView[offset];
    const ch = String.fromCharCode(charCode);
    const freq = view.getUint32(offset + 1, false);
    freqs[ch] = freq;
    offset += 5;
  }

  const paddingBits = view.getUint8(offset);
  offset += 1;

  const payloadByteCount = view.getUint32(offset, false);
  offset += 4;

  const payloadBytes = byteView.subarray(offset, offset + payloadByteCount);

  // Unpack bitstream
  let bitstream = "";
  for (let i = 0; i < payloadBytes.length; i++) {
    const b = payloadBytes[i].toString(2).padStart(8, '0');
    bitstream += b;
  }

  const validBits = bitstream.substr(0, bitstream.length - paddingBits);

  // Reconstruct Huffman tree from frequencies
  class Node {
    constructor(char, freq, left = null, right = null) {
      this.char = char;
      this.freq = freq;
      this.left = left;
      this.right = right;
    }
  }

  const heap = Object.entries(freqs).map(([ch, f]) => new Node(ch, f));
  if (heap.length === 1) {
    const single = heap[0];
    const root = new Node(null, single.freq, single, null);
    return decodeBits(validBits, root);
  }

  while (heap.length > 1) {
    heap.sort((a, b) => a.freq - b.freq);
    const l = heap.shift();
    const r = heap.shift();
    heap.push(new Node(null, l.freq + r.freq, l, r));
  }
  const root = heap[0];

  function decodeBits(bits, treeRoot) {
    let curr = treeRoot;
    let decoded = "";
    for (let i = 0; i < bits.length; i++) {
      const bit = bits[i];
      curr = (bit === '0') ? curr.left : curr.right;
      if (curr && curr.char !== null) {
        decoded += curr.char;
        curr = treeRoot;
      }
    }
    return decoded;
  }

  const decodedText = decodeBits(validBits, root);
  return {
    decodedText,
    freqs,
    symbolCount,
    validBitsCount: validBits.length,
    payloadByteCount
  };
}
