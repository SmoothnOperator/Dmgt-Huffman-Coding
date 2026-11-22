"""
Unit Tests for Adaptive (Dynamic) Huffman Coding
Module: tests/test_adaptive_huffman.py
Role: Nikhil & Piyush (DMGT Experiential Learning)
"""

import os
import sys

# Ensure project root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pytest
from src.adaptive_huffman import AdaptiveHuffmanCodec, AdaptiveHuffmanTree


@pytest.mark.parametrize("text", [
    "abracadabra",
    "bookkeeper",
    "hello world! 1234",
    "AGCTTTTCATTCTGACTGCAACGGGCAATATGTCTCTGTGTGGATTAAAAAAAGAGTGTCTGATAGCAGC",
    "The quick brown fox jumps over the lazy dog.",
    "AAAAABBBBBCCCCCDDDDD",
    "A",
    "AA",
    "ABABABABABAB"
])
def test_adaptive_roundtrip_lossless(text):
    encoded_bits = AdaptiveHuffmanCodec.encode(text)
    decoded_text = AdaptiveHuffmanCodec.decode_to_string(encoded_bits)
    assert decoded_text == text, f"Failed roundtrip for input: {text}"


def test_empty_string_adaptive():
    encoded = AdaptiveHuffmanCodec.encode("")
    assert encoded == ""
    decoded = AdaptiveHuffmanCodec.decode_to_string("")
    assert decoded == ""


def test_binary_data_adaptive():
    raw_data = bytes([0, 1, 2, 255, 128, 64, 0, 1, 2, 255])
    encoded = AdaptiveHuffmanCodec.encode(raw_data)
    decoded = AdaptiveHuffmanCodec.decode_to_bytes(encoded)
    assert decoded == raw_data


def test_adaptive_compression_on_skewed_data():
    # Long text with repeated symbols should achieve significant compression
    text = "A" * 500 + "B" * 200 + "C" * 100
    uncompressed_bits = len(text) * 8
    encoded_bits = AdaptiveHuffmanCodec.encode(text)
    
    assert len(encoded_bits) < uncompressed_bits
    decoded = AdaptiveHuffmanCodec.decode_to_string(encoded_bits)
    assert decoded == text
