"""
Unit Tests for Merkle-Huffman Cryptographic Verification
Module: tests/test_merkle_huffman.py
Role: Nikhil & Piyush (CSE-BCT Experiential Learning)
"""

import os
import sys

# Ensure project root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pytest
from src.huffman import HuffmanTree
from src.merkle_huffman import MerkleHuffmanTree, MerkleHuffmanNode


def test_merkle_root_generation():
    text = "blockchain technology and discrete mathematics"
    huffman = HuffmanTree()
    huffman.build_tree(text)

    merkle_tree = MerkleHuffmanTree()
    root_hash = merkle_tree.build_from_huffman(huffman)

    assert root_hash is not None
    assert len(root_hash) == 64  # SHA-256 hex digest length
    assert root_hash == merkle_tree.get_merkle_root()


def test_merkle_inclusion_proofs_all_symbols():
    text = "optimal prefix codes and merkle tree proofs"
    huffman = HuffmanTree()
    huffman.build_tree(text)

    merkle_tree = MerkleHuffmanTree()
    root_hash = merkle_tree.build_from_huffman(huffman)

    # Verify inclusion proof for every unique symbol in the alphabet
    for char in set(text):
        leaf_info = merkle_tree.get_leaf_info(char)
        proof = merkle_tree.generate_inclusion_proof(char)

        is_valid = MerkleHuffmanTree.verify_inclusion_proof(
            char=char,
            freq=leaf_info["freq"],
            code=leaf_info["code"],
            proof=proof,
            expected_root=root_hash
        )
        assert is_valid, f"Proof verification failed for symbol '{char}'"


def test_merkle_tamper_detection():
    text = "immutable decentralized ledger"
    huffman = HuffmanTree()
    huffman.build_tree(text)

    merkle_tree = MerkleHuffmanTree()
    root_hash = merkle_tree.build_from_huffman(huffman)

    char = "i"
    leaf_info = merkle_tree.get_leaf_info(char)
    proof = merkle_tree.generate_inclusion_proof(char)

    # 1. Tampered frequency
    assert not MerkleHuffmanTree.verify_inclusion_proof(
        char=char,
        freq=leaf_info["freq"] + 999,  # Forged frequency
        code=leaf_info["code"],
        proof=proof,
        expected_root=root_hash
    )

    # 2. Tampered codeword
    assert not MerkleHuffmanTree.verify_inclusion_proof(
        char=char,
        freq=leaf_info["freq"],
        code="111111111",  # Forged code
        proof=proof,
        expected_root=root_hash
    )

    # 3. Forged character
    assert not MerkleHuffmanTree.verify_inclusion_proof(
        char="X",  # Forged character
        freq=leaf_info["freq"],
        code=leaf_info["code"],
        proof=proof,
        expected_root=root_hash
    )

    # 4. Tampered sibling proof path
    tampered_proof = [(proof[0][0][:-4] + "0000", proof[0][1])] + proof[1:]
    assert not MerkleHuffmanTree.verify_inclusion_proof(
        char=char,
        freq=leaf_info["freq"],
        code=leaf_info["code"],
        proof=tampered_proof,
        expected_root=root_hash
    )


def test_single_symbol_merkle():
    text = "ZZZZZZZZ"
    huffman = HuffmanTree()
    huffman.build_tree(text)

    merkle_tree = MerkleHuffmanTree()
    root_hash = merkle_tree.build_from_huffman(huffman)

    assert len(root_hash) == 64
    leaf_info = merkle_tree.get_leaf_info("Z")
    # In HuffmanTree, single-symbol tree has root with left child 'Z' (code '0')
    proof = merkle_tree.generate_inclusion_proof("Z")
    assert len(proof) == 1
    assert proof[0][1] == "right"

    assert MerkleHuffmanTree.verify_inclusion_proof(
        char="Z",
        freq=leaf_info["freq"],
        code=leaf_info["code"],
        proof=proof,
        expected_root=root_hash
    )
