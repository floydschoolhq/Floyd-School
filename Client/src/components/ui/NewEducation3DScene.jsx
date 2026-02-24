import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, Sparkles, Text, Trail } from '@react-three/drei';
import * as THREE from 'three';

// Glowing student orb
const StudentOrb = ({ position, color }) => (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <mesh position={position}>
            <sphereGeometry args={[0.15]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
        </mesh>
    </Float>
);

// Holographic code snippet
const CodeSnippet = ({ position, rotation, code }) => (
    <Float speed={1.5} rotationIntensity={2} floatIntensity={0.8}>
        <Text
            position={position}
            rotation={rotation}
            fontSize={0.15}
            color="#00FFFF"
            anchorX="center"
            anchorY="middle"
            fillOpacity={0.7}
            outlineWidth={0.01}
            outlineColor="#0088FF"
        >
            {code}
        </Text>
    </Float>
);

// DNA Helix (learning pathways)
const DNAHelix = () => {
    const groupRef = useRef();
    useFrame(({ clock }) => {
        groupRef.current.rotation.y = clock.getElapsedTime() * 0.3;
    });

    const helixPoints = [];
    for (let i = 0; i < 20; i++) {
        const angle = (i / 20) * Math.PI * 4;
        const y = (i / 20) * 3 - 1.5;
        helixPoints.push({
            position: [Math.cos(angle) * 0.5, y, Math.sin(angle) * 0.5],
            color: i % 2 === 0 ? '#FF00FF' : '#00FFFF'
        });
    }

    return (
        <group ref={groupRef} position={[0, 0, -1]}>
            {helixPoints.map((point, i) => (
                <mesh key={i} position={point.position}>
                    <sphereGeometry args={[0.08]} />
                    <meshStandardMaterial color={point.color} emissive={point.color} emissiveIntensity={1.5} />
                </mesh>
            ))}
        </group>
    );
};

// Electric data stream particle
const DataStreamParticle = ({ startPos, endPos, delay }) => {
    const ref = useRef();
    useFrame(({ clock }) => {
        const t = ((clock.getElapsedTime() + delay) % 2) / 2;
        ref.current.position.x = THREE.MathUtils.lerp(startPos[0], endPos[0], t);
        ref.current.position.y = THREE.MathUtils.lerp(startPos[1], endPos[1], t);
        ref.current.position.z = THREE.MathUtils.lerp(startPos[2], endPos[2], t);
    });
    return (
        <mesh ref={ref}>
            <sphereGeometry args={[0.05]} />
            <meshBasicMaterial color="#00FFFF" />
        </mesh>
    );
};

export const NewEducation3DScene = () => {
    return (
        <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
            <ambientLight intensity={0.4} />
            <pointLight position={[5, 5, 5]} intensity={2} color="#00FFFF" />
            <pointLight position={[-5, -5, 5]} intensity={1.5} color="#FF00FF" />

            {/* DNA Helix (learning pathways) */}
            <DNAHelix />

            {/* Holographic code snippets */}
            <CodeSnippet position={[-2, 1, 1]} rotation={[0, 0.3, 0]} code="<AI />" />
            <CodeSnippet position={[2, 0.5, 0.5]} rotation={[0, -0.4, 0]} code="function()" />
            <CodeSnippet position={[-1.5, -1, 1.5]} rotation={[0, 0.2, 0]} code="{code}" />
            <CodeSnippet position={[1.8, -0.8, 1]} rotation={[0, -0.3, 0]} code="<3D>" />

            {/* Glowing student orbs */}
            <StudentOrb position={[-1.5, 1.5, 2]} color="#00FFFF" />
            <StudentOrb position={[1.5, 1.2, 2]} color="#FF00FF" />
            <StudentOrb position={[0, -1.5, 2.5]} color="#FFAA00" />

            {/* Electric data streams */}
            {Array.from({ length: 10 }).map((_, i) => (
                <DataStreamParticle
                    key={i}
                    startPos={[
                        (Math.random() - 0.5) * 4,
                        (Math.random() - 0.5) * 3,
                        -2
                    ]}
                    endPos={[
                        (Math.random() - 0.5) * 4,
                        (Math.random() - 0.5) * 3,
                        3
                    ]}
                    delay={i * 0.2}
                />
            ))}

            {/* Vibrant sparkles */}
            <Sparkles count={100} scale={8} size={3} speed={0.6} opacity={0.6} color="#00FFFF" />

            <Environment preset="city" />
        </Canvas>
    );
};

