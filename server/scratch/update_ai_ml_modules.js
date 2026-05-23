const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Course = require('../models/Course');

const aiMlModules = [
    {
        title: "Week 01: Python from Scratch",
        description: "Variables, Datatypes and Basic Logic.",
        videoUrl: "",
        notesUrl: "",
        order: 1,
        completed: false
    },
    {
        title: "Week 02: Loops & Functions",
        description: "Automating repetitive tasks with ease.",
        videoUrl: "",
        notesUrl: "",
        order: 2,
        completed: false
    },
    {
        title: "Week 03: Files & Libraries",
        description: "Handling external data and open-source tools.",
        videoUrl: "",
        notesUrl: "",
        order: 3,
        completed: false
    },
    {
        title: "Week 04: Python Like a Pro",
        description: "Writing clean, production-level code.",
        videoUrl: "",
        notesUrl: "",
        order: 4,
        completed: false
    },
    {
        title: "Week 05: ChatGPT & OpenAI API",
        description: "Integrating LLMs into your own projects.",
        videoUrl: "",
        notesUrl: "",
        order: 5,
        completed: false
    },
    {
        title: "Week 06: APIs & Live Data",
        description: "Connecting your apps to the real world.",
        videoUrl: "",
        notesUrl: "",
        order: 6,
        completed: false
    },
    {
        title: "Week 07: Intro to Machine Learning",
        description: "Teaching computers to recognize patterns.",
        videoUrl: "",
        notesUrl: "",
        order: 7,
        completed: false
    },
    {
        title: "Week 08: Classification",
        description: "Building models that predict and group data.",
        videoUrl: "",
        notesUrl: "",
        order: 8,
        completed: false
    },
    {
        title: "Week 09: OpenCV & Vision",
        description: "Developing apps that can see and perceive.",
        videoUrl: "",
        notesUrl: "",
        order: 9,
        completed: false
    },
    {
        title: "Week 10: Flask Web Framework",
        description: "Turning scripts into web apps that anyone can use.",
        videoUrl: "",
        notesUrl: "",
        order: 10,
        completed: false
    },
    {
        title: "Final Milestone: Final Project & Demo Day",
        description: "Intensive building followed by a live global presentation of your Face Recognition system.",
        videoUrl: "",
        notesUrl: "",
        order: 11,
        completed: false
    }
];

async function updateModules() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('CONNECTED TO DATABASE.');

        const course = await Course.findById('69ff38141cad938780ccdbeb');
        if (!course) {
            console.error('AI & Machine Learning course not found.');
            process.exit(1);
        }

        console.log(`Current Modules Count for "${course.title}":`, course.modules.length);
        
        course.modules = aiMlModules;
        await course.save();

        console.log('SUCCESSFULLY SEEDED ROADMAP MODULES IN DATABASE.');
        console.log('New modules:', course.modules.map(m => m.title));

        process.exit(0);
    } catch (error) {
        console.error('Update failed:', error);
        process.exit(1);
    }
}

updateModules();
