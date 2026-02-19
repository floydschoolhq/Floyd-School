import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Text, Sparkles, Center } from '@react-three/drei';
import * as THREE from 'three';

const Badge = ({ color, name }) => {
    const mesh = useRef();
    const [hovered, setHover] = useState(false);

    useFrame((state) => {
        if (mesh.current) {
            mesh.current.rotation.y += 0.01;
            mesh.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2;
        }
    });

    return (
        <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
            <mesh
                ref={mesh}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
                scale={hovered ? 1.2 : 1}
            >
                <octahedronGeometry args={[1, 0]} />
                <MeshDistortMaterial
                    color={color}
                    speed={2}
                    distort={0.4}
                    radius={1}
                    emissive={color}
                    emissiveIntensity={0.5}
                    metalness={0.8}
                    roughness={0.2}
                />
            </mesh>
            <Center top position={[0, -1.5, 0]}>
                <Text
                    fontSize={0.2}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                    font="https://fonts.gstatic.com/s/plusjakartasans/v8/L0xPDFM6p_5S0qsm8_I0-p3K7h3u-D5X.woff"
                >
                    {name}
                </Text>
            </Center>
            <Sparkles count={50} scale={2} size={2} speed={0.4} opacity={0.5} />
        </Float>
    );
};

const Achievement3D = ({ title = "Excellence Badge", color = "#2563EB" }) => {
    return (
        <div className="w-full h-full min-h-[250px] relative">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                <Badge color={color} name={title} />
            </Canvas>
            <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-text-muted transition-colors duration-500">
                    Interact with Reward
                </p>
            </div>
        </div>
    );
};

export default Achievement3D;
