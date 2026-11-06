/**
 * Dynamic / Adaptive Huffman Coding (FGK & Vitter Sibling Property Algorithm)
 * 1-pass streaming data compression without prior knowledge of frequencies.
 */

class AdaptiveNode {
  constructor(char = null, weight = 0, order = 0, parent = null) {
    this.char = char; // null for internal/NYT
    this.weight = weight;
    this.order = order; // numbering for sibling property
    this.parent = parent;
    this.left = null;
    this.right = null;
    this.isNYT = false;
  }
}

export function simulateAdaptiveHuffman(text) {
  if (!text || text.length === 0) return { steps: [], finalTree: null };

  let nextOrder = 512;
  const root = new AdaptiveNode(null, 0, nextOrder--);
  root.isNYT = true;

  let nytNode = root;
  const seenLeaves = new Map(); // char -> AdaptiveNode
  const steps = [];

  // Helper: get code by walking up to root
  function getCode(node) {
    let code = "";
    let curr = node;
    while (curr.parent) {
      if (curr.parent.left === curr) code = "0" + code;
      else code = "1" + code;
      curr = curr.parent;
    }
    return code || "0";
  }

  // Helper: find highest numbered node with same weight (excluding parent)
  function findHighestNodeWithWeight(startNode, targetWeight, rootNode) {
    const nodes = [];
    function collect(n) {
      if (!n) return;
      nodes.push(n);
      collect(n.left);
      collect(n.right);
    }
    collect(rootNode);

    // Candidates must have same weight, higher order, and not be ancestor
    const candidates = nodes.filter(n => 
      n !== startNode && 
      n !== startNode.parent && 
      n.weight === targetWeight && 
      n.order > startNode.order
    );

    if (candidates.length === 0) return null;
    candidates.sort((a, b) => b.order - a.order);
    return candidates[0];
  }

  // Helper: swap two nodes
  function swapNodes(n1, n2) {
    const p1 = n1.parent;
    const p2 = n2.parent;

    const isN1Left = (p1.left === n1);
    const isN2Left = (p2.left === n2);

    if (isN1Left) p1.left = n2;
    else p1.right = n2;

    if (isN2Left) p2.left = n1;
    else p2.right = n1;

    n1.parent = p2;
    n2.parent = p1;

    // Swap their order numbers to maintain index consistency
    const tempOrder = n1.order;
    n1.order = n2.order;
    n2.order = tempOrder;
  }

  // Process text streaming character by character
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const isNew = !seenLeaves.has(ch);
    let emittedCode = "";
    const swapsInStep = [];

    if (isNew) {
      // 1. Emit NYT code + 8-bit ASCII
      const nytCode = getCode(nytNode);
      const rawAscii = ch.charCodeAt(0).toString(2).padStart(8, '0');
      emittedCode = (nytCode === "0" && root === nytNode) ? rawAscii : `${nytCode} + [ASCII: ${rawAscii}]`;

      // 2. Split NYT node
      const oldNYT = nytNode;
      oldNYT.isNYT = false;

      const newNYT = new AdaptiveNode(null, 0, nextOrder--, oldNYT);
      newNYT.isNYT = true;

      const newLeaf = new AdaptiveNode(ch, 1, nextOrder--, oldNYT);
      seenLeaves.set(ch, newLeaf);

      oldNYT.left = newNYT;
      oldNYT.right = newLeaf;
      oldNYT.weight = 1;
      nytNode = newNYT;

      // Start updating from oldNYT's parent
      let curr = oldNYT.parent;
      while (curr) {
        const swapTarget = findHighestNodeWithWeight(curr, curr.weight, root);
        if (swapTarget && swapTarget !== curr.parent) {
          swapsInStep.push(`Swapped Node #${curr.order} with Node #${swapTarget.order}`);
          swapNodes(curr, swapTarget);
        }
        curr.weight++;
        curr = curr.parent;
      }

    } else {
      // Seen symbol: emit current Huffman codeword
      const leaf = seenLeaves.get(ch);
      emittedCode = getCode(leaf);

      // Sibling property check & weight increment
      let curr = leaf;
      while (curr) {
        const swapTarget = findHighestNodeWithWeight(curr, curr.weight, root);
        if (swapTarget && swapTarget !== curr.parent) {
          swapsInStep.push(`Swapped Node #${curr.order} with Node #${swapTarget.order} to satisfy Sibling Property`);
          swapNodes(curr, swapTarget);
        }
        curr.weight++;
        curr = curr.parent;
      }
    }

    // Capture serializable snapshot of the tree
    function serializeTree(n) {
      if (!n) return null;
      return {
        id: n.order,
        char: n.char,
        weight: n.weight,
        isNYT: n.isNYT,
        left: serializeTree(n.left),
        right: serializeTree(n.right)
      };
    }

    steps.push({
      step: i + 1,
      char: ch,
      isNew,
      emittedCode,
      swaps: swapsInStep,
      treeSnapshot: serializeTree(root),
      distinctSymbols: seenLeaves.size
    });
  }

  return {
    steps,
    totalChars: text.length,
    finalTree: steps[steps.length - 1]?.treeSnapshot
  };
}
