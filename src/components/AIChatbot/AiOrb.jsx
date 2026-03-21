import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

function GlowingSphere({ isThinking }) {
    const meshRef = useRef();
    const materialRef = useRef();

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        if (materialRef.current) {
            materialRef.current.distort = isThinking
                ? 0.3 + Math.sin(t * 4) * 0.15
                : 0.15 + Math.sin(t * 1.5) * 0.05;
        }
        if (meshRef.current) {
            meshRef.current.rotation.y = t * (isThinking ? 0.8 : 0.3);
            meshRef.current.rotation.x = Math.sin(t * 0.5) * 0.1;
        }
    });

    return (
        <Float speed={isThinking ? 6 : 2} rotationIntensity={0.2} floatIntensity={isThinking ? 1.5 : 0.6}>
            <mesh ref={meshRef} scale={1.1}>
                <icosahedronGeometry args={[1, 8]} />
                <MeshDistortMaterial
                    ref={materialRef}
                    color={isThinking ? '#E8C547' : '#6B6BFF'}
                    emissive={isThinking ? '#E8C547' : '#4444CC'}
                    emissiveIntensity={isThinking ? 1.2 : 0.4}
                    roughness={0.15}
                    metalness={0.9}
                    distort={0.15}
                    speed={isThinking ? 8 : 3}
                    transparent
                    opacity={0.92}
                />
            </mesh>
            {/* Outer glow ring */}
            <mesh scale={1.4}>
                <ringGeometry args={[0.95, 1.05, 64]} />
                <meshBasicMaterial
                    color={isThinking ? '#E8C547' : '#6B6BFF'}
                    transparent
                    opacity={isThinking ? 0.3 : 0.1}
                    side={THREE.DoubleSide}
                />
            </mesh>
        </Float>
    );
}

function ParticleField({ isThinking }) {
    const particlesRef = useRef();
    const count = 60;

    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = 1.6 + Math.random() * 0.8;
            pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = r * Math.cos(phi);
        }
        return pos;
    }, []);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        if (particlesRef.current) {
            particlesRef.current.rotation.y = t * (isThinking ? 0.5 : 0.15);
            particlesRef.current.rotation.x = t * 0.08;
        }
    });

    return (
        <points ref={particlesRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.03}
                color={isThinking ? '#E8C547' : '#6B6BFF'}
                transparent
                opacity={0.6}
                sizeAttenuation
            />
        </points>
    );
}

export default function AiOrb({ isThinking = false, onClick }) {
    return (
        <div
            onClick={onClick}
            style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'visible',
            }}
        >
            <Canvas
                camera={{ position: [0, 0, 3.5], fov: 45 }}
                style={{ width: '100%', height: '100%', borderRadius: '50%' }}
                gl={{ alpha: true, antialias: true }}
            >
                <ambientLight intensity={0.3} />
                <pointLight position={[3, 3, 3]} intensity={1.2} color="#E8C547" />
                <pointLight position={[-3, -2, 2]} intensity={0.6} color="#6B6BFF" />
                <GlowingSphere isThinking={isThinking} />
                <ParticleField isThinking={isThinking} />
            </Canvas>
            {/* Soft CSS glow behind */}
            <div style={{
                position: 'absolute',
                inset: -8,
                borderRadius: '50%',
                background: isThinking
                    ? 'radial-gradient(circle, rgba(232,197,71,0.25) 0%, transparent 70%)'
                    : 'radial-gradient(circle, rgba(107,107,255,0.18) 0%, transparent 70%)',
                zIndex: -1,
                transition: 'background 0.5s ease',
                pointerEvents: 'none',
            }} />
        </div>
    );
}
