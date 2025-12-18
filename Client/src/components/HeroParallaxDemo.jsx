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
        <div className="w-full bg-slate-50 py-20 border-y border-slate-200" id="certification">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="md:w-1/2">
                    <h2 className="text-4xl font-black text-slate-900 mb-6">
                        Get Recognized with <span className="text-[#fca96d]">Industry Standard</span> Certificates
                    </h2>
                    <p className="text-lg text-slate-500 mb-8 leading-relaxed">
                        Earn certificates that are valued by top tech companies. Showcase your skills with verifiable credentials from ThinkSkool and our partners.
                    </p>
                    <button className="px-8 py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors">
                        View Sample Certificate
                    </button>
                </div>
                <div className="md:w-1/2 flex justify-center">
                    <div className="relative w-full max-w-md aspect-[4/3] bg-white rounded-xl shadow-2xl border border-slate-200 p-8 flex items-center justify-center">
                        {/* Abstract Certificate Placeholder */}
                        <div className="text-center border-4 border-double border-slate-100 p-8 w-full h-full flex flex-col justify-center">
                            <div className="w-16 h-16 bg-[#fca96d]/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <span className="text-3xl">🏆</span>
                            </div>
                            <h3 className="text-2xl font-serif text-slate-800 mb-2">Certificate of Completion</h3>
                            <p className="text-slate-400 text-sm">Validates that</p>
                            <p className="text-xl font-bold text-slate-900 my-2">John Doe</p>
                            <p className="text-slate-400 text-sm">has successfully completed the course.</p>
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
