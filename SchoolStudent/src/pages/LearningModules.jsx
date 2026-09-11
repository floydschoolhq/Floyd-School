import React, { useState, useEffect } from 'react';
import { Cpu, BookOpen, Download, FileText, CheckCircle2, ChevronRight, Layers, FileCode, Presentation, Image, ExternalLink, RefreshCw } from 'lucide-react';
import api from '../api/axios';

const LearningModules = () => {
  const [activeTab, setActiveTab] = useState('curriculum'); // 'curriculum' | 'batchMaterials'
  const [selectedModule, setSelectedModule] = useState(0);
  const [batchMaterials, setBatchMaterials] = useState([]);
  const [loadingMaterials, setLoadingMaterials] = useState(false);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    setLoadingMaterials(true);
    try {
      const res = await api.get('/school-student/materials');
      if (res.data?.data) {
        setBatchMaterials(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching batch materials:', err);
    } finally {
      setLoadingMaterials(false);
    }
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'code': return <FileCode size={16} className="text-blue-500" />;
      case 'ppt': return <Presentation size={16} className="text-orange-500" />;
      case 'image': return <Image size={16} className="text-emerald-500" />;
      case 'link': return <ExternalLink size={16} className="text-purple-500" />;
      default: return <FileText size={16} className="text-rose-500" />;
    }
  };

  const modules = [
    {
      id: 1,
      title: 'Module 1: Microcontroller Fundamentals & Breadboard Circuits',
      description: 'Understanding GPIO pins, digital signals, LEDs, resistors, and breadboard circuitry.',
      lessons: [
        {
          title: 'Lesson 1.1: Microcontroller Pinout & Power Rails',
          type: 'Classroom Theory & Hardware Setup',
          notes: 'Powering development boards safely with 3.3V / 5V DC. Identifying GPIO input/output pins.',
          resourceName: 'Microcontroller_Pinout_Reference.pdf'
        },
        {
          title: 'Lesson 1.2: Breadboard Circuit Wiring & Digital Output',
          type: 'Hands-on Lab Session',
          notes: 'Wiring multi-color LEDs and current-limiting resistors (220Ω / 330Ω). Writing blinking scripts in MicroPython.',
          resourceName: 'Breadboard_Wiring_Cheatsheet.pdf'
        }
      ]
    },
    {
      id: 2,
      title: 'Module 2: Sensors, Inputs & Analog-to-Digital Conversion',
      description: 'Interfacing tactile switches, ultrasonic distance sensors, and LDR light sensors.',
      lessons: [
        {
          title: 'Lesson 2.1: Ultrasonic Distance Measurement (HC-SR04)',
          type: 'Hardware Sensor Lab',
          notes: 'Trigger and Echo pulse timing. Calculating speed of sound: distance = (time * 0.0343) / 2.',
          resourceName: 'HCSR04_Sensor_Integration_Guide.pdf'
        },
        {
          title: 'Lesson 2.2: Analog Light Sensing & Threshold Triggering',
          type: 'Hardware Sensor Lab',
          notes: 'Reading ADC values from 0 to 4095. Calibrating light sensitivity for automated night switches.',
          resourceName: 'ADC_Sensor_Lab_Notes.pdf'
        }
      ]
    },
    {
      id: 3,
      title: 'Module 3: Actuators, Motors & Robotics Mechanisms',
      description: 'Driving DC motors with L298N/L9110 drivers and controlling SG90 positional servos.',
      lessons: [
        {
          title: 'Lesson 3.1: Servo Motor Angle Control with PWM',
          type: 'Actuator Lab',
          notes: 'Pulse Width Modulation (PWM) at 50Hz frequency. Mapping 0° to 180° angles for robotic arms.',
          resourceName: 'Servo_PWM_Control_Schematic.pdf'
        },
        {
          title: 'Lesson 3.2: Dual DC Motor Chassis Driving',
          type: 'Robotics Assembly Lab',
          notes: 'H-Bridge driver circuits for differential drive robot steering, forward, reverse, and skid turns.',
          resourceName: 'Dual_Motor_Driver_Wiring.pdf'
        }
      ]
    }
  ];

  const currentMod = modules[selectedModule] || modules[0];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="card-modern rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2 text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
              <Cpu size={15} />
              <span>Offline STEM & Robotics Lab Curriculum</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Classroom Learning Materials & Lab Guides
            </h1>
            <p className="text-slate-600 text-xs mt-0.5 leading-relaxed max-w-2xl">
              Hardware schematics, pinout diagrams, and workbook guides designed to accompany your physical lab experiments.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 shrink-0">
            <button
              onClick={() => setActiveTab('curriculum')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'curriculum'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Curriculum Guides
            </button>
            <button
              onClick={() => setActiveTab('batchMaterials')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                activeTab === 'batchMaterials'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Batch Materials</span>
              {batchMaterials.length > 0 && (
                <span className="bg-slate-900 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {batchMaterials.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'batchMaterials' ? (
        /* Mentor Uploaded Materials View */
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Materials Uploaded by Offline Mentor
            </h2>
            <button
              onClick={fetchMaterials}
              className="text-xs text-slate-600 hover:text-slate-900 flex items-center space-x-1"
            >
              <RefreshCw size={12} className={loadingMaterials ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
          </div>

          {loadingMaterials ? (
            <div className="card-modern rounded-xl p-8 text-center text-xs text-slate-500">
              Loading batch materials...
            </div>
          ) : batchMaterials.length === 0 ? (
            <div className="card-modern rounded-xl p-10 text-center space-y-2">
              <Layers size={32} className="mx-auto text-slate-300" />
              <h3 className="text-sm font-bold text-slate-700">No class materials uploaded yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Your offline mentor has not shared any supplementary slides, code files, or worksheets for this batch yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {batchMaterials.map((mat) => (
                <div key={mat._id} className="card-modern rounded-xl p-4 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <div className="p-2 rounded-lg bg-slate-100 border border-slate-200">
                          {getFileIcon(mat.fileType)}
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-slate-900 line-clamp-1">{mat.title}</h3>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {mat.moduleName || 'Classroom Material'}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                        {mat.fileType}
                      </span>
                    </div>

                    {mat.description && (
                      <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2">
                        {mat.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 text-[10px]">
                      By {mat.uploadedBy?.name || 'Mentor'} • {new Date(mat.createdAt).toLocaleDateString()}
                    </span>

                    <a
                      href={mat.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-modern-primary px-3 py-1 rounded text-xs font-semibold flex items-center space-x-1"
                    >
                      <Download size={12} />
                      <span>Access Material</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Static Companion Guides */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Module Selection Navigation */}
          <div className="card-modern rounded-xl p-4 space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 px-1">Curriculum Modules</p>
            <div className="space-y-1.5">
              {modules.map((m, idx) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedModule(idx)}
                  className={`w-full text-left p-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-between ${
                    selectedModule === idx
                      ? 'bg-slate-900 text-white font-bold shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80'
                  }`}
                >
                  <div className="space-y-0.5 pr-2">
                    <p className="truncate">{m.title}</p>
                    <p className={`text-[10px] font-normal truncate ${selectedModule === idx ? 'text-slate-300' : 'text-slate-500'}`}>
                      {m.lessons.length} Lab Guides
                    </p>
                  </div>
                  <ChevronRight size={14} className={selectedModule === idx ? 'text-white' : 'text-slate-400'} />
                </button>
              ))}
            </div>
          </div>

          {/* Selected Module Detail */}
          <div className="lg:col-span-2 card-modern rounded-xl p-6 space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2 text-slate-500 text-xs font-semibold uppercase">
                <Layers size={14} />
                <span>Lab Module Overview</span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-1">{currentMod.title}</h2>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{currentMod.description}</p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Lesson Guides & Lab Materials</h3>
              {currentMod.lessons.map((lesson, lIdx) => (
                <div key={lIdx} className="bg-slate-50 border border-slate-200/80 rounded-lg p-4 space-y-2.5 shadow-2xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{lesson.title}</h4>
                      <span className="text-[10px] font-semibold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full inline-block mt-1">
                        {lesson.type}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-relaxed">{lesson.notes}</p>

                  <div className="pt-1 flex items-center justify-between border-t border-slate-200/60">
                    <div className="flex items-center space-x-1.5 text-[10px] text-slate-600 font-mono">
                      <FileText size={12} className="text-slate-400" />
                      <span>{lesson.resourceName}</span>
                    </div>

                    <a
                      href={`#download-${lesson.resourceName}`}
                      onClick={(e) => {
                        e.preventDefault();
                        alert(`Reference guide "${lesson.resourceName}" is bundled in your physical offline STEM workbook.`);
                      }}
                      className="btn-modern-secondary px-2.5 py-1 rounded text-[11px] font-semibold flex items-center space-x-1"
                    >
                      <Download size={11} />
                      <span>Lab Sheet</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningModules;
