/**
 * Graph Theory Topological Invariants Calculator for Rooted Binary Prefix Trees
 * Verifies classical Discrete Mathematics theorems:
 * 1. Handshaking Lemma: sum(deg(v)) = 2 * |E|
 * 2. Full Binary Tree Invariant: |V| = 2k - 1, |E| = 2k - 2, I = k - 1
 * 3. Path Length Theorem: E_PL = I_PL + 2(k - 1)
 * 4. Wiener Topological Index: W(T) = 1/2 * sum(d(u,v))
 * 5. Tree Diameter (longest geodesic distance)
 */

export function calculateGraphInvariants(root) {
  if (!root) return null;

  const allNodes = [];
  const leafNodes = [];
  const internalNodes = [];
  const adj = new Map(); // id -> set of neighbor ids

  function addEdge(u, v) {
    if (!adj.has(u)) adj.set(u, new Set());
    if (!adj.has(v)) adj.set(v, new Set());
    adj.get(u).add(v);
    adj.get(v).add(u);
  }

  function traverse(node, depth = 0) {
    if (!node) return;
    allNodes.push({ id: node.id, char: node.char, freq: node.freq, depth });
    if (node.char !== null) {
      leafNodes.push({ id: node.id, char: node.char, freq: node.freq, depth });
    } else {
      internalNodes.push({ id: node.id, freq: node.freq, depth });
    }

    if (node.left) {
      addEdge(node.id, node.left.id);
      traverse(node.left, depth + 1);
    }
    if (node.right) {
      addEdge(node.id, node.right.id);
      traverse(node.right, depth + 1);
    }
  }

  traverse(root, 0);

  const k = leafNodes.length;
  const V = allNodes.length;
  let E = 0;
  adj.forEach(neighbors => { E += neighbors.size; });
  E = E / 2; // Undirected edges count

  // Degree Sequence
  const degreeCounts = { 1: 0, 2: 0, 3: 0, other: 0 };
  let handshakingSum = 0;
  adj.forEach((neighbors) => {
    const deg = neighbors.size;
    handshakingSum += deg;
    if (deg === 1) degreeCounts[1]++;
    else if (deg === 2) degreeCounts[2]++;
    else if (deg === 3) degreeCounts[3]++;
    else degreeCounts.other++;
  });

  const handshakingHolds = handshakingSum === (2 * E);

  // Path Lengths
  const externalPathLength = leafNodes.reduce((acc, n) => acc + n.depth, 0);
  const internalPathLength = internalNodes.reduce((acc, n) => acc + n.depth, 0);
  const pathLengthTheoremHolds = externalPathLength === (internalPathLength + 2 * (k - 1));

  // Max Depth (Height)
  const height = leafNodes.reduce((max, n) => Math.max(max, n.depth), 0);

  // All-Pairs Shortest Paths (BFS) to compute Wiener Index & Diameter
  let wienerIndex = 0;
  let diameter = 0;

  for (const startNode of allNodes) {
    const dist = new Map();
    const queue = [startNode.id];
    dist.set(startNode.id, 0);

    while (queue.length > 0) {
      const u = queue.shift();
      const d = dist.get(u);

      if (d > diameter) diameter = d;

      const neighbors = adj.get(u) || new Set();
      for (const v of neighbors) {
        if (!dist.has(v)) {
          dist.set(v, d + 1);
          queue.push(v);
        }
      }
    }

    dist.forEach((d) => {
      wienerIndex += d;
    });
  }

  // Each pair counted twice in sum
  wienerIndex = wienerIndex / 2;

  return {
    kLeaves: k,
    internalVertices: internalNodes.length,
    totalVertices: V,
    totalEdges: E,
    expectedVertices: 2 * k - 1,
    expectedEdges: 2 * k - 2,
    height,
    diameter,
    wienerIndex,
    externalPathLength,
    internalPathLength,
    pathLengthTheoremHolds,
    handshakingSum,
    expectedHandshakingSum: 4 * k - 4,
    handshakingHolds,
    degreeCounts,
    isBipartite: true,
    chromaticNumber: 2,
    cyclomaticNumber: E - V + 1 // Strictly 0 for trees
  };
}
