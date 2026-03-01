"use client";
import React from "react";
import { HeroParallax } from "./ui/hero-parallax";

import image2 from "../assets/images/image001.jpg";
import image5 from "../assets/images/I3.jpg";
import image6 from "../assets/images/image001.jpg";
import image7 from "../assets/images/image001.jpg";
import image8 from "../assets/images/image004.jpg";

import image10 from "../assets/images/image001.jpg";

import image13 from "../assets/images/image006.png";
import image14 from "../assets/images/I4.jpg";
import image15 from "../assets/images/image005.jpg";
import image16 from "../assets/images/image002.jpg";
import image17 from "../assets/images/image003.jpg";
import image18 from "../assets/images/image002.jpg";


export function HeroParallaxDemo() {
    return (
        <div className="w-full bg-[#000000] py-24 border-y border-white/5" id="certification">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="md:w-1/2">
                    <p className="text-blue-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4">Global Recognition</p>
                    <h2 className="text-5xl font-black text-white mb-6 tracking-tighter">
                        Get Recognized with <span className="text-blue-500">Industry Standard</span> Certificates
                    </h2>
                    <p className="text-lg text-white/50 mb-8 leading-relaxed font-medium">
                        Earn certificates that are valued by top tech companies. Showcase your skills with verifiable credentials from <span className="text-blue-500">think</span><span className="text-[#FF7A00]">skool</span> and our partners.
                    </p>
                    <button className="px-10 py-4 bg-white/5 text-white border border-white/10 font-black uppercase text-xs tracking-[0.2em] rounded-2xl hover:bg-blue-600 hover:border-transparent transition-all shadow-xl">
                        View Sample Certificate
                    </button>
                </div>
                <div className="md:w-1/2 flex justify-center">
                    <div className="relative w-full max-w-md aspect-[4/3] bg-white/5 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl border border-white/10 p-8 flex items-center justify-center group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        {/* Abstract Certificate Placeholder */}
                        <div className="relative z-10 text-center border-4 border-double border-white/10 p-8 w-full h-full flex flex-col justify-center">
                            <div className="w-16 h-16 bg-white/5 rounded-full mx-auto mb-4 flex items-center justify-center border border-white/10">
                                <span className="text-3xl">🏆</span>
                            </div>
                            <h3 className="text-2xl font-black text-white mb-2">Certificate of Completion</h3>
                            <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">Validates that</p>
                            <p className="text-2xl font-black text-blue-400 my-4">Certified Student</p>
                            <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">has successfully completed the technical curriculum.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export const products = [
    {
        title: "",

        thumbnail: image13,
    },
    {
        title: "",
        thumbnail: image14,
    },
    {
        title: "",

        thumbnail: image7,
    },
    {
        title: "",

        thumbnail: image16,
    },
    {
        title: "",

        thumbnail: image15,
    },
    {
        title: "",

        thumbnail: image18,
    },
    {
        title: "",
        thumbnail: image17,
    },
    {
        title: "",

        thumbnail: image15,
    },
    {
        title: "",
        thumbnail: image13,
    },
    {
        title: "",
        thumbnail: image10,
    },
    {
        title: "",
        thumbnail: image2,
    },
    {
        title: "",
        thumbnail: image5,
    },
    {
        title: "",
        thumbnail: image6,
    },
    {
        title: "",
        thumbnail: image7,
    },
    {
        title: "",
        thumbnail: image8,
    },
];

