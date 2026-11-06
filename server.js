import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Team & Academic Metadata
const PROJECT_METADATA = {
  topic: "DMGT Topic 14: Optimal Prefix Codes and Data Compression (Huffman Coding)",
  institution: "Faculty of Engineering and Technology, JAIN (Deemed-to-be University)",
  program: "B.Tech CSE - Blockchain Technology / CSE Core",
  evaluator: "Dr. Priya Satish (Assistant Professor, Dept of Mathematics)",
  team: [
    { name: "Nikhil Kumar", usn: "25BTRBT026", role: "Team Lead & Core Algorithm" },
    { name: "Piyush Kumar", usn: "25BTRBT030", role: "Lossless Encoder / Decoder" },
    { name: "Sakshi Kumari", usn: "25BTRC0045", role: "Shannon-Fano Baseline & Bounds" },
    { name: "Arushi Pramanik", usn: "25BTRBT008", role: "Empirical Validation & Testing" },
    { name: "Harsh R Rao", usn: "25BTRBT017", role: "Asymptotic Benchmark & Scaling" },
    { name: "Khyathi Jain", usn: "25BTRBT021", role: "Graph Theory & NetworkX Visualizer" }
  ]
};

// Priority Queue Min-Heap Node
class HuffmanNode {
  constructor(char, freq, left = null, right = null, id = 0) {
    this.char = char;
    this.freq = freq;
    this.left = left;
    this.right = right;
    this.id = id;
  }
}

// Huffman Tree Construction with Merge Steps
function buildHuffmanTree(text) {
  if (!text || text.length === 0) return { root: null, codes: {}, steps: [] };

  const freqs = {};
  for (const ch of text) {
    freqs[ch] = (freqs[ch] || 0) + 1;
  }

  let nextId = 1;
  let heap = Object.entries(freqs).map(([ch, f]) => new HuffmanNode(ch, f, null, null, nextId++));

  if (heap.length === 1) {
    const single = heap[0];
    const root = new HuffmanNode(null, single.freq, single, null, nextId++);
    return {
      root,
      codes: { [single.char]: "0" },
      freqs,
      steps: [{ step: 1, action: "Single character edge case wrapped in root", remaining: 1 }]
    };
  }

  const steps = [];
  let stepCount = 1;

  while (heap.length > 1) {
    heap.sort((a, b) => a.freq - b.freq || (a.id - b.id));
    const left = heap.shift();
    const right = heap.shift();

    const merged = new HuffmanNode(null, left.freq + right.freq, left, right, nextId++);
    steps.push({
      step: stepCount++,
      merged: {
        id: merged.id,
        freq: merged.freq,
        left: { id: left.id, char: left.char, freq: left.freq },
        right: { id: right.id, char: right.char, freq: right.freq }
      },
      remainingCount: heap.length + 1
    });

    heap.push(merged);
  }

  const root = heap[0];
  const codes = {};

  function generateCodes(node, currentCode = "") {
    if (!node) return;
    if (node.char !== null) {
      codes[node.char] = currentCode || "0";
      return;
    }
    generateCodes(node.left, currentCode + "0");
    generateCodes(node.right, currentCode + "1");
  }

  generateCodes(root, "");
  return { root, codes, freqs, steps };
}

// Shannon-Fano Construction
function buildShannonFano(freqs) {
  const symbols = Object.entries(freqs).sort((a, b) => b[1] - a[1]);
  const codes = {};
  symbols.forEach(([ch]) => { codes[ch] = ""; });

  function partition(syms) {
    if (syms.length <= 1) return;
    if (syms.length === 2) {
      codes[syms[0][0]] += "0";
      codes[syms[1][0]] += "1";
      return;
    }

    const total = syms.reduce((sum, item) => sum + item[1], 0);
    let running = 0;
    let splitIdx = 0;
    let minDiff = Infinity;

    for (let i = 0; i < syms.length - 1; i++) {
      running += syms[i][1];
      const diff = Math.abs(2 * running - total);
      if (diff < minDiff) {
        minDiff = diff;
        splitIdx = i;
      }
    }

    const group0 = syms.slice(0, splitIdx + 1);
    const group1 = syms.slice(splitIdx + 1);

    group0.forEach(([ch]) => { codes[ch] += "0"; });
    group1.forEach(([ch]) => { codes[ch] += "1"; });

    partition(group0);
    partition(group1);
  }

  partition(symbols);
  return codes;
}

// Load presets from data/ and src/
function loadPresets() {
  const presets = {};
  const dataDir = path.join(__dirname, 'data');
  const srcDir = path.join(__dirname, 'src');

  try {
    if (fs.existsSync(dataDir)) {
      const files = fs.readdirSync(dataDir);
      for (const file of files) {
        presets[file] = fs.readFileSync(path.join(dataDir, file), 'utf-8');
      }
    }
    if (fs.existsSync(srcDir)) {
      const pyFiles = fs.readdirSync(srcDir).filter(f => f.endsWith('.py'));
      for (const file of pyFiles) {
        presets[file] = fs.readFileSync(path.join(srcDir, file), 'utf-8');
      }
    }
  } catch (err) {
    console.error("Error reading presets:", err);
  }
  return presets;
}

// API Routes
app.get('/api/metadata', (req, res) => {
  res.json(PROJECT_METADATA);
});

app.get('/api/presets', (req, res) => {
  const presets = loadPresets();
  res.json({
    keys: Object.keys(presets),
    presets
  });
});

app.post('/api/huffman/compress', (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: "Invalid text input" });
  }

  const N = text.length;
  const { root, codes, freqs, steps } = buildHuffmanTree(text);
  const sfCodes = buildShannonFano(freqs);

  // Compute Information Theoretic Metrics
  let entropy = 0;
  let avgLen = 0;
  let sfAvgLen = 0;
  let kraftSum = 0;

  for (const [ch, count] of Object.entries(freqs)) {
    const p = count / N;
    entropy -= p * Math.log2(p);
    const l_i = (codes[ch] || "").length;
    const l_sf = (sfCodes[ch] || "").length;
    avgLen += p * l_i;
    sfAvgLen += p * l_sf;
    kraftSum += Math.pow(2, -l_i);
  }

  const redundancy = Math.max(0, avgLen - entropy);
  const uncompressedBits = N * 8;
  let compressedBits = 0;
  for (const ch of text) {
    compressedBits += (codes[ch] || "").length;
  }
  const compressionRatio = (1 - (compressedBits / uncompressedBits)) * 100;

  res.json({
    metrics: {
      inputLength: N,
      uniqueSymbols: Object.keys(freqs).length,
      uncompressedBits,
      compressedBits,
      compressionRatio: compressionRatio.toFixed(2),
      entropy: entropy.toFixed(4),
      avgLength: avgLen.toFixed(4),
      redundancy: redundancy.toFixed(4),
      kraftSum: kraftSum.toFixed(4),
      sfAvgLength: sfAvgLen.toFixed(4)
    },
    codes,
    sfCodes,
    freqs,
    tree: root,
    steps
  });
});

// Serve Vite production build if exists, or interactive_model.html
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.use(express.static(__dirname));
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'interactive_model.html'));
  });
}

app.listen(PORT, () => {
  console.log(`================================================================`);
  console.log(`  DMGT Topic 14: Optimal Prefix Codes (Huffman Coding) Server`);
  console.log(`  Node.js API & React Backend active at: http://localhost:${PORT}`);
  console.log(`  Faculty Evaluator: Dr. Priya Satish • JAIN University`);
  console.log(`================================================================`);
});
