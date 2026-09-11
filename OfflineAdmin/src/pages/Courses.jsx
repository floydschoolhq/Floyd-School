import React, { useState } from 'react';
import { BookOpen, Layers, Cpu, Code2, Bot, Award } from 'lucide-react';

export default function Courses() {
  const tracks = [
    {
      title: 'Robotics & Microcontroller Engineering',
      code: 'FS-ROB-101',
      description: 'Foundations of embedded electronics, motor drivers, servo PWM control, and ultrasonic sensor telemetry.',
      icon: Bot,
      color: 'blue',
      modules: [
        'Module 1: Microcontroller GPIO & Power Distribution',
        'Module 2: Actuators, DC Motors & H-Bridge Drivers',
        'Module 3: Obstacle Avoidance Telemetry & Sensor Integration',
        'Module 4: Autonomous Line Following Algorithms'
      ]
    },
    {
      title: 'MicroPython & IoT Sensor Interfacing',
      code: 'FS-PY-201',
      description: 'Firmware programming with MicroPython on ESP32, I2C OLED displays, temperature/humidity logging, and MQTT protocols.',
      icon: Code2,
      color: 'emerald',
      modules: [
        'Module 1: ESP32 Architecture & Thonny IDE Setup',
        'Module 2: I2C / SPI Bus Protocols & OLED Display Drivers',
        'Module 3: Analog-to-Digital Conversion (ADC) & Calibration',
        'Module 4: Wireless WiFi Telemetry & Cloud Dashboards'
      ]
    },
    {
      title: 'Embedded AI & Vision Systems',
      code: 'FS-AI-301',
      description: 'Edge computing, camera module interfacing, lightweight neural networks, and OpenCV object classification.',
      icon: Cpu,
      color: 'purple',
      modules: [
        'Module 1: Image Preprocessing & Thresholding on Edge Devices',
        'Module 2: Color Blob Tracking & Geometric Feature Extraction',
        'Module 3: Edge Impulse Model Training & Quantization',
        'Module 4: Real-Time Inference on Embedded Hardware'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Curriculum & Subject Tracks</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Standardized offline laboratory curricula, syllabi, hardware kit modules, and semester progressions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tracks.map((track, idx) => {
          const Icon = track.icon;
          return (
            <div key={idx} className="admin-card p-6 bg-slate-900/60 border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-xs text-blue-400 font-semibold bg-blue-950 px-2 py-0.5 rounded border border-blue-800/40">
                    {track.code}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-2">{track.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-5">{track.description}</p>

                <h4 className="text-[11px] font-mono font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
                  Core Laboratory Units
                </h4>
                <div className="space-y-2">
                  {track.modules.map((m, mIdx) => (
                    <div key={mIdx} className="p-2 rounded bg-slate-950 border border-slate-800/80 text-xs text-slate-300">
                      {m}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Status: <strong className="text-emerald-400">Active Syllabus</strong></span>
                <span>Academic Year 2025-26</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
