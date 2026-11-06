import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function ThreeDTreeViewer({ treeData, codes, freqs }) {
  const mountRef = useRef(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [nodeCount, setNodeCount] = useState(0);

  useEffect(() => {
    if (!mountRef.current || !treeData) return;

    const width = mountRef.current.clientWidth;
    const height = 580;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070A12, 0.015);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 5, 28);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x00F2FE, 2.0);
    dirLight1.position.set(20, 30, 20);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x8B5CF6, 1.8);
    dirLight2.position.set(-20, -10, -20);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0x10B981, 2.5, 50);
    pointLight.position.set(0, 10, 0);
    scene.add(pointLight);

    // 3. Background Starfield / Particle Cloud
    const particleCount = 700;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 80;
      particlePos[i + 1] = (Math.random() - 0.5) * 60;
      particlePos[i + 2] = (Math.random() - 0.5) * 80;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38BDF8,
      size: 0.35,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 4. Build 3D Tree Hierarchy
    const treeGroup = new THREE.Group();
    scene.add(treeGroup);

    const interactiveSpheres = [];
    const edgePackets = [];

    // Helper: calculate 3D tree layout coordinates
    let totalNodes = 0;
    function layout3D(node, depth = 0, xOffset = 0, zOffset = 0, spreadX = 8, spreadZ = 5) {
      if (!node) return null;
      totalNodes++;

      const y = 10 - depth * 3.5;
      const x = xOffset;
      const z = zOffset;

      const nodeObj = {
        data: node,
        pos: new THREE.Vector3(x, y, z),
        depth,
        children: []
      };

      const nextSpreadX = Math.max(spreadX * 0.55, 1.2);
      const nextSpreadZ = Math.max(spreadZ * 0.6, 0.8);

      if (node.left) {
        nodeObj.children.push({
          child: layout3D(node.left, depth + 1, x - nextSpreadX, z + (depth % 2 === 0 ? nextSpreadZ : -nextSpreadZ), nextSpreadX, nextSpreadZ),
          bit: '0'
        });
      }
      if (node.right) {
        nodeObj.children.push({
          child: layout3D(node.right, depth + 1, x + nextSpreadX, z - (depth % 2 === 0 ? nextSpreadZ : -nextSpreadZ), nextSpreadX, nextSpreadZ),
          bit: '1'
        });
      }

      return nodeObj;
    }

    const root3D = layout3D(treeData);
    setNodeCount(totalNodes);

    // Helper: Draw 3D nodes and edges recursively
    const sphereGeo = new THREE.SphereGeometry(0.55, 24, 24);
    const leafGeo = new THREE.SphereGeometry(0.65, 24, 24);

    const intMaterial = new THREE.MeshStandardMaterial({
      color: 0x0284C7,
      emissive: 0x00F2FE,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.8
    });

    const leafMaterial = new THREE.MeshStandardMaterial({
      color: 0x059669,
      emissive: 0x10B981,
      emissiveIntensity: 0.7,
      roughness: 0.15,
      metalness: 0.7
    });

    function render3DNode(layoutNode) {
      if (!layoutNode) return;

      const isLeaf = layoutNode.data.char !== null;
      const mesh = new THREE.Mesh(isLeaf ? leafGeo : sphereGeo, isLeaf ? leafMaterial : intMaterial);
      mesh.position.copy(layoutNode.pos);
      mesh.userData = {
        char: layoutNode.data.char,
        freq: layoutNode.data.freq,
        code: codes ? codes[layoutNode.data.char] : '',
        depth: layoutNode.depth,
        isLeaf
      };

      treeGroup.add(mesh);
      interactiveSpheres.push(mesh);

      // Add child branches & packets
      for (const { child, bit } of layoutNode.children) {
        if (!child) continue;

        // Draw connecting 3D tube / cylinder
        const p1 = layoutNode.pos;
        const p2 = child.pos;
        const distance = p1.distanceTo(p2);
        const edgeGeo = new THREE.CylinderGeometry(0.06, 0.06, distance, 12);
        const edgeMat = new THREE.MeshStandardMaterial({
          color: bit === '0' ? 0x00F2FE : 0xF43F5E,
          emissive: bit === '0' ? 0x00F2FE : 0xF43F5E,
          emissiveIntensity: 0.45,
          transparent: true,
          opacity: 0.75
        });

        const edgeMesh = new THREE.Mesh(edgeGeo, edgeMat);
        const midpoint = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
        edgeMesh.position.copy(midpoint);

        // Orient cylinder
        const orientation = new THREE.Matrix4();
        orientation.lookAt(p1, p2, new THREE.Vector3(0, 1, 0));
        orientation.multiply(new THREE.Matrix4().makeRotationX(Math.PI / 2));
        edgeMesh.applyMatrix4(orientation);

        treeGroup.add(edgeMesh);

        // Add traveling photon packet
        const packetGeo = new THREE.SphereGeometry(0.14, 12, 12);
        const packetMat = new THREE.MeshBasicMaterial({
          color: 0xFFFFFF,
          wireframe: false
        });
        const packet = new THREE.Mesh(packetGeo, packetMat);
        treeGroup.add(packet);

        edgePackets.push({
          mesh: packet,
          start: p1,
          end: p2,
          progress: Math.random(),
          speed: 0.008 + Math.random() * 0.008
        });

        render3DNode(child);
      }
    }

    render3DNode(root3D);

    // Center tree in view
    treeGroup.position.set(0, -2, 0);

    // 5. Orbit & Mouse Controls
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };
    let rotX = 0;
    let rotY = 0;

    const dom = renderer.domElement;

    const onMouseDown = (e) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (isDragging) {
        const deltaX = e.clientX - prevMousePos.x;
        const deltaY = e.clientY - prevMousePos.y;
        rotY += deltaX * 0.008;
        rotX += deltaY * 0.008;
        rotX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, rotX));
        prevMousePos = { x: e.clientX, y: e.clientY };
      }

      // Raycasting for hover tooltip
      const rect = dom.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveSpheres);

      if (intersects.length > 0) {
        const top = intersects[0].object;
        setHoveredNode(top.userData);
        dom.style.cursor = 'pointer';
      } else {
        setHoveredNode(null);
        dom.style.cursor = 'grab';
      }
    };

    const onMouseUp = () => { isDragging = false; };
    const onWheel = (e) => {
      camera.position.z += e.deltaY * 0.03;
      camera.position.z = Math.max(10, Math.min(60, camera.position.z));
    };

    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('wheel', onWheel);

    // 6. Animation Loop
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Particle subtle rotation
      particles.rotation.y += 0.0006;

      // Auto rotation if enabled
      if (autoRotate && !isDragging) {
        rotY += 0.003;
      }

      treeGroup.rotation.y = rotY;
      treeGroup.rotation.x = rotX;

      // Animate edge packets
      for (const pkt of edgePackets) {
        pkt.progress += pkt.speed;
        if (pkt.progress > 1) pkt.progress = 0;
        pkt.mesh.position.lerpVectors(pkt.start, pkt.end, pkt.progress);
      }

      renderer.render(scene, camera);
    };

    animate();

    // 7. Cleanup
    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('wheel', onWheel);
      if (mountRef.current && dom) {
        mountRef.current.innerHTML = '';
      }
      renderer.dispose();
    };
  }, [treeData, autoRotate]);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      
      {/* 3D Canvas Mount */}
      <div 
        ref={mountRef} 
        style={{ 
          width: '100%', 
          height: '580px', 
          borderRadius: '12px', 
          overflow: 'hidden',
          background: 'radial-gradient(circle at 50% 50%, #0A1224 0%, #050811 100%)',
          border: '1px solid var(--border)',
          boxShadow: 'inset 0 0 40px rgba(0, 242, 254, 0.08)'
        }} 
      />

      {/* Floating HUD Controls */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        display: 'flex',
        gap: '8px',
        zIndex: 10
      }}>
        <button 
          onClick={() => setAutoRotate(!autoRotate)}
          className="badge"
          style={{
            background: autoRotate ? 'rgba(0, 242, 254, 0.2)' : 'rgba(15, 23, 42, 0.8)',
            color: autoRotate ? 'var(--accent-cyan)' : 'var(--text-muted)',
            border: '1px solid var(--border)',
            cursor: 'pointer',
            padding: '6px 14px'
          }}
        >
          {autoRotate ? '⏸ Pause Auto-Rotation' : '▶ Enable Orbit Rotation'}
        </button>

        <span className="badge badge-emerald">
          🌳 {nodeCount} 3D Spatial Vertices
        </span>
      </div>

      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '16px',
        fontSize: '0.82rem',
        color: 'var(--text-muted)',
        background: 'rgba(10, 15, 29, 0.75)',
        backdropFilter: 'blur(8px)',
        padding: '6px 12px',
        borderRadius: '8px',
        border: '1px solid var(--border)',
        zIndex: 10
      }}>
        🖱️ <strong>Controls:</strong> Left Click + Drag to Orbit • Scroll to Zoom • Hover Sphere to Inspect
      </div>

      {/* Node Tooltip Card on Hover */}
      {hoveredNode && (
        <div style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          background: 'rgba(13, 19, 34, 0.92)',
          backdropFilter: 'blur(16px)',
          border: '1px solid var(--accent-cyan)',
          borderRadius: '10px',
          padding: '14px 18px',
          boxShadow: '0 8px 30px rgba(0, 242, 254, 0.25)',
          minWidth: '220px',
          zIndex: 20
        }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
            {hoveredNode.isLeaf ? '🍃 Leaf Symbol Vertex' : '🔄 Internal Decision Vertex'}
          </div>
          {hoveredNode.isLeaf ? (
            <>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
                {hoveredNode.char === ' ' ? "[Space ' ']" : (hoveredNode.char === '\n' ? "[Newline '\\n']" : `'${hoveredNode.char}'`)}
              </div>
              <div style={{ marginTop: '8px', fontSize: '0.88rem' }}>
                <div>Frequency: <strong style={{ color: 'var(--text-main)' }}>{hoveredNode.freq}</strong></div>
                <div>Huffman Code: <strong style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>{hoveredNode.code}</strong></div>
                <div>Bit Length: <strong style={{ color: 'var(--text-main)' }}>{hoveredNode.code.length} bits</strong></div>
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                Weight: {hoveredNode.freq}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Depth Level: {hoveredNode.depth}
              </div>
            </>
          )}
        </div>
      )}

    </div>
  );
}
