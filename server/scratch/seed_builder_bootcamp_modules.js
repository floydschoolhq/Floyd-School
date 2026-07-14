const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Course = require('../models/Course');

// ─────────────────────────────────────────────────────────────────────────────
//  Floyd School Summer Builder Program — 30-Day Full Roadmap
//  Course ID: 69ff38141cad938780ccdbef
// ─────────────────────────────────────────────────────────────────────────────
const builderBootcampModules = [
    // ── WEEK 1 · FOUNDATIONS ──────────────────────────────────────────────
    {
        title: "Day 01: Welcome & Bootcamp Kickoff",
        description: "Orientation, goal-setting, team formations and setting up your developer workspace.",
        videoUrl: "",
        notesUrl: "",
        order: 1,
        completed: false
    },
    {
        title: "Day 02: How the Internet Works",
        description: "Client-server model, DNS, HTTP/HTTPS, requests & responses explained visually.",
        videoUrl: "",
        notesUrl: "",
        order: 2,
        completed: false
    },
    {
        title: "Day 03: HTML — Building Blocks of the Web",
        description: "Semantic HTML5, forms, tables, media elements and page structure.",
        videoUrl: "",
        notesUrl: "",
        order: 3,
        completed: false
    },
    {
        title: "Day 04: CSS — Making Things Beautiful",
        description: "Selectors, box model, flexbox, grid and responsive design principles.",
        videoUrl: "",
        notesUrl: "",
        order: 4,
        completed: false
    },
    {
        title: "Day 05: CSS Animations & UI Polish",
        description: "Transitions, keyframes, hover effects and building a stunning landing page.",
        videoUrl: "",
        notesUrl: "",
        order: 5,
        completed: false
    },

    // ── WEEK 2 · JAVASCRIPT & LOGIC ───────────────────────────────────────
    {
        title: "Day 06: JavaScript Fundamentals",
        description: "Variables, data types, operators, conditionals and loops from zero.",
        videoUrl: "",
        notesUrl: "",
        order: 6,
        completed: false
    },
    {
        title: "Day 07: Functions, Arrays & Objects",
        description: "Writing reusable logic, working with collections and JSON-like structures.",
        videoUrl: "",
        notesUrl: "",
        order: 7,
        completed: false
    },
    {
        title: "Day 08: The DOM — JavaScript Meets HTML",
        description: "Selecting elements, event listeners, dynamic content and building interactive UIs.",
        videoUrl: "",
        notesUrl: "",
        order: 8,
        completed: false
    },
    {
        title: "Day 09: APIs & Fetch — Talking to the World",
        description: "What APIs are, JSON, using fetch() and displaying real-world live data.",
        videoUrl: "",
        notesUrl: "",
        order: 9,
        completed: false
    },
    {
        title: "Day 10: Mini-Project #1 — Weather App",
        description: "Build a fully functional weather dashboard using OpenWeatherMap API.",
        videoUrl: "",
        notesUrl: "",
        order: 10,
        completed: false
    },

    // ── WEEK 3 · REACT & MODERN FRONTEND ─────────────────────────────────
    {
        title: "Day 11: Intro to React",
        description: "Why React, components, JSX syntax, props and the virtual DOM concept.",
        videoUrl: "",
        notesUrl: "",
        order: 11,
        completed: false
    },
    {
        title: "Day 12: React State & Events",
        description: "useState hook, handling events, controlled inputs and reactive interfaces.",
        videoUrl: "",
        notesUrl: "",
        order: 12,
        completed: false
    },
    {
        title: "Day 13: React Router & Multi-Page Apps",
        description: "Client-side routing, navigation, dynamic routes and page layouts.",
        videoUrl: "",
        notesUrl: "",
        order: 13,
        completed: false
    },
    {
        title: "Day 14: Connecting React to APIs",
        description: "useEffect for data fetching, loading states, error handling and async patterns.",
        videoUrl: "",
        notesUrl: "",
        order: 14,
        completed: false
    },
    {
        title: "Day 15: Mini-Project #2 — Quiz App",
        description: "Build a dynamic quiz app with real-time scoring, timer and leaderboard.",
        videoUrl: "",
        notesUrl: "",
        order: 15,
        completed: false
    },

    // ── WEEK 4 · BACKEND & DATABASES ─────────────────────────────────────
    {
        title: "Day 16: Intro to Backend & Node.js",
        description: "How servers work, Node.js runtime, npm packages and running your first server.",
        videoUrl: "",
        notesUrl: "",
        order: 16,
        completed: false
    },
    {
        title: "Day 17: Express.js — Building APIs",
        description: "REST principles, routes, controllers, middleware and handling JSON requests.",
        videoUrl: "",
        notesUrl: "",
        order: 17,
        completed: false
    },
    {
        title: "Day 18: MongoDB & Databases",
        description: "NoSQL fundamentals, MongoDB Atlas setup, Mongoose and CRUD operations.",
        videoUrl: "",
        notesUrl: "",
        order: 18,
        completed: false
    },
    {
        title: "Day 19: Authentication — Login & Signup",
        description: "User models, hashing passwords with bcrypt, JWT tokens and protected routes.",
        videoUrl: "",
        notesUrl: "",
        order: 19,
        completed: false
    },
    {
        title: "Day 20: Full-Stack Connection",
        description: "Connecting your React frontend to your Express backend end-to-end.",
        videoUrl: "",
        notesUrl: "",
        order: 20,
        completed: false
    },

    // ── WEEK 5 · AI & ADVANCED FEATURES ──────────────────────────────────
    {
        title: "Day 21: Intro to AI & Prompt Engineering",
        description: "How AI models work, ChatGPT API basics and writing effective prompts.",
        videoUrl: "",
        notesUrl: "",
        order: 21,
        completed: false
    },
    {
        title: "Day 22: Building an AI-Powered Feature",
        description: "Integrate OpenAI into your app — auto-suggestions, summaries or chatbots.",
        videoUrl: "",
        notesUrl: "",
        order: 22,
        completed: false
    },
    {
        title: "Day 23: File Uploads & Cloud Storage",
        description: "Handling file uploads, Cloudinary integration and storing media in the cloud.",
        videoUrl: "",
        notesUrl: "",
        order: 23,
        completed: false
    },
    {
        title: "Day 24: Real-Time Features with Socket.io",
        description: "WebSockets fundamentals, Socket.io, live chat and real-time notifications.",
        videoUrl: "",
        notesUrl: "",
        order: 24,
        completed: false
    },
    {
        title: "Day 25: Mini-Project #3 — AI Chat App",
        description: "Build a real-time AI-powered chat application with user authentication.",
        videoUrl: "",
        notesUrl: "",
        order: 25,
        completed: false
    },

    // ── WEEK 6 · DEPLOYMENT & FINAL PROJECT ──────────────────────────────
    {
        title: "Day 26: Deployment — Going Live",
        description: "Deploying frontend to Vercel, backend to Render, and configuring environment variables.",
        videoUrl: "",
        notesUrl: "",
        order: 26,
        completed: false
    },
    {
        title: "Day 27: Version Control & GitHub",
        description: "Git fundamentals, branching, pull requests, collaboration and open-source workflows.",
        videoUrl: "",
        notesUrl: "",
        order: 27,
        completed: false
    },
    {
        title: "Day 28: Final Project — Planning & Building",
        description: "Define your MVP, wireframe your idea, and start building your capstone project.",
        videoUrl: "",
        notesUrl: "",
        order: 28,
        completed: false
    },
    {
        title: "Day 29: Final Project — Finishing Touches",
        description: "Polishing the UI, fixing bugs, writing a README and preparing your presentation.",
        videoUrl: "",
        notesUrl: "",
        order: 29,
        completed: false
    },
    {
        title: "Day 30: 🏆 Demo Day — Showcase & Graduation",
        description: "Present your live project to judges, mentors and the ThinkSkool community. Receive your certificate!",
        videoUrl: "",
        notesUrl: "",
        order: 30,
        completed: false
    }
];

async function seedBuilderBootcampModules() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB Atlas.');

        const course = await Course.findById('69ff38141cad938780ccdbef');
        if (!course) {
            console.error('❌ Floyd School Summer Builder Program course not found!');
            process.exit(1);
        }

        console.log(`📚 Course found: "${course.title}"`);
        console.log(`📦 Current module count: ${course.modules.length}`);

        course.modules = builderBootcampModules;
        await course.save();

        console.log('🚀 Successfully seeded 30 modules into the database!');
        console.log('\nModules added:');
        course.modules.forEach(m => console.log(`  ✓ ${m.title}`));

        process.exit(0);
    } catch (error) {
        console.error('❌ Seed failed:', error);
        process.exit(1);
    }
}

seedBuilderBootcampModules();
