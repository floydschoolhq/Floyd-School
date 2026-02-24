import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Environment, Stars, Trail, Sparkles, Text, Float as FloatDrei } from '@react-three/drei';
import * as THREE from 'three';

// --- Shared Components ---

// Reduced scale to prevent overflow
const FloatingGeometry = ({ children, speed = 1, rotationIntensity = 1, floatIntensity = 1, scale = 1.3 }) => (
    <Float speed={speed} rotationIntensity={rotationIntensity} floatIntensity={floatIntensity}>
        <group scale={scale}>
            {children}
        </group>
    </Float>
);

const BackgroundGrid = ({ color = "#ffffff", opacity = 0.1 }) => (
    <gridHelper args={[20, 20, color, color]} position={[0, -2, 0]} rotation={[0, 0, 0]} >
        <meshBasicMaterial color={color} transparent opacity={opacity} />
    </gridHelper>
);

// --- Scenes ---

export const PythonScene = () => {
    return (
        <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#FFD700" />

            {/* Background Code Snippets */}
            {Array.from({ length: 15 }).map((_, i) => (
                <Float key={i} speed={0.5 + Math.random()} rotationIntensity={2} floatIntensity={1} position={[
                    (Math.random() - 0.5) * 6,
                    (Math.random() - 0.5) * 4,
                    (Math.random() - 0.5) * 2 - 2
                ]}>
                    <Text
                        color="#306998"
                        fontSize={0.2 + Math.random() * 0.2}
                        anchorX="center"
                        anchorY="middle"
                        fillOpacity={0.3}
                    >
                        {['def', 'return', 'import', 'class', '{}', '[]', '<>', 'print'][i % 8]}
                    </Text>
                </Float>
            ))}

            <FloatingGeometry scale={1.6}>
                <mesh position={[-0.5, 0.5, 0]}>
                    <torusKnotGeometry args={[0.6, 0.2, 100, 16]} />
                    <meshStandardMaterial color="#306998" roughness={0.3} metalness={0.8} />
                </mesh>
                <mesh position={[0.5, -0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[0.5, 0.2, 16, 100]} />
                    <meshStandardMaterial color="#FFD700" roughness={0.3} metalness={0.8} emissive="#FFD700" emissiveIntensity={0.2} />
                </mesh>
            </FloatingGeometry>
            <Sparkles count={30} scale={5} size={2} speed={0.4} opacity={0.5} color="#306998" />
            <Environment preset="city" />
        </Canvas>
    );
};

export const RobotScene = () => {
    return (
        <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={2} color="#ffffff" />

            {/* Background Gears */}
            {Array.from({ length: 8 }).map((_, i) => (
                <Float key={i} speed={1} rotationIntensity={4} floatIntensity={2} position={[
                    (Math.random() - 0.5) * 7,
                    (Math.random() - 0.5) * 5,
                    -2
                ]}>
                    <mesh>
                        <cylinderGeometry args={[0.3, 0.3, 0.1, 8]} />
                        <meshStandardMaterial color="#475569" wireframe />
                    </mesh>
                </Float>
            ))}

            <FloatingGeometry speed={2} scale={1.8}>
                <mesh position={[0, 0.2, 0]}>
                    <boxGeometry args={[1, 0.8, 1]} />
                    <meshStandardMaterial color="#A0AEC0" metalness={0.9} roughness={0.1} />
                </mesh>
                <mesh position={[-0.2, 0.3, 0.51]}>
                    <sphereGeometry args={[0.1]} />
                    <meshStandardMaterial color="#00FFFF" emissive="#00FFFF" emissiveIntensity={2} />
                </mesh>
                <mesh position={[0.2, 0.3, 0.51]}>
                    <sphereGeometry args={[0.1]} />
                    <meshStandardMaterial color="#00FFFF" emissive="#00FFFF" emissiveIntensity={2} />
                </mesh>
            </FloatingGeometry>
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        </Canvas>
    );
};

export const AIScene = () => {
    return (
        <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1.5} color="#ec4899" />

            {/* Neural Network Nodes Background */}
            {Array.from({ length: 20 }).map((_, i) => (
                <Float key={i} speed={0.5} rotationIntensity={1} position={[
                    (Math.random() - 0.5) * 8,
                    (Math.random() - 0.5) * 6,
                    (Math.random() - 0.5) * 4 - 2
                ]}>
                    <mesh>
                        <sphereGeometry args={[0.1]} />
                        <meshBasicMaterial color="#ec4899" transparent opacity={0.3} />
                    </mesh>
                </Float>
            ))}

            <FloatingGeometry speed={1.5} scale={1.6}>
                <mesh>
                    <icosahedronGeometry args={[1, 1]} />
                    <meshStandardMaterial color="#ec4899" wireframe={true} transparent opacity={0.8} />
                </mesh>
                <mesh scale={0.5}>
                    <icosahedronGeometry args={[1, 0]} />
                    <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={2} />
                </mesh>
            </FloatingGeometry>
            <Sparkles count={80} scale={6} size={3} speed={0.4} opacity={0.5} color="#ec4899" />
        </Canvas>
    )
}

const AtomElectron = ({ radius, speed, color, offset }) => {
    const ref = useRef();
    useFrame(({ clock }) => {
        const t = clock.getElapsedTime() * speed + offset;
        ref.current.position.x = Math.cos(t) * radius;
        ref.current.position.z = Math.sin(t) * radius;
    });
    return (
        <group rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}>
            <mesh ref={ref}>
                <sphereGeometry args={[0.1]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[radius, 0.02, 16, 100]} />
                <meshBasicMaterial color={color} transparent opacity={0.3} />
            </mesh>
        </group>

    )
}

export const ReactScene = () => {
    return (
        <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
            <ambientLight intensity={0.5} />

            {/* HTML Tags Background */}
            {Array.from({ length: 12 }).map((_, i) => (
                <Float key={i} speed={0.8} rotationIntensity={2} position={[
                    (Math.random() - 0.5) * 8,
                    (Math.random() - 0.5) * 6,
                    -3
                ]}>
                    <Text
                        color="#06b6d4"
                        fontSize={0.3}
                        fillOpacity={0.2}
                    >
                        {['<html>', '<div>', '<api>', '{state}', 'useHook', '< />'][i % 6]}
                    </Text>
                </Float>
            ))}

            <FloatingGeometry scale={1.6}>
                <mesh>
                    <sphereGeometry args={[0.3]} />
                    <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={1} />
                </mesh>
                <AtomElectron radius={1.2} speed={2} color="#06b6d4" offset={0} />
                <AtomElectron radius={1.2} speed={2.5} color="#06b6d4" offset={2} />
                <AtomElectron radius={1.2} speed={1.8} color="#06b6d4" offset={4} />
            </FloatingGeometry>
        </Canvas>
    )
}

export const DataScene = () => {
    return (
        <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
            <ambientLight />

            {/* Binary Rain Background */}
            {Array.from({ length: 30 }).map((_, i) => (
                <Float key={i} speed={2} position={[
                    (Math.random() - 0.5) * 7,
                    (Math.random() - 0.5) * 5,
                    (Math.random() - 0.5) * 4
                ]}>
                    <Text
                        color="#22c55e"
                        fontSize={0.2}
                        fillOpacity={0.4}
                    >
                        {Math.random() > 0.5 ? '1' : '0'}
                    </Text>
                </Float>
            ))}

            <FloatingGeometry scale={1.7}>
                <mesh position={[0, 0, 0]} rotation={[0.5, 0.5, 0]}>
                    <boxGeometry args={[1.2, 1.2, 1.2]} />
                    <meshNormalMaterial wireframe />
                </mesh>
                <mesh position={[0, 0, 0]} rotation={[0.5, 0.5, 0]} scale={0.8}>
                    <boxGeometry args={[1.2, 1.2, 1.2]} />
                    <meshStandardMaterial color="#22c55e" transparent opacity={0.4} />
                </mesh>
            </FloatingGeometry>
            <Sparkles color="#22c55e" count={50} scale={4} size={3} speed={2} />
        </Canvas>
    )
}

const ShieldRing = ({ radius, speed, axis }) => {
    const ref = useRef();
    useFrame(({ clock }) => {
        ref.current.rotation[axis] = clock.getElapsedTime() * speed;
    });
    return (
        <mesh ref={ref}>
            <torusGeometry args={[radius, 0.05, 16, 100]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2} />
        </mesh>
    );
}

export const SecurityScene = () => {
    return (
        <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[0, 0, 0]} intensity={2} color="#ef4444" distance={5} />

            {/* Floating Padlocks/Keys */}
            {Array.from({ length: 10 }).map((_, i) => (
                <Float key={i} speed={1} position={[
                    (Math.random() - 0.5) * 7,
                    (Math.random() - 0.5) * 5,
                    -2
                ]}>
                    <mesh rotation={[0, 0, Math.PI / 4]}>
                        <boxGeometry args={[0.2, 0.2, 0.2]} />
                        <meshStandardMaterial color="#ef4444" wireframe transparent opacity={0.3} />
                    </mesh>
                </Float>
            ))}

            <FloatingGeometry speed={2} scale={1.5}>
                {/* Central Core */}
                <mesh>
                    <octahedronGeometry args={[0.8, 0]} />
                    <meshStandardMaterial color="#ef4444" wireframe emissive="#ef4444" emissiveIntensity={1} />
                </mesh>

                {/* Rotating Shield Rings */}
                <ShieldRing radius={1.2} speed={1} axis="x" />
                <ShieldRing radius={1.4} speed={0.8} axis="y" />
                <ShieldRing radius={1.6} speed={-0.5} axis="z" />
            </FloatingGeometry>

            <Sparkles count={60} scale={5} size={2} speed={1} color="#ef4444" />
        </Canvas>
    )
}

