"""
Merkle-Huffman Tree Implementation (Blockchain Technology Integration)
Module: src/merkle_huffman.py
Role: Nikhil (Lead) & Piyush (Verification)
Discrete Mathematics & Graph Theory - Experiential Learning Project
Programme: Blockchain Technology (CSE-BCT)

Combines optimal prefix-free binary trees (Huffman) with cryptographic Merkle hashing (SHA-256).
Enables decentralized verification, tamper-detection, and logarithmic-time inclusion proofs
for compressed state in blockchain rollups and IPFS storage.
"""

import hashlib
from typing import Dict, List, Optional, Tuple
from src.huffman import HuffmanTree, HuffmanNode


class MerkleHuffmanNode:
    """
    Represents a node in the Merkle-Huffman tree.
    - Leaves contain symbol, frequency, prefix code, and SHA-256 leaf hash.
    - Internal nodes contain combined weight, left/right pointers, and SHA-256 parent hash.
    """
    def __init__(self, char: Optional[str] = None, freq: int = 0):
        self.char: Optional[str] = char
        self.freq: int = freq
        self.code: str = ""
        self.hash: str = ""
        self.left: Optional['MerkleHuffmanNode'] = None
        self.right: Optional['MerkleHuffmanNode'] = None
        self.parent: Optional['MerkleHuffmanNode'] = None

    def is_leaf(self) -> bool:
        return self.left is None and self.right is None

    @staticmethod
    def compute_leaf_hash(char: str, freq: int, code: str) -> str:
        """
        Cryptographic leaf hash: H(LEAF:char:freq:code)
        Uses domain separation tag 'LEAF:' to prevent second-preimage attacks.
        """
        payload = f"LEAF:{char}:{freq}:{code}".encode("utf-8")
        return hashlib.sha256(payload).hexdigest()

    @staticmethod
    def compute_internal_hash(left_hash: str, right_hash: str) -> str:
        """
        Cryptographic internal node hash: H(INTERNAL:left_hash:right_hash)
        Uses domain separation tag 'INTERNAL:' to prevent structure ambiguity.
        """
        payload = f"INTERNAL:{left_hash}:{right_hash}".encode("utf-8")
        return hashlib.sha256(payload).hexdigest()


class MerkleHuffmanTree:
    """
    Constructs a Merkle-Huffman Tree from an optimal Huffman Tree.
    Calculates the root Merkle commitment and generates audit paths (Merkle proofs).
    """

    def __init__(self):
        self.root: Optional[MerkleHuffmanNode] = None
        self.leaves: Dict[str, MerkleHuffmanNode] = {}
        self.merkle_root: Optional[str] = None
        self.codes: Dict[str, str] = {}

    def build_from_huffman(self, huffman_tree: HuffmanTree) -> str:
        """
        Transforms an existing HuffmanTree into a cryptographic Merkle-Huffman tree.
        Computes leaf hashes and recursively evaluates internal Merkle hashes up to root.
        Returns the hex Merkle Root digest.
        """
        if not huffman_tree.root:
            raise ValueError("Huffman tree must be built before constructing Merkle tree.")

        self.codes = huffman_tree.get_codes()
        self.leaves.clear()

        # Step 1: Recursively clone tree topology
        self.root = self._clone_node(huffman_tree.root)

        # Step 2: Assign parent pointers and prefix codes
        self._assign_codes_and_parents(self.root, "")

        # Step 3: Compute bottom-up cryptographic hashes
        self.merkle_root = self._compute_hashes(self.root)
        return self.merkle_root

    def _clone_node(self, node: Optional[HuffmanNode]) -> Optional[MerkleHuffmanNode]:
        if not node:
            return None
        m_node = MerkleHuffmanNode(char=node.char, freq=node.freq)
        if node.is_leaf() and node.char is not None:
            self.leaves[node.char] = m_node
        m_node.left = self._clone_node(node.left)
        m_node.right = self._clone_node(node.right)
        return m_node

    def _assign_codes_and_parents(self, node: Optional[MerkleHuffmanNode], current_code: str):
        if not node:
            return

        node.code = current_code
        if node.left:
            node.left.parent = node
            self._assign_codes_and_parents(node.left, current_code + "0")
        if node.right:
            node.right.parent = node
            self._assign_codes_and_parents(node.right, current_code + "1")

        # Special case: single leaf tree
        if node.is_leaf() and not current_code:
            node.code = "0"

    def _compute_hashes(self, node: Optional[MerkleHuffmanNode]) -> str:
        """Recursively evaluates hashes from leaves up to root."""
        if not node:
            return ""

        if node.is_leaf():
            node.hash = MerkleHuffmanNode.compute_leaf_hash(
                char=node.char or "",
                freq=node.freq,
                code=node.code
            )
            return node.hash

        left_hash = self._compute_hashes(node.left)
        right_hash = self._compute_hashes(node.right)
        node.hash = MerkleHuffmanNode.compute_internal_hash(left_hash, right_hash)
        return node.hash

    def generate_inclusion_proof(self, char: str) -> List[Tuple[str, str]]:
        """
        Generates a logarithmic-time Merkle inclusion proof for a given symbol.
        Returns audit path as a list of tuples: [(sibling_hash, sibling_direction), ...]
        where direction is 'left' or 'right' indicating where the sibling sits relative to the path.
        """
        if char not in self.leaves:
            raise KeyError(f"Symbol '{char}' not present in Merkle-Huffman tree.")

        proof: List[Tuple[str, str]] = []
        current = self.leaves[char]

        while current.parent is not None:
            parent = current.parent
            if parent.left is current:
                # Current is left, sibling is right
                sibling_hash = parent.right.hash if parent.right else ""
                proof.append((sibling_hash, "right"))
            else:
                # Current is right, sibling is left
                sibling_hash = parent.left.hash if parent.left else ""
                proof.append((sibling_hash, "left"))
            current = parent

        return proof

    @staticmethod
    def verify_inclusion_proof(
        char: str,
        freq: int,
        code: str,
        proof: List[Tuple[str, str]],
        expected_root: str
    ) -> bool:
        """
        Cryptographically verifies an inclusion proof independently of the full tree.
        Computes the leaf hash and folds through sibling hashes up to the calculated root.
        Time Complexity: O(log |Sigma|).
        """
        current_hash = MerkleHuffmanNode.compute_leaf_hash(char, freq, code)

        for sibling_hash, direction in proof:
            if direction == "right":
                # Current is left child, sibling is right child
                current_hash = MerkleHuffmanNode.compute_internal_hash(current_hash, sibling_hash)
            elif direction == "left":
                # Sibling is left child, current is right child
                current_hash = MerkleHuffmanNode.compute_internal_hash(sibling_hash, current_hash)
            else:
                raise ValueError(f"Invalid proof direction: {direction}")

        return current_hash.lower() == expected_root.lower()

    def get_merkle_root(self) -> str:
        if not self.merkle_root:
            raise ValueError("Merkle tree has not been built.")
        return self.merkle_root

    def get_leaf_info(self, char: str) -> Dict[str, any]:
        """Returns verified codebook information for a symbol."""
        if char not in self.leaves:
            raise KeyError(f"Symbol '{char}' not found.")
        node = self.leaves[char]
        return {
            "char": node.char,
            "freq": node.freq,
            "code": node.code,
            "hash": node.hash
        }
