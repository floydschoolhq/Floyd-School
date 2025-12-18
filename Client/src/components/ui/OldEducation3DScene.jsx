import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, Sparkles, Text } from '@react-three/drei';
import * as THREE from 'three';

// Floating dust particles
const DustParticle = ({ position }) => {
    const ref = useRef();
    useFrame(({ clock }) => {
        ref.current.position.y += Math.sin(clock.getElapsedTime() * 0.2) * 0.001;
    });
    return (
        <mesh ref={ref} position={position}>
            <sphereGeometry args={[0.02]} />
            <meshBasicMaterial color="#8B7355" transparent opacity={0.3} />
        </mesh>
    );
};

// Dusty old book
const OldBook = ({ position, rotation }) => (
    <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.3}>
        <group position={position} rotation={rotation}>
            {/* Book cover */}
            <mesh>
                <boxGeometry args={[0.8, 1.2, 0.15]} />
                <meshStandardMaterial color="#5C4033" roughness={0.9} metalness={0.1} />
            </mesh>
            {/* Book pages */}
            <mesh position={[0, 0, 0.08]}>
                <boxGeometry args={[0.75, 1.15, 0.12]} />
                <meshStandardMaterial color="#F5E6D3" roughness={1} />
            </mesh>
        </group>
    </Float>
);

// Chalkboard
const Chalkboard = () => (
    <group position={[0, 0, -2]}>
        <mesh>
            <planeGeometry args={[4, 2.5]} />
            <meshStandardMaterial color="#2F4F2F" roughness={0.95} />
        </mesh>
        {/* Fading text */}
        <Text
            position={[0, 0.5, 0.01]}
            fontSize={0.2}
            color="#CCCCCC"
            anchorX="center"
            anchorY="middle"
            fillOpacity={0.4}
        >
            MEMORIZE
        </Text>
        <Text
            position={[0, 0, 0.01]}
            fontSize={0.15}
            color="#CCCCCC"
            anchorX="center"
            anchorY="middle"
            fillOpacity={0.3}
        >
            REPEAT
        </Text>
        <Text
            position={[0, -0.5, 0.01]}
            fontSize={0.15}
            color="#CCCCCC"
            anchorX="center"
            anchorY="middle"
            fillOpacity={0.25}
        >
            FORGET
        </Text>
    </group>
);

export const OldEducation3DScene = () => {
    return (
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            <ambientLight intensity={0.3} />
            <directionalLight position={[5, 5, 5]} intensity={0.4} color="#FFF8DC" />

            {/* Chalkboard in background */}
            <Chalkboard />

            {/* Floating dusty books */}
            <OldBook position={[-1.5, 0.5, 0]} rotation={[0.2, -0.3, 0.1]} />
            <OldBook position={[1.2, -0.3, 0.5]} rotation={[-0.1, 0.4, -0.2]} />
            <OldBook position={[0, 0.8, 1]} rotation={[0.3, 0, 0.15]} />
            <OldBook position={[-0.8, -0.6, 0.8]} rotation={[-0.2, -0.2, 0.1]} />

            {/* Dust particles */}
            {Array.from({ length: 30 }).map((_, i) => (
                <DustParticle
                    key={i}
                    position={[
                        (Math.random() - 0.5) * 6,
                        (Math.random() - 0.5) * 4,
                        (Math.random() - 0.5) * 3
                    ]}
                />
            ))}

            {/* Dim sparkles for dust effect */}
            <Sparkles count={20} scale={5} size={1} speed={0.1} opacity={0.2} color="#8B7355" />

            <Environment preset="warehouse" />
        </Canvas>
    );
};
