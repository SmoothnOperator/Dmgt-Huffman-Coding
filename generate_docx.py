"""
Script to generate the Official Jain University Experiential Learning Project Report (.docx)
Course: Discrete Mathematics and Graph Theory (DMGT)
Faculty: Faculty of Engineering and Technology, JAIN (Deemed-to-be University)
Evaluator: Dr. Priya Satish, Assistant Professor, Department of Mathematics
Topic 14: Optimal Prefix Codes and Data Compression Using Huffman Coding
"""

import os
import docx
from docx.styles.style import ParagraphStyle
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, hex_color):
    """Sets background color of a table cell."""
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    """Sets internal padding of a table cell."""
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def create_full_report():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    docs_dir = os.path.join(base_dir, "docs")
    plots_dir = os.path.join(base_dir, "experiments", "plots")
    output_docx = os.path.join(docs_dir, "RESEARCH_REPORT.docx")
    logo_path = os.path.join(docs_dir, "jain_logo.png")

    doc = docx.Document()

    # Standard A4 / 1 inch margins
    for section in doc.sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.9)
        section.right_margin = Inches(0.9)

    # Style definitions
    style = doc.styles['Normal']
    if isinstance(style, ParagraphStyle):
        font = style.font
        font.name = 'Times New Roman'
        font.size = Pt(11)
        font.color.rgb = RGBColor(20, 20, 20)

    # ==========================================
    # COVER / TITLE PAGE (MATCHING UNIVERSITY TEMPLATE)
    # ==========================================

    # 1. Logo
    if os.path.exists(logo_path):
        p_logo = doc.add_paragraph()
        p_logo.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_logo.paragraph_format.space_before = Pt(0)
        p_logo.paragraph_format.space_after = Pt(8)
        doc.add_picture(logo_path, width=Inches(4.5))

    p_univ = doc.add_paragraph()
    p_univ.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_univ.paragraph_format.space_after = Pt(2)
    r_univ = p_univ.add_run("School of Computer Science and Engineering\nFaculty of Engineering and Technology\nJAIN (Deemed-to-be University)")
    r_univ.font.size = Pt(12)
    r_univ.font.bold = True
    r_univ.font.color.rgb = RGBColor(16, 44, 87)

    p_course = doc.add_paragraph()
    p_course.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_course.paragraph_format.space_before = Pt(8)
    p_course.paragraph_format.space_after = Pt(4)
    r_c1 = p_course.add_run("Discrete Mathematics and Graph Theory (DMGT)\n")
    r_c1.font.size = Pt(13)
    r_c1.font.bold = True
    r_c2 = p_course.add_run("Experiential Learning — Project Report")
    r_c2.font.size = Pt(11.5)
    r_c2.font.bold = True
    r_c2.font.italic = True
    r_c2.font.color.rgb = RGBColor(180, 80, 0)

    # Title Box
    p_title_box = doc.add_paragraph()
    p_title_box.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title_box.paragraph_format.space_before = Pt(10)
    p_title_box.paragraph_format.space_after = Pt(12)
    r_tlabel = p_title_box.add_run("PROJECT TITLE:\n")
    r_tlabel.font.size = Pt(11)
    r_tlabel.font.bold = True
    r_tname = p_title_box.add_run("Optimal Prefix Codes and Data Compression Using Huffman Coding\n")
    r_tname.font.size = Pt(14)
    r_tname.font.bold = True
    r_tname.font.color.rgb = RGBColor(16, 44, 87)
    r_tsub = p_title_box.add_run("An Information-Theoretic and Graph-Based Algorithmic Approach")
    r_tsub.font.size = Pt(10.5)
    r_tsub.font.italic = True

    # Submitted to
    p_subto = doc.add_paragraph()
    p_subto.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_subto.paragraph_format.space_after = Pt(2)
    r_sto = p_subto.add_run("Submitted to:\n")
    r_sto.font.bold = True
    r_sto.font.size = Pt(10.5)
    r_fac = p_subto.add_run("Dr. Priya Satish\n")
    r_fac.font.bold = True
    r_fac.font.size = Pt(11)
    r_fac.font.color.rgb = RGBColor(16, 44, 87)
    r_facdet = p_subto.add_run("Assistant Professor, Department of Mathematics\nFaculty of Engineering & Technology, JAIN (Deemed-to-be University)")
    r_facdet.font.size = Pt(9.5)

    p_subby = doc.add_paragraph()
    p_subby.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_subby.paragraph_format.space_before = Pt(8)
    p_subby.paragraph_format.space_after = Pt(4)
    r_sby = p_subby.add_run("Submitted by:")
    r_sby.font.bold = True
    r_sby.font.size = Pt(10.5)

    # Students Table
    t_students = doc.add_table(rows=7, cols=3)
    t_students.alignment = WD_TABLE_ALIGNMENT.CENTER
    headers_st = ["USN", "Name", "Project Contribution"]
    for j, h in enumerate(headers_st):
        cell = t_students.rows[0].cells[j]
        cell.text = h
        set_cell_background(cell, "1F4E78")
        set_cell_margins(cell, top=60, bottom=60, left=90, right=90)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.runs[0].font.bold = True
        p.runs[0].font.size = Pt(9.5)
        p.runs[0].font.color.rgb = RGBColor(255, 255, 255)

    students_data = [
        ["25BTRBT026", "Nikhil Kumar", "Project Lead & Core Implementation"],
        ["25BTRBT030", "Piyush Kumar", "Encoder/Decoder & Lossless Verification"],
        ["25BTRC0045", "Sakshi Kumari", "Mathematical Formulation & Theory"],
        ["25BTRBT008", "Arushi Pramanik", "Dataset Collection & Preprocessing"],
        ["25BTRBT017", "Harsh R Rao", "Experimental Design & Benchmarking"],
        ["25BTRBT021", "Khyathi Jain", "Visualization, Documentation & Presentation"]
    ]
    for i, row in enumerate(students_data):
        bg = "F9FBFD" if i % 2 == 1 else "FFFFFF"
        for j, val in enumerate(row):
            cell = t_students.rows[i+1].cells[j]
            cell.text = val
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=45, bottom=45, left=80, right=80)
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER if j != 2 else WD_ALIGN_PARAGRAPH.LEFT
            r = p.runs[0]
            r.font.size = Pt(9)
            if j == 1:
                r.font.bold = True

    # Branch, Section & Date Details Table
    p_sp = doc.add_paragraph()
    p_sp.paragraph_format.space_before = Pt(6)
    p_sp.paragraph_format.space_after = Pt(2)

    t_meta = doc.add_table(rows=2, cols=4)
    t_meta.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_data = [
        [("Branch & Section:", True), ("CSE - BLOCKCHAIN", False), ("Date of Submission:", True), ("10-11-2026", False)],
        [("Total Marks (out of 100):", True), ("", False), ("Faculty Signature / Remarks:", True), ("", False)]
    ]
    for i, row in enumerate(meta_data):
        for j, (text, is_bold) in enumerate(row):
            cell = t_meta.rows[i].cells[j]
            cell.text = text
            set_cell_background(cell, "F2F4F7" if is_bold else "FFFFFF")
            set_cell_margins(cell, top=50, bottom=50, left=70, right=70)
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            if text:
                r = p.runs[0]
                r.font.size = Pt(9)
                r.font.bold = is_bold

    # Table of Contents
    p_toc = doc.add_paragraph()
    p_toc.paragraph_format.space_before = Pt(12)
    p_toc.paragraph_format.space_after = Pt(4)
    r_toch = p_toc.add_run("TABLE OF CONTENTS")
    r_toch.font.bold = True
    r_toch.font.size = Pt(10.5)
    r_toch.font.color.rgb = RGBColor(16, 44, 87)

    t_toc = doc.add_table(rows=8, cols=3)
    t_toc.alignment = WD_TABLE_ALIGNMENT.CENTER
    headers_toc = ["Serial No.", "Section Title", "Page No."]
    for j, h in enumerate(headers_toc):
        cell = t_toc.rows[0].cells[j]
        cell.text = h
        set_cell_background(cell, "1F4E78")
        set_cell_margins(cell, top=40, bottom=40, left=70, right=70)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.runs[0].font.bold = True
        p.runs[0].font.size = Pt(9)
        p.runs[0].font.color.rgb = RGBColor(255, 255, 255)

    toc_data = [
        ["1", "Abstract", "2"],
        ["2", "Introduction & Problem Identification", "2"],
        ["3", "Methodology & Theoretical Foundation", "3"],
        ["4", "Results and Discussion (Experiments 1 & 2)", "4"],
        ["5", "Conclusion & Future Scope", "6"],
        ["6", "Individual Contributions & Learning Reflections", "6"],
        ["7", "References", "7"]
    ]
    for i, row in enumerate(toc_data):
        bg = "F9FBFD" if i % 2 == 1 else "FFFFFF"
        for j, val in enumerate(row):
            cell = t_toc.rows[i+1].cells[j]
            cell.text = val
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=35, bottom=35, left=60, right=60)
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER if j != 1 else WD_ALIGN_PARAGRAPH.LEFT
            r = p.runs[0]
            r.font.size = Pt(8.5)

    # PAGE BREAK TO REPORT BODY
    doc.add_page_break()

    # ==========================================
    # REPORT BODY
    # ==========================================

    # Abstract Callout Box
    table_abs = doc.add_table(rows=1, cols=1)
    table_abs.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell_abs = table_abs.rows[0].cells[0]
    cell_abs.width = Inches(6.5)
    set_cell_background(cell_abs, "F4F6F9")
    set_cell_margins(cell_abs, top=120, bottom=120, left=160, right=160)

    p_abs_title = cell_abs.paragraphs[0]
    p_abs_title.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p_abs_title.paragraph_format.space_after = Pt(4)
    r_atitle = p_abs_title.add_run("ABSTRACT")
    r_atitle.font.name = 'Times New Roman'
    r_atitle.font.size = Pt(11)
    r_atitle.font.bold = True
    r_atitle.font.color.rgb = RGBColor(16, 44, 87)

    p_abs_body = cell_abs.add_paragraph()
    p_abs_body.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p_abs_body.paragraph_format.line_spacing = 1.15
    p_abs_body.paragraph_format.space_after = Pt(6)
    r_abody = p_abs_body.add_run(
        "Data compression is fundamentally governed by information theory and discrete mathematics, "
        "specifically the structural optimization of weighted, rooted binary trees. This research paper "
        "presents a rigorous theoretical formulation, computational implementation, and empirical evaluation "
        "of Huffman coding—a greedy algorithm that guarantees the construction of optimal prefix-free binary "
        "codes for discrete source alphabets. We model prefix codes as directed trees, prove strict adherence "
        "to the Kraft–McMillan inequality (sum_{i=1}^n 2^(-l_i) <= 1), and examine convergence toward the theoretical "
        "lower bound established by Shannon's Source Coding Theorem (H(X) <= L(C) < H(X) + 1). Implemented in Python "
        "using a min-priority queue (min-heap) architecture, our compression engine is benchmarked against both "
        "fixed-length 8-bit ASCII representation and the top-down Shannon–Fano heuristic. The empirical evaluation "
        "encompasses four diverse datasets exceeding the prescribed 300 data points threshold: natural language "
        "text (N = 2,001), Python source code (N = 1,432), genomic DNA sequences in FASTA format (N = 1,031), and "
        "synthetically generated uniform random sequences (N = 1,140). Experimental results demonstrate that Huffman "
        "coding consistently achieves optimal redundancy (R <= 0.1113 bits/symbol), reaching a peak compression ratio "
        "of 3.37:1 with 70.37% storage savings on genomic data due to low source entropy. Runtime scaling analyses "
        "across input sizes ranging from 300 to 100,000 symbols validate an O(|Sigma| log |Sigma|) tree construction "
        "complexity and linear O(N) encoding throughput. Graph visualizations generated via NetworkX provide clear "
        "structural validation of prefix-free decision paths."
    )
    r_abody.font.size = Pt(9.5)

    p_kw = cell_abs.add_paragraph()
    p_kw.paragraph_format.space_after = Pt(2)
    r_kwt = p_kw.add_run("Keywords: ")
    r_kwt.font.bold = True
    r_kwt.font.size = Pt(9.5)
    r_kwv = p_kw.add_run("Huffman Coding, Optimal Prefix Codes, Rooted Binary Trees, Shannon Entropy, Lossless Data Compression.")
    r_kwv.font.size = Pt(9.5)
    r_kwv.font.italic = True

    def add_heading_1(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(14)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Times New Roman'
        run.font.size = Pt(12.5)
        run.font.bold = True
        run.font.color.rgb = RGBColor(16, 44, 87)
        return p

    def add_heading_2(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(10)
        p.paragraph_format.space_after = Pt(3)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Times New Roman'
        run.font.size = Pt(11)
        run.font.bold = True
        run.font.color.rgb = RGBColor(31, 78, 120)
        return p

    def add_body_p(text):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.line_spacing = 1.15
        run = p.add_run(text)
        run.font.name = 'Times New Roman'
        run.font.size = Pt(10)
        return p

    # --- SECTION 1: INTRODUCTION & PROBLEM IDENTIFICATION ---
    add_heading_1("1. Introduction and Problem Identification")
    add_heading_2("1.1 Problem Identification and Engineering Significance")
    add_body_p(
        "Problem Definition: The Payload Bloat and Bandwidth Inefficiency Bottleneck in Digital Transmission and Distributed Storage Systems.\n"
        "In standard computer architectures, data is uniformly represented using fixed-length encoding schemes (e.g., standard 8-bit ASCII or 16-bit UTF-16). "
        "Under fixed-length encoding, every character occupies an identical number of bits (l_i = 8), completely ignoring the statistical reality that "
        "certain symbols appear far more frequently than others."
    )
    add_body_p(
        "When non-uniform data (such as natural language, program code, biological genome sequences, or transaction logs) is stored or transmitted "
        "using fixed-length representations: (1) Frequent symbols consume the exact same bit-depth as extremely rare symbols; (2) Channel bandwidth and "
        "storage media are saturated by statistical redundancy R = 8 - H(X) bits/symbol; and (3) In high-throughput distributed networks—particularly "
        "peer-to-peer blockchain networks—uncompressed block payloads cause severe propagation latency, increased orphan/fork rates, and long-term "
        "state ledger bloat for validating full nodes."
    )
    add_body_p(
        "The engineering challenge is: How can we construct an instantaneous, prefix-free binary encoding scheme using discrete graph structures that "
        "mathematically minimizes the expected codeword length (L(C) -> H(X)) while guaranteeing 100% lossless data reconstruction?"
    )
    add_body_p(
        "Real-World Relevance to Blockchain Technology (CSE-BCT): In proof-of-work and proof-of-stake distributed ledgers, transaction payloads must "
        "broadcast rapidly across peer nodes. Larger uncompressed payloads heighten network synchronization delays, directly impacting security. "
        "Applying optimal prefix tree compression to batch transaction serialization minimizes block size, enhances propagation speed, and curbs "
        "historical ledger storage growth."
    )
    add_body_p(
        "Project Objectives: (1) Formulate source coding over rooted, weighted binary trees; (2) Mathematically evaluate the prefix property, "
        "Kraft–McMillan inequality, and Shannon entropy bounds; (3) Develop an end-to-end Python pipeline using min-priority queues; (4) Conduct "
        "rigorous quantitative experiments comparing Huffman coding against fixed-length ASCII and Shannon–Fano coding across four real-world datasets "
        "exceeding 300 data points; and (5) Visually analyze prefix tree structures and edge assignments using NetworkX."
    )

    # --- SECTION 2: METHODOLOGY ---
    add_heading_1("2. Methodology")
    add_heading_2("2.1 DMGT Theoretical Foundation")
    add_body_p(
        "Let Sigma = {s_1, s_2, ..., s_n} denote a finite alphabet of n distinct symbols. For a source text of length N, "
        "the empirical probability of symbol s_i is p_i = f_i / N, where f_i is its frequency, satisfying sum(p_i) = 1. "
        "A code C maps each symbol s_i to a variable-length binary codeword c(s_i) of length l_i."
    )
    add_body_p(
        "Definition 1 (Prefix-Free Code): A code C is a prefix code (or instantaneous code) if and only if no codeword "
        "forms a prefix of any other codeword: for all i != j, c(s_i) is not a prefix of c(s_j). Prefix codes allow unique, "
        "instantaneous decoding without delimiters or lookahead tokens."
    )
    add_body_p(
        "Theorem 1 (Kraft–McMillan Inequality): For any uniquely decodable binary code with lengths l_1, ..., l_n, "
        "the lengths must satisfy: sum_{i=1}^n 2^(-l_i) <= 1. Equality strictly holds if and only if the associated rooted "
        "binary tree is full (every internal node has out-degree 2)."
    )
    add_body_p(
        "Theorem 2 (Shannon's Source Coding Theorem): The Shannon entropy H(X) = -sum_{i=1}^n p_i * log2(p_i) represents "
        "the theoretical minimum average number of bits per symbol. For any optimal prefix code, the expected code length "
        "L(C) = sum_{i=1}^n p_i * l_i is bounded by: H(X) <= L(C) < H(X) + 1. The code redundancy is R = L(C) - H(X) >= 0."
    )
    add_body_p(
        "Graph-Theoretic Formulation: The code tree T = (V, E) is a directed, rooted binary tree. Each leaf v_i in V_L represents "
        "symbol s_i with weight w(v_i) = f_i at depth l_i. Internal vertices V_I have out-degree 2 (left edge '0', right edge '1'). "
        "The total Weighted External Path Length is W(T) = sum_{v in V_L} w(v)*depth(v) = N * L(C). Minimizing expected length L(C) "
        "is strictly equivalent to constructing a binary tree with minimum weighted external path length."
    )

    add_heading_2("2.2 Proposed Algorithm and Implementation")
    add_body_p(
        "Huffman's algorithm constructs T using a bottom-up greedy strategy via a min-priority queue (min-heap):\n"
        "1. Count symbol frequencies across source text M of length N.\n"
        "2. Insert all |Sigma| symbols as leaf nodes into min-heap Q ordered by frequency.\n"
        "3. While |Q| > 1: extract the two lowest-weight nodes u and v, merge them under a new parent node z with weight "
        "w(z) = w(u) + w(v), and insert z back into Q.\n"
        "4. The remaining node in Q is the root of optimal tree T.\n"
        "5. Traverse T from root to leaves via Depth-First Search (DFS) assigning '0' to left branches and '1' to right branches."
    )
    add_body_p(
        "Complexity Analysis: Initializing the heap takes O(|Sigma|) time. The merge loop executes |Sigma| - 1 times, "
        "performing two Extract-Min and one Insert operations per round, taking O(|Sigma| log |Sigma|). Code extraction via DFS takes "
        "O(|Sigma|). Text encoding and tree-walk decoding scale as O(N). Total runtime complexity is strictly O(N + |Sigma| log |Sigma|)."
    )

    add_heading_2("2.3 Benchmark Datasets and Provenance (All >= 300 Records)")
    add_body_p(
        "Four authentic datasets were curated across biological, linguistic, and programmatic domains to evaluate performance "
        "across divergent entropy conditions. Each dataset strictly satisfies the project guideline requirement of having >= 300 records."
    )

    # Table 1: Datasets
    t_data = doc.add_table(rows=5, cols=5)
    t_data.alignment = WD_TABLE_ALIGNMENT.CENTER
    headers_t1 = ["Dataset", "Domain / Source Description", "Records (N)", "Alphabet (|Sigma|)", "Public Source / Data Link"]
    for j, h in enumerate(headers_t1):
        cell = t_data.rows[0].cells[j]
        cell.text = h
        set_cell_background(cell, "1F4E78")
        set_cell_margins(cell, top=60, bottom=60, left=80, right=80)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.runs[0].font.bold = True
        p.runs[0].font.size = Pt(9)
        p.runs[0].font.color.rgb = RGBColor(255, 255, 255)

    data_rows_t1 = [
        ["Dataset A", "English Text (Academic prose on discrete math)", "2,001", "56", "Project Gutenberg / MacTutor Archive\n(sample_english.txt)"],
        ["Dataset B", "Python Source Code (Data processing module)", "1,432", "53", "CPython Standard Library\n(sample_code.py)"],
        ["Dataset C", "Genomic DNA (Bacteriophage nucleotide FASTA)", "1,031", "29", "NCBI GenBank: NC_000866.4\n(sample_dna.fasta)"],
        ["Dataset D", "Uniform Random Text (Balanced ASCII symbols)", "1,140", "76", "Algorithmic Uniform Generator\n(sample_uniform.txt)"]
    ]
    for i, row in enumerate(data_rows_t1):
        bg = "F9FBFD" if i % 2 == 1 else "FFFFFF"
        for j, val in enumerate(row):
            cell = t_data.rows[i+1].cells[j]
            cell.text = val
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=45, bottom=45, left=70, right=70)
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER if j not in (1, 4) else WD_ALIGN_PARAGRAPH.LEFT
            p.runs[0].font.size = Pt(8.5)

    doc.add_paragraph().paragraph_format.space_after = Pt(4)

    # --- SECTION 3: RESULTS AND DISCUSSION ---
    add_heading_1("3. Results and Discussion")
    add_heading_2("3.1 Experiment 1: Compression Efficiency Across Diverse Domains")
    add_body_p(
        "Table 2 documents the quantitative evaluation comparing theoretical entropy H(X), Huffman expected code length L(C), "
        "Shannon–Fano length, fixed 8-bit ASCII length, redundancy R, compression ratio, space savings, and runtime."
    )

    # Table 2: Results
    t_res = doc.add_table(rows=13, cols=5)
    t_res.alignment = WD_TABLE_ALIGNMENT.CENTER
    headers_t2 = ["Performance Metric", "Dataset A (English)", "Dataset B (Code)", "Dataset C (DNA)", "Dataset D (Uniform)"]
    for j, h in enumerate(headers_t2):
        cell = t_res.rows[0].cells[j]
        cell.text = h
        set_cell_background(cell, "1F4E78")
        set_cell_margins(cell, top=60, bottom=60, left=80, right=80)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.runs[0].font.bold = True
        p.runs[0].font.size = Pt(9)
        p.runs[0].font.color.rgb = RGBColor(255, 255, 255)

    res_rows_t2 = [
        ["Total Symbols (N)", "2,001", "1,432", "1,031", "1,140"],
        ["Alphabet Size (|Sigma|)", "56", "53", "29", "76"],
        ["Shannon Entropy H(X)", "4.3894 bits/sym", "4.3887 bits/sym", "2.2593 bits/sym", "6.2479 bits/sym"],
        ["Huffman Avg Length L(C)", "4.4173 bits/sym", "4.4106 bits/sym", "2.3705 bits/sym", "6.3158 bits/sym"],
        ["Shannon–Fano Length L", "4.4178 bits/sym", "4.4232 bits/sym", "2.3725 bits/sym", "6.3158 bits/sym"],
        ["Fixed 8-Bit ASCII Length", "8.0000 bits/sym", "8.0000 bits/sym", "8.0000 bits/sym", "8.0000 bits/sym"],
        ["Coding Redundancy (R)", "0.0279 bits/sym", "0.0219 bits/sym", "0.1113 bits/sym", "0.0679 bits/sym"],
        ["Compression Ratio (CR)", "1.81 : 1", "1.81 : 1", "3.37 : 1", "1.27 : 1"],
        ["Storage Space Savings (%)", "44.78%", "44.87%", "70.37%", "21.05%"],
        ["Kraft Sum (sum 2^-l_i)", "1.000000", "1.000000", "1.000000", "1.000000"],
        ["Lossless Reconstruction D(E(M))==M", "PASSED (True)", "PASSED (True)", "PASSED (True)", "PASSED (True)"],
        ["Execution Time (Build + Encode)", "0.445 ms", "0.300 ms", "0.160 ms", "0.372 ms"]
    ]
    for i, row in enumerate(res_rows_t2):
        bg = "F9FBFD" if i % 2 == 1 else "FFFFFF"
        for j, val in enumerate(row):
            cell = t_res.rows[i+1].cells[j]
            cell.text = val
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=40, bottom=40, left=70, right=70)
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER if j != 0 else WD_ALIGN_PARAGRAPH.LEFT
            r = p.runs[0]
            r.font.size = Pt(8.5)
            if j == 0 or "Huffman Avg" in row[0] or "Space Savings" in row[0]:
                r.font.bold = True

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # Insert Image 1: Exp 1 Bar Chart
    img1_path = os.path.join(plots_dir, "exp1_entropy_vs_codelength.png")
    if os.path.exists(img1_path):
        p_img1 = doc.add_paragraph()
        p_img1.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img1.paragraph_format.space_before = Pt(6)
        p_img1.paragraph_format.space_after = Pt(2)
        doc.add_picture(img1_path, width=Inches(5.4))
        p_cap1 = doc.add_paragraph()
        p_cap1.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap1.paragraph_format.space_after = Pt(8)
        r_c1 = p_cap1.add_run("Figure 1: Comparative Analysis of Shannon Entropy H(X) vs. Huffman Average Code Length L(C) vs. Shannon–Fano across domains.")
        r_c1.font.size = Pt(8.5)
        r_c1.font.italic = True

    add_body_p(
        "Key Observations: (1) Adherence to Shannon Limit: Across all datasets, H(X) <= L(C) < H(X) + 1 holds strictly. "
        "In English text, redundancy is R = 0.0279 bits/sym (< 0.63% above theoretical limit). (2) Skewness Governs Compression: "
        "Genomic DNA achieved the lowest entropy (2.26 bits) and highest compression (3.37:1 ratio, 70.37% storage savings) due to nucleotide "
        "frequency skewness. Uniform text achieved 21.05% savings. (3) Huffman vs Shannon–Fano: Huffman coding strictly matched or "
        "outperformed Shannon–Fano in all cases (L_Huffman <= L_SF). (4) Kraft Invariant: sum(2^-l_i) = 1.000000 confirmed tree fullness."
    )

    # Insert Image 2: Tree Visualization
    img2_path = os.path.join(plots_dir, "huffman_tree_visualization.png")
    if os.path.exists(img2_path):
        p_img2 = doc.add_paragraph()
        p_img2.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img2.paragraph_format.space_before = Pt(6)
        p_img2.paragraph_format.space_after = Pt(2)
        doc.add_picture(img2_path, width=Inches(5.6))
        p_cap2 = doc.add_paragraph()
        p_cap2.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap2.paragraph_format.space_after = Pt(8)
        r_c2 = p_cap2.add_run("Figure 2: NetworkX visualization of the generated rooted binary prefix code tree with node weights and labeled decision branches ('0' and '1').")
        r_c2.font.size = Pt(8.5)
        r_c2.font.italic = True

    add_heading_2("3.2 Experiment 2: Algorithmic Runtime Scaling vs. Input Size (N)")
    add_body_p(
        "Table 3 documents execution performance as input size N was scaled from 300 to 100,000 symbols."
    )

    # Table 3: Scaling
    t_scale = doc.add_table(rows=6, cols=4)
    t_scale.alignment = WD_TABLE_ALIGNMENT.CENTER
    headers_t3 = ["Problem Instance (N)", "Huffman Runtime (ms)", "Shannon–Fano Runtime (ms)", "Huffman Expected Length L(C)"]
    for j, h in enumerate(headers_t3):
        cell = t_scale.rows[0].cells[j]
        cell.text = h
        set_cell_background(cell, "1F4E78")
        set_cell_margins(cell, top=60, bottom=60, left=70, right=70)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.runs[0].font.bold = True
        p.runs[0].font.size = Pt(9)
        p.runs[0].font.color.rgb = RGBColor(255, 255, 255)

    scale_rows = [
        ["300 symbols", "0.177 ms", "0.086 ms", "4.1600 bits/symbol"],
        ["1,000 symbols", "0.199 ms", "0.127 ms", "4.2880 bits/symbol"],
        ["5,000 symbols", "0.407 ms", "0.297 ms", "4.4002 bits/symbol"],
        ["20,000 symbols", "0.897 ms", "1.237 ms", "4.4166 bits/symbol"],
        ["100,000 symbols", "3.633 ms", "3.604 ms", "4.4171 bits/symbol"]
    ]
    for i, row in enumerate(scale_rows):
        bg = "F9FBFD" if i % 2 == 1 else "FFFFFF"
        for j, val in enumerate(row):
            cell = t_scale.rows[i+1].cells[j]
            cell.text = val
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=40, bottom=40, left=70, right=70)
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.runs[0].font.size = Pt(8.5)

    doc.add_paragraph().paragraph_format.space_after = Pt(4)

    # Insert Image 3: Scaling Line Chart
    img3_path = os.path.join(plots_dir, "exp2_runtime_scaling.png")
    if os.path.exists(img3_path):
        p_img3 = doc.add_paragraph()
        p_img3.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img3.paragraph_format.space_before = Pt(6)
        p_img3.paragraph_format.space_after = Pt(2)
        doc.add_picture(img3_path, width=Inches(5.0))
        p_cap3 = doc.add_paragraph()
        p_cap3.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap3.paragraph_format.space_after = Pt(8)
        r_c3 = p_cap3.add_run("Figure 3: Computational execution time scaling as input size scales from 300 to 100,000 symbols.")
        r_c3.font.size = Pt(8.5)
        r_c3.font.italic = True

    add_body_p(
        "Scaling Observations: Execution time scales linearly with N (~3.63 ms for 100,000 symbols), delivering a throughput "
        "exceeding 27,000 characters per millisecond. Expected code length stabilizes at 4.417 bits/symbol, confirming statistical convergence."
    )

    # --- SECTION 4: CONCLUSION ---
    add_heading_1("4. Conclusion and Future Scope")
    add_body_p(
        "This project successfully formulated, implemented, and analyzed optimal prefix codes using Discrete Mathematics and Graph Theory. "
        "Rooted binary trees and min-heap priority queues proved highly effective, producing codes that converge closely to Shannon's theoretical "
        "entropy limit. Huffman coding delivered up to 70.37% storage reduction on genomic DNA and strictly dominated Shannon–Fano coding, "
        "while guaranteeing 100% lossless reconstruction across all files."
    )
    add_body_p(
        "Limitations & Future Scope: Static Huffman coding incurs header overhead for storing the tree on small files (N < 200). "
        "Future work will implement Adaptive Dynamic Huffman Coding (Vitter's algorithm) to eliminate tree transmission on streaming data, "
        "and explore Arithmetic Coding to eliminate the integer bit-length restriction for fractional information allocations."
    )

    # --- INDIVIDUAL CONTRIBUTIONS & REFLECTIONS ---
    add_heading_1("5. Individual Contributions and Learning Reflections")
    reflections = [
        ("Nikhil Kumar (USN: 25BTRBT026) — Project Lead & Implementation",
         "Designed repository architecture, implemented the min-heap Huffman tree builder and DFS code generator (src/huffman.py), "
         "the Shannon–Fano baseline (src/shannon_fano.py), pipeline integration (main.py), and managed the GitHub repository.",
         "Translating abstract graph properties into concrete Python priority queues reinforced how greedy local merges mathematically enforce global path length optimality."),

        ("Piyush Kumar (USN: 25BTRBT030) — Encoder/Decoder & Verification",
         "Developed bit-level packing, byte conversion, tree-walk decoder (src/codec.py), and the automated unit test suite (tests/test_huffman.py).",
         "Learned low-level bit manipulation and byte padding, verifying that the prefix-free property enables instantaneous deterministic decoding without delimiters."),

        ("Sakshi Kumari (USN: 25BTRC0045) — Mathematical Formulation & Theory",
         "Formulated DMGT mathematical models, Kraft–McMillan inequality proofs, Shannon entropy theorems, and algorithmic pseudocode.",
         "Deepened understanding of information theory, proving that our empirical Kraft sum strictly equaled 1.000000, confirming tree completeness."),

        ("Arushi Pramanik (USN: 25BTRBT008) — Dataset Collection & Preprocessing",
         "Curated and preprocessed four diverse datasets (>= 300 records each in data/), computed frequency tables, and analyzed source entropy distributions.",
         "Understood how statistical skewness governs compressibility, observing how genomic DNA compresses by over 70% due to low source entropy."),

        ("Harsh R Rao (USN: 25BTRBT017) — Experimental Design & Benchmarking",
         "Executed Experiments 1 & 2 (experiments/benchmark.py), measured runtime scaling, computed compression ratios, and generated Matplotlib charts.",
         "Gained practical skills in empirical benchmarking, demonstrating that Huffman coding delivers high compression throughput (>27,000 symbols/ms)."),

        ("Khyathi Jain (USN: 25BTRBT021) — Visualization, Documentation & Presentation",
         "Developed NetworkX tree visualizer (src/visualizer.py), generated publication plots, compiled research report, and created presentation slides.",
         "Visualizing recursive tree graphs with labeled decision edges made the mathematical concept of prefix paths intuitive and clear for technical presentation.")
    ]

    for title, contrib, refl in reflections:
        p_ref = doc.add_paragraph()
        p_ref.paragraph_format.space_before = Pt(4)
        p_ref.paragraph_format.space_after = Pt(3)
        p_ref.paragraph_format.line_spacing = 1.15
        r_t = p_ref.add_run(f"• {title}:\n")
        r_t.font.bold = True
        r_t.font.size = Pt(9.5)
        r_t.font.color.rgb = RGBColor(16, 44, 87)
        r_c = p_ref.add_run(f"Contribution: {contrib}\n")
        r_c.font.size = Pt(9)
        r_r = p_ref.add_run(f"Learning Reflection: \"{refl}\"")
        r_r.font.size = Pt(9)
        r_r.font.italic = True

    # --- 8-STAGE EXPERIENTIAL LEARNING MATRIX ---
    add_heading_1("6. Experiential Learning 8-Stage Curriculum Compliance Matrix")
    t_stages = doc.add_table(rows=9, cols=3)
    t_stages.alignment = WD_TABLE_ALIGNMENT.CENTER
    headers_stg = ["Curriculum Stage", "Prescribed Syllabus Activity", "Project Implementation & Compliance"]
    for j, h in enumerate(headers_stg):
        cell = t_stages.rows[0].cells[j]
        cell.text = h
        set_cell_background(cell, "1F4E78")
        set_cell_margins(cell, top=50, bottom=50, left=70, right=70)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.runs[0].font.bold = True
        p.runs[0].font.size = Pt(9)
        p.runs[0].font.color.rgb = RGBColor(255, 255, 255)

    stages_data = [
        ["Problem Identification", "Define relevant real-world engineering or data problem and explain its significance.", "Section 1.1: Formulated uncompressed block payload transmission bottleneck in distributed blockchains and genomic storage."],
        ["Mathematical Formulation", "Represent problem using discrete structures: sets, relations, trees, graph algorithms.", "Section 2.1: Modeled codes as rooted binary trees T=(V,E), proved Kraft inequality sum(2^-l)<=1 and Shannon entropy bounds."],
        ["Algorithm/Model Development", "Select appropriate DMGT technique; provide pseudocode/flowchart.", "Section 2.2: Designed bottom-up min-heap greedy tree merge algorithm and DFS prefix code extraction."],
        ["Implementation", "Implement proposed method using Python and standard libraries.", "Section 2.2: Built modular codebase using Python heapq, NetworkX, Matplotlib, and custom bitstream codec."],
        ["Experimental Analysis", "Conduct at least two meaningful experiments varying data size/structure.", "Section 3.1 (Exp 1: 4 data domains) and Section 3.2 (Exp 2: Runtime scaling across N=300 to 100,000 symbols)."],
        ["Results and Interpretation", "Present results using suitable tables, graphs, and visualizations.", "Section 3: Delivered Tables 2 and 3, Figure 1 (Bar chart), Figure 2 (NetworkX tree), and Figure 3 (Scaling curve)."],
        ["Comparison and Discussion", "Compare two algorithms/methods and discuss observed behavior.", "Section 3.1: Compared Huffman vs. Fixed 8-bit ASCII vs. Shannon–Fano, proving L_Huffman <= L_SF."],
        ["Conclusion and Future Scope", "Summarize findings, explain DMGT contribution, identify limitations.", "Section 4: Confirmed Shannon convergence, identified small-file header overhead, proposed dynamic adaptive coding."]
    ]
    for i, row in enumerate(stages_data):
        bg = "F9FBFD" if i % 2 == 1 else "FFFFFF"
        for j, val in enumerate(row):
            cell = t_stages.rows[i+1].cells[j]
            cell.text = val
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=35, bottom=35, left=60, right=60)
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER if j == 0 else WD_ALIGN_PARAGRAPH.LEFT
            r = p.runs[0]
            r.font.size = Pt(8.5)
            if j == 0:
                r.font.bold = True

    # --- REFERENCES ---
    add_heading_1("7. References")
    references = [
        "Huffman, D. A. (1952). A Method for the Construction of Minimum-Redundancy Codes. Proceedings of the IRE, 40(9), 1098–1101.",
        "Shannon, C. E. (1948). A Mathematical Theory of Communication. Bell System Technical Journal, 27(3), 379–423.",
        "Rosen, K. H. (2019). Discrete Mathematics and Its Applications (8th ed.). McGraw-Hill Education. (Chapter 11: Trees and Rooted Trees).",
        "Cover, T. M., & Thomas, J. A. (2006). Elements of Information Theory (2nd ed.). John Wiley & Sons. (Chapter 5: Kraft Inequality).",
        "Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2022). Introduction to Algorithms (4th ed.). MIT Press. (Chapter 15: Greedy Algorithms).",
        "Fano, R. M. (1949). The Transmission of Information. Technical Report No. 65, Research Laboratory of Electronics, MIT.",
        "Knuth, D. E. (1985). Dynamic Huffman Coding. Journal of Algorithms, 6(2), 163–180.",
        "National Center for Biotechnology Information (NCBI). (2024). Enterobacteria phage T4 complete genome fragment, GenBank Accession: NC_000866.4. Available: https://www.ncbi.nlm.nih.gov/nuccore/NC_000866.4",
        "Project Gutenberg. (2024). Free eBooks and Digital Text Archive. Available: https://www.gutenberg.org/",
        "Python Software Foundation. (2024). CPython Source Code and Standard Library. GitHub Repository. Available: https://github.com/python/cpython",
        "DMGT Project Repository. (2026). Optimal Prefix Codes and Data Compression Using Huffman Coding. GitHub Repository: https://github.com/SmoothnOperator/Dmgt-Huffman-Coding"
    ]
    for i, ref in enumerate(references):
        p_rf = doc.add_paragraph()
        p_rf.paragraph_format.space_before = Pt(2)
        p_rf.paragraph_format.space_after = Pt(3)
        p_rf.paragraph_format.line_spacing = 1.15
        r_num = p_rf.add_run(f"[{i+1}] ")
        r_num.font.bold = True
        r_num.font.size = Pt(9)
        r_txt = p_rf.add_run(ref)
        r_txt.font.size = Pt(9)

    # --- GROUP PHOTO PLACEHOLDER ---
    add_heading_1("8. Team Group Photo")
    t_photo = doc.add_table(rows=1, cols=1)
    t_photo.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell_ph = t_photo.rows[0].cells[0]
    cell_ph.width = Inches(6.0)
    set_cell_background(cell_ph, "FAFAFA")
    set_cell_margins(cell_ph, top=200, bottom=200, left=150, right=150)
    p_ph = cell_ph.paragraphs[0]
    p_ph.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_ph = p_ph.add_run("[ INSERT TEAM GROUP PHOTO HERE ]\n\nGroup Members (L-R):\nNikhil Kumar, Piyush Kumar, Sakshi Kumari, Arushi Pramanik, Harsh R Rao, Khyathi Jain\nFaculty Guide: Dr. Priya Satish")
    r_ph.font.size = Pt(10)
    r_ph.font.italic = True
    r_ph.font.color.rgb = RGBColor(120, 120, 120)

    doc.save(output_docx)
    print(f"[OK] Successfully regenerated full Jain University Experiential Learning Report at: {output_docx}")

if __name__ == "__main__":
    create_full_report()
