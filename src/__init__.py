"""
Optimal Prefix Codes and Data Compression using Huffman Coding
Discrete Mathematics and Graph Theory (DMGT) Experiential Learning Project
"""

from src.huffman import HuffmanTree, HuffmanNode
from src.shannon_fano import ShannonFanoTree
from src.codec import HuffmanCodec
from src.merkle_huffman import MerkleHuffmanTree, MerkleHuffmanNode
from src.adaptive_huffman import AdaptiveHuffmanTree, AdaptiveHuffmanCodec

__version__ = "1.1.0"

__all__ = [
    "HuffmanTree",
    "HuffmanNode",
    "ShannonFanoTree",
    "HuffmanCodec",
    "MerkleHuffmanTree",
    "MerkleHuffmanNode",
    "AdaptiveHuffmanTree",
    "AdaptiveHuffmanCodec",
]

