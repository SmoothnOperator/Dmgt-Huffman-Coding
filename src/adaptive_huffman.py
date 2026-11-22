"""
Adaptive (Dynamic) Huffman Coding (FGK / Vitter Algorithm)
Module: src/adaptive_huffman.py
Role: Nikhil (Lead) & Piyush (Verification)
Discrete Mathematics & Graph Theory - Experiential Learning Project

Implements single-pass adaptive Huffman coding with the Sibling Property.
Eliminates the need for a two-pass frequency table header, enabling streaming
data compression where the prefix tree dynamically restructures on the fly.
"""

from typing import Dict, List, Optional, Tuple, Union


class AdaptiveNode:
    """
    Node in the Adaptive Huffman Tree.
    Maintains weight, order, and tree connectivity pointers.
    """
    def __init__(self, symbol: Optional[int] = None, weight: int = 0, order: int = 0):
        self.symbol: Optional[int] = symbol  # Byte value 0..255 or None for internal/NYT
        self.weight: int = weight
        self.order: int = order
        self.parent: Optional['AdaptiveNode'] = None
        self.left: Optional['AdaptiveNode'] = None   # Edge '0'
        self.right: Optional['AdaptiveNode'] = None  # Edge '1'

    def is_leaf(self) -> bool:
        return self.left is None and self.right is None


class AdaptiveHuffmanTree:
    """
    Adaptive Huffman Tree maintaining the Sibling Property:
    Nodes can be ordered in non-increasing weight sequence such that adjacent nodes are siblings.
    """
    MAX_ORDER = 512

    def __init__(self):
        # NYT (Not Yet Transmitted) zero-weight anchor node
        self.nyt: AdaptiveNode = AdaptiveNode(symbol=None, weight=0, order=self.MAX_ORDER)
        self.root: AdaptiveNode = self.nyt
        self.nodes_by_order: List[Optional[AdaptiveNode]] = [None] * (self.MAX_ORDER + 1)
        self.nodes_by_order[self.MAX_ORDER] = self.nyt
        self.seen_symbols: Dict[int, AdaptiveNode] = {}

    def get_code_for_node(self, target: AdaptiveNode) -> str:
        """Finds root-to-node path: '0' for left edge, '1' for right edge."""
        bits = []
        curr = target
        while curr.parent is not None:
            parent = curr.parent
            if parent.left is curr:
                bits.append("0")
            else:
                bits.append("1")
            curr = parent
        bits.reverse()
        return "".join(bits)

    def _find_highest_order_in_block(self, weight: int) -> Optional[AdaptiveNode]:
        """Finds the node with highest order among all nodes with the same weight."""
        for order in range(self.MAX_ORDER, 0, -1):
            node = self.nodes_by_order[order]
            if node and node.weight == weight:
                return node
        return None

    def _swap_nodes(self, a: AdaptiveNode, b: AdaptiveNode):
        """Swaps two nodes in the tree while preserving sibling property and orders."""
        if a is b or a.parent is b or b.parent is a:
            return

        p_a, p_b = a.parent, b.parent
        if not p_a or not p_b:
            return

        # Swap parent child pointers
        if p_a.left is a:
            p_a.left = b
        else:
            p_a.right = b

        if p_b.left is b:
            p_b.left = a
        else:
            p_b.right = a

        # Swap parent references
        a.parent, b.parent = p_b, p_a

        # Swap orders and register in lookup table
        order_a, order_b = a.order, b.order
        a.order, b.order = order_b, order_a
        self.nodes_by_order[a.order] = a
        self.nodes_by_order[b.order] = b

    def update(self, symbol: int):
        """
        Updates the tree after processing symbol according to the FGK algorithm.
        Maintains the Sibling Property through node swaps and weight increments.
        """
        curr: Optional[AdaptiveNode] = None

        if symbol not in self.seen_symbols:
            # Split the NYT node
            old_nyt = self.nyt
            k = old_nyt.order

            # Internal node replaces old NYT
            internal = old_nyt
            internal.symbol = None

            # New NYT as left child
            new_nyt = AdaptiveNode(symbol=None, weight=0, order=k - 2)
            new_nyt.parent = internal
            internal.left = new_nyt

            # New leaf for symbol as right child
            new_leaf = AdaptiveNode(symbol=symbol, weight=1, order=k - 1)
            new_leaf.parent = internal
            internal.right = new_leaf

            self.nodes_by_order[k - 2] = new_nyt
            self.nodes_by_order[k - 1] = new_leaf
            self.nyt = new_nyt
            self.seen_symbols[symbol] = new_leaf

            # Internal node gets weight incremented in the bottom-up climb
            internal.weight = 0
            curr = internal
        else:
            curr = self.seen_symbols[symbol]

        # Climb to root, restoring sibling property at each level
        while curr is not None:
            highest = self._find_highest_order_in_block(curr.weight)
            if highest and highest is not curr and highest is not curr.parent and highest is not self.root:
                self._swap_nodes(curr, highest)

            curr.weight += 1
            curr = curr.parent


class AdaptiveHuffmanCodec:
    """
    Streaming Encoder and Decoder for Adaptive Huffman Coding.
    Achieves 100% lossless compression without out-of-band headers.
    """

    @classmethod
    def encode(cls, data: Union[str, bytes]) -> str:
        """
        Encodes plaintext or raw bytes into a continuous bitstring.
        Emits NYT code + 8-bit literal for unseen symbols, and tree code for seen symbols.
        """
        if isinstance(data, str):
            raw_bytes = data.encode("utf-8")
        else:
            raw_bytes = data

        if not raw_bytes:
            return ""

        tree = AdaptiveHuffmanTree()
        bit_chunks: List[str] = []

        for byte_val in raw_bytes:
            if byte_val in tree.seen_symbols:
                # Transmit existing prefix code
                code = tree.get_code_for_node(tree.seen_symbols[byte_val])
                bit_chunks.append(code)
            else:
                # Transmit NYT prefix code followed by fixed 8-bit byte representation
                if tree.root is tree.nyt:
                    # Root is only NYT, path is empty
                    nyt_code = ""
                else:
                    nyt_code = tree.get_code_for_node(tree.nyt)

                literal_bits = f"{byte_val:08b}"
                bit_chunks.append(nyt_code + literal_bits)

            tree.update(byte_val)

        return "".join(bit_chunks)

    @classmethod
    def decode_to_bytes(cls, bitstring: str) -> bytes:
        """Decodes an encoded bitstring back into raw bytes."""
        if not bitstring:
            return b""

        tree = AdaptiveHuffmanTree()
        output_bytes = bytearray()
        pos = 0
        n = len(bitstring)

        while pos < n:
            curr = tree.root

            if curr.is_leaf() and curr is tree.nyt:
                # First symbol in fresh tree
                literal_bits = bitstring[pos:pos + 8]
                pos += 8
                symbol = int(literal_bits, 2)
                output_bytes.append(symbol)
                tree.update(symbol)
                continue

            # Traverse tree according to bitstream
            while not curr.is_leaf() and pos < n:
                bit = bitstring[pos]
                pos += 1
                curr = curr.left if bit == "0" else curr.right

            if curr is tree.nyt:
                # Read 8-bit uncompressed literal
                literal_bits = bitstring[pos:pos + 8]
                pos += 8
                symbol = int(literal_bits, 2)
                output_bytes.append(symbol)
                tree.update(symbol)
            else:
                symbol = curr.symbol
                if symbol is not None:
                    output_bytes.append(symbol)
                    tree.update(symbol)

        return bytes(output_bytes)

    @classmethod
    def decode_to_string(cls, bitstring: str, encoding: str = "utf-8") -> str:
        """Decodes an encoded bitstring back into string."""
        raw_bytes = cls.decode_to_bytes(bitstring)
        return raw_bytes.decode(encoding)
