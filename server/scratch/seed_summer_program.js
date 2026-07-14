const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Course = require('../models/Course');
const User = require('../models/User');

dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

const summerProgram = {
    title: "Floyd School Summer Builder Program",
    description: "A high-octane 30-day summer internship. From foundations of software development to building real AI-powered applications with industry mentors.",
    category: "Software Development",
    icon: "Rocket",
    color: "text-blue-500",
    rating: "5.0",
    duration: "1 Month",
    price: 2499,
    originalPrice: 4999,
    currency: "INR",
    tags: ["Summer Internship", "Project Based", "Software", "AI"],
    difficulty: "Beginner",
    status: "published",
    isActive: true,
    deliveryDetails: {
        inSchool: {
            bootcamp: "7 Days intensive bootcamp",
            postBootcamp: "Willing students join with paid subscription"
        },
        online: {
            tutor: "1:1 dedicated tutor for doubt clearing",
            lectures: "Live interactive project sessions",
            chatSupport: "24/7 Discord community access",
            reporting: "Milestone-based progress tracking"
        }
    }
};

const seedSummerProgram = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected...');

        // Check if course already exists
        const existingCourse = await Course.findOne({ title: summerProgram.title });
        if (existingCourse) {
            console.log('Summer Builder Program already exists. Updating price and status...');
            existingCourse.price = summerProgram.price;
            existingCourse.originalPrice = summerProgram.originalPrice;
            existingCourse.status = 'published';
            existingCourse.isActive = true;
            await existingCourse.save();
            console.log('Updated successfully.');
        } else {
            // Find an instructor
            let instructor = await User.findOne({ role: 'mentor' });
            if (!instructor) {
                instructor = await User.findOne({ role: 'admin' });
            }
            
            if (!instructor) {
                console.error('No instructor found in database. Please create a mentor or admin first.');
                process.exit(1);
            }

            await Course.create({
                ...summerProgram,
                instructor: instructor._id
            });
            console.log('Summer Builder Program created successfully!');
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedSummerProgram();
