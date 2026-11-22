"""
Huffman Tree Graph Visualizer using NetworkX & Matplotlib
Module: src/visualizer.py
Role: Khyathi (Visualization, Report & Presentation)
Discrete Mathematics & Graph Theory - Experiential Learning Project
"""

import os
from typing import Optional, Tuple, Dict
import networkx as nx
import matplotlib.pyplot as plt
from src.huffman import HuffmanNode


class HuffmanVisualizer:
    """
    Renders rooted binary trees with edge labels ('0' and '1') and node weights.
    Uses in-order leaf positioning to guarantee zero overlapping vertices.
    """

    @classmethod
    def build_networkx_graph(
        cls,
        root: HuffmanNode,
        max_depth: Optional[int] = None
    ) -> Tuple[nx.DiGraph, dict, dict, dict]:
        """
        Recursively converts a binary tree into a directed NetworkX graph with hierarchical in-order layout.
        Guarantees no horizontal vertex overlapping.
        """
        graph = nx.DiGraph()
        pos: Dict[int, Tuple[float, float]] = {}
        leaf_counter = [0]

        def assign_positions(node: Optional[HuffmanNode], depth: int) -> Optional[float]:
            if node is None:
                return None
            if max_depth is not None and depth > max_depth:
                return None

            is_terminal = node.is_leaf() or (max_depth is not None and depth == max_depth)
            node_id = node.node_id

            if node.is_leaf():
                display_char = repr(node.char) if node.char in ('\n', ' ', '\t') else node.char
                label = f"{display_char}\n(w={node.freq})"
                node_type = "leaf"
            else:
                label = f"w={node.freq}"
                node_type = "internal"

            graph.add_node(node_id, label=label, type=node_type, weight=node.freq)

            if is_terminal:
                x = float(leaf_counter[0]) * 2.2
                leaf_counter[0] += 1
                y = -float(depth) * 2.2
                pos[node_id] = (x, y)
                return x

            # Traverse left and right children
            left_x = assign_positions(node.left, depth + 1)
            right_x = assign_positions(node.right, depth + 1)

            if node.left and left_x is not None:
                graph.add_edge(node_id, node.left.node_id, label="0")
            if node.right and right_x is not None:
                graph.add_edge(node_id, node.right.node_id, label="1")

            if left_x is not None and right_x is not None:
                x = (left_x + right_x) / 2.0
            elif left_x is not None:
                x = left_x
            elif right_x is not None:
                x = right_x
            else:
                x = float(leaf_counter[0]) * 2.2
                leaf_counter[0] += 1

            y = -float(depth) * 2.2
            pos[node_id] = (x, y)
            return x

        assign_positions(root, 0)
        labels = nx.get_node_attributes(graph, 'label')
        edge_labels = nx.get_edge_attributes(graph, 'label')
        return graph, pos, labels, edge_labels

    @classmethod
    def plot_tree(
        cls,
        root: HuffmanNode,
        title: str = "Huffman Optimal Prefix Code Tree",
        save_path: Optional[str] = None,
        max_depth: Optional[int] = 5
    ):
        """Plots the tree with color-coded leaf and internal nodes without overlapping."""
        graph, pos, labels, edge_labels = cls.build_networkx_graph(root, max_depth=max_depth)

        # Scale figure width to match number of nodes with generous horizontal spacing
        num_nodes = len(pos)
        fig_w = max(16, int(num_nodes * 1.1))
        plt.figure(figsize=(fig_w, 9))
        plt.title(title, fontsize=14, fontweight="bold", pad=20)

        # Classify nodes for visual styling
        internal_nodes = [n for n, attr in graph.nodes(data=True) if attr['type'] == 'internal']
        leaf_nodes = [n for n, attr in graph.nodes(data=True) if attr['type'] == 'leaf']

        # Draw internal nodes (blue circular)
        nx.draw_networkx_nodes(
            graph, pos, nodelist=internal_nodes,
            node_color="#6baed6", node_size=1500, node_shape="o"
        )
        # Draw leaf nodes (green squares)
        nx.draw_networkx_nodes(
            graph, pos, nodelist=leaf_nodes,
            node_color="#74c476", node_size=1700, node_shape="s"
        )

        # Draw edges and labels
        nx.draw_networkx_edges(graph, pos, arrows=False, edge_color="#636363", width=1.5)
        nx.draw_networkx_labels(graph, pos, labels=labels, font_size=8.5, font_family="sans-serif")
        nx.draw_networkx_edge_labels(graph, pos, edge_labels=edge_labels, font_size=10, font_color="#cb181d")

        plt.axis("off")
        plt.tight_layout()

        if save_path:
            os.makedirs(os.path.dirname(save_path), exist_ok=True)
            plt.savefig(save_path, dpi=300, bbox_inches="tight")
            print(f"[OK] Saved tree visualization to: {save_path}")
        plt.close()
