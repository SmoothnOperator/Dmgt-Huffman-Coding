# Optimal Prefix Codes and Data Compression Using Huffman Coding

[![Live Demo](https://img.shields.io/badge/🌐_Live_Explorer-PrefixOptima-success?style=for-the-badge&logo=github)](https://smoothnoperator.github.io/Dmgt-Huffman-Coding/)
[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tests: Passing](https://img.shields.io/badge/tests-23%20passing-brightgreen.svg)]()
[![Course: DMGT](https://img.shields.io/badge/Course-DMGT-orange.svg)]()

> **Discrete Mathematics and Graph Theory (DMGT) — Experiential Learning Project**  
> **Programme:** Blockchain Technology (CSE-BCT)  
> **Topic 14:** Optimal Prefix Codes and Data Compression Using Huffman Coding  
> 🔗 **Live Web Application:** [https://smoothnoperator.github.io/Dmgt-Huffman-Coding/](https://smoothnoperator.github.io/Dmgt-Huffman-Coding/)

---

## 🌐 Live Interactive Web Explorer
Experience the full visual suite online without any setup: **[Launch PrefixOptima Live](https://smoothnoperator.github.io/Dmgt-Huffman-Coding/)**

1. **🌳 Studio Walk**: Interactive bit-by-bit dynamic tree walk decoder with real-time audio bit frequency synthesizer.
2. **🌲 Dual Tree Comparator**: Synchronized Huffman vs. Shannon-Fano comparative analysis with simultaneous root-to-leaf path tracing.
3. **💥 Fault Injector Lab**: 1-click single-bit shock, burst noise, and random BER error propagation simulation comparing prefix code desynchronization against fixed 8-bit ASCII.
4. **📐 Graph Invariants**: Real-time validation of Kraft-McMillan inequality ($\sum 2^{-L_i} = 1.0$), Gallager bounds, length variance, and Euler's handshaking degree sum ($\sum \deg(v) = 2|E|$).
5. **👣 Heap Simulator**: Step-by-step min-heap priority queue interactive visualization with auto-play assembly, continuous speed slider, and $\mathcal{O}(|\Sigma| \log |\Sigma|)$ complexity proofs.

---

## 📌 Executive Summary

This project presents a rigorous mathematical and computational implementation of **Huffman Coding**—an optimal prefix-free source coding scheme grounded in graph theory and discrete mathematics. By formulating the compression problem over **rooted, weighted binary trees**, we demonstrate how greedy bottom-up tree construction minimizes weighted path lengths, achieving average code lengths asymptotically approaching **Shannon's Theoretical Entropy Limit**.

The project strictly complies with all course guidelines:
* **Minimum Data Size:** All benchmark datasets exceed the required $\ge 300$ records threshold ($N \in [1031, 2001]$).
* **Quantitative Comparison:** Huffman coding is quantitatively evaluated against both **Fixed-Length 8-bit ASCII** and **Shannon-Fano Coding**.
* **Lossless Verification:** Mathematical idempotency $\mathcal{D}(\mathcal{E}(M)) = M$ is verified across all datasets.
* **Graph Visualization:** NetworkX visualizes the generated prefix trees with hierarchical layouts and edge labels (`0` and `1`).

---

## 👥 Team Task Division (6 Members)

| Member | Role | Core Deliverables |
| :--- | :--- | :--- |
| **Nikhil** | **Project Lead & Core Implementation** | Min-heap Huffman algorithm (`src/huffman.py`), Shannon-Fano baseline (`src/shannon_fano.py`), GitHub repository architecture, integration pipeline (`main.py`). |
| **Piyush** | **Encoder/Decoder & Verification** | Bit-level packing, byte serialization, tree-walk decoder (`src/codec.py`), unit testing suite (`tests/test_huffman.py`). |
| **Sakshi** | **Mathematical Formulation & Theory** | Formal DMGT theory: Rooted binary trees, Kraft-McMillan Inequality, Shannon's Source Coding Theorem, Huffman optimality proof, report methodology draft. |
| **Arushi** | **Dataset & Preprocessing** | Sourcing and cleaning 4 diverse datasets ($\ge 300$ records each: English, Code, Genomic DNA, Uniform Random), frequency table generation. |
| **Harsh** | **Experiments & Quantitative Comparison** | Experimental benchmarking (`experiments/benchmark.py`), entropy vs. code length analysis, execution scaling, generation of CSV tables and charts. |
| **Khyathi** | **Visualization, Report & Presentation** | Graph-theoretic tree visualization via NetworkX (`src/visualizer.py`), compiling the IEEE research-format report and slide deck. |

---

## 📐 Mathematical Formulation & DMGT Concepts

### 1. Rooted Binary Prefix Tree
Let $T = (V, E)$ be a directed rooted binary tree.
* **Alphabet:** $\Sigma = \{s_1, s_2, \dots, s_n\}$ of $n$ distinct symbols.
* **Weights:** Each leaf $v_i \in V$ corresponds to $s_i \in \Sigma$ with weight $w(v_i) = \text{freq}(s_i)$ and probability $p_i = \frac{w(v_i)}{N}$.
* **Internal Vertices:** Every internal node $u \in V \setminus \text{Leaves}$ has out-degree 2 (left branch labeled `'0'`, right branch labeled `'1'`).
* **Codeword Length:** The length $l_i = |c(s_i)|$ equals the depth of leaf $v_i$ from the root.

### 2. Prefix-Free Condition & Kraft-McMillan Inequality
A code is prefix-free if no codeword is a prefix of any other. For any uniquely decodable binary code:
$$\sum_{i=1}^{n} 2^{-l_i} \le 1$$
In our Huffman implementation, the Kraft sum strictly evaluates to $1.0$, proving tree completeness.

### 3. Shannon Entropy & Source Coding Theorem
The fundamental limit of lossless compression for memoryless source $X$ is defined by Shannon Entropy:
$$H(X) = -\sum_{i=1}^{n} p_i \log_2(p_i) \quad \text{(bits/symbol)}$$
Shannon's Source Coding Theorem establishes that the expected codeword length $L(C) = \sum_{i=1}^n p_i l_i$ satisfies:
$$H(X) \le L(C) < H(X) + 1$$
**Redundancy ($R$):** $R = L(C) - H(X) \ge 0$. Huffman coding mathematically minimizes $R$.

---

## 🔬 Experimental Results

### Experiment 1: Efficiency Across Diverse Data Domains
Evaluation across 4 domains (all datasets $> 1000$ symbols, exceeding the $\ge 300$ requirement):

| Dataset | Symbols ($N$) | Alphabet ($|\Sigma|$) | Entropy $H(X)$ | Huffman $L(C)$ | Shannon-Fano $L$ | Redundancy $R$ | Comp. Ratio | Space Savings |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **English Text** | 2,001 | 56 | 4.3894 | **4.4173** | 4.4178 | 0.0279 | **1.81 : 1** | 44.78% |
| **Python Code** | 1,432 | 53 | 4.3887 | **4.4106** | 4.4232 | 0.0219 | **1.81 : 1** | 44.87% |
| **Genomic DNA** | 1,031 | 29 | 2.2593 | **2.3705** | 2.3725 | 0.1113 | **3.37 : 1** | **70.37%** |
| **Uniform Random** | 1,140 | 76 | 6.2479 | **6.3158** | 6.3158 | 0.0679 | **1.27 : 1** | 21.05% |

> **Key Finding:** In Genomic DNA with skewed 4-base dominance, Huffman achieves a **3.37x compression ratio (70.37% savings)**. In all instances, Huffman achieves equal or strictly lower expected code length than Shannon-Fano ($L_{\text{Huffman}} \le L_{\text{Shannon-Fano}}$).

### Experiment 2: Algorithmic Scaling vs. Input Size ($N$)

| Input Size ($N$) | Huffman Runtime (ms) | Shannon-Fano Runtime (ms) | Huffman Average Length (bits/sym) |
| :---: | :---: | :---: | :---: |
| 300 | 0.180 ms | 0.085 ms | 4.1600 |
| 1,000 | 0.197 ms | 0.118 ms | 4.2880 |
| 5,000 | 0.401 ms | 0.292 ms | 4.4002 |
| 20,000 | 0.897 ms | 0.787 ms | 4.4166 |
| 100,000 | 3.863 ms | 3.426 ms | 4.4171 |

> **Complexity Analysis:** Tree construction runs in $\mathcal{O}(|\Sigma| \log |\Sigma|)$ using a min-heap priority queue, while bitstring encoding scales linearly $\mathcal{O}(N)$.

---

## 🚀 Installation & Usage

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/SmoothnOperator/Dmgt-Huffman-Coding.git
cd Dmgt-Huffman-Coding
pip install -r requirements.txt
```

### 2. Run the Main Demonstration Pipeline
```bash
python main.py
```

### 3. Run the Experimental Suite & Generate Plots
```bash
python experiments/benchmark.py
```
*Generated plots will be saved to `experiments/plots/`.*

### 4. Run the Test Suite
```bash
python -m pytest tests/test_huffman.py -v
```

---

## 📂 Project Structure

```text
.
├── data/                                 # Datasets (all >= 300 records)
│   ├── sample_english.txt                # English corpus (N=2001)
│   ├── sample_code.py                    # Python script (N=1432)
│   ├── sample_dna.fasta                  # Genome sequence (N=1031)
│   └── sample_uniform.txt                # Uniform random text (N=1140)
├── src/                                  # Source Code Modules
│   ├── __init__.py
│   ├── huffman.py                        # [Nikhil] Huffman min-heap tree
│   ├── shannon_fano.py                   # [Nikhil] Shannon-Fano baseline
│   ├── codec.py                          # [Piyush] Bitstream pack/unpack & decoder
│   └── visualizer.py                     # [Khyathi] NetworkX tree plotting
├── experiments/                          # [Harsh] Benchmarks & Plots
│   ├── benchmark.py                      # Experiment execution script
│   └── plots/                            # High-resolution generated charts
│       ├── exp1_entropy_vs_codelength.png
│       ├── exp2_runtime_scaling.png
│       ├── experiment1_results.csv
│       ├── experiment2_results.csv
│       └── huffman_tree_visualization.png
├── tests/                                # [Piyush/Nikhil] Unit Tests
│   └── test_huffman.py
├── main.py                               # Central execution pipeline
├── requirements.txt                      # Project dependencies
├── .gitignore
└── README.md                             # Documentation
```

---

## 📚 References

1. **Huffman, D. A.** (1952). *A Method for the Construction of Minimum-Redundancy Codes*. Proceedings of the IRE, 40(9), 1098-1101.
2. **Rosen, K. H.** (2019). *Discrete Mathematics and Its Applications* (8th ed.). McGraw-Hill Education. (Chapter 11: Trees and Tree Traversal).
3. **Shannon, C. E.** (1948). *A Mathematical Theory of Communication*. Bell System Technical Journal, 27(3), 379-423.
4. **Cover, T. M., & Thomas, J. A.** (2006). *Elements of Information Theory* (2nd ed.). Wiley-Interscience.
