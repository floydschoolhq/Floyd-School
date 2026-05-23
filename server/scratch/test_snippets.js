const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const CodeSnippet = require('../models/CodeSnippet');

async function testSnippets() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB successfully!');

        // Find a student user
        const student = await User.findOne({ role: 'student' });
        if (!student) {
            console.log('No student user found. Checking users...');
            const users = await User.find({}).limit(5);
            console.log('Users:', users.map(u => ({ id: u._id, name: u.name, role: u.role })));
            return;
        }

        console.log(`Using student: ${student.name} (${student.email}), ID: ${student._id}`);

        // Try to query code snippets
        console.log('Querying code snippets...');
        const snippets = await CodeSnippet.find({ user: student._id });
        console.log(`Found ${snippets.length} snippets.`);
        console.log('Snippets:', snippets);

        // Try to insert/upsert a test snippet
        console.log('Attempting test upsert...');
        const languageId = 63; // JS
        const languageName = 'JavaScript';
        const code = 'console.log("hello world");';

        const updated = await CodeSnippet.findOneAndUpdate(
            {
                user: student._id,
                languageId
            },
            {
                $set: { code },
                $setOnInsert: {
                    user: student._id,
                    languageId,
                    languageName
                }
            },
            {
                new: true,
                upsert: true,
                runValidators: true
            }
        );
        console.log('Upserted successfully:', updated);

        // Retrieve again
        const retrieved = await CodeSnippet.findOne({ user: student._id, languageId });
        console.log('Retrieved successfully:', retrieved);

        // Cleanup test snippet
        await CodeSnippet.deleteOne({ _id: retrieved._id });
        console.log('Cleaned up test snippet.');

    } catch (error) {
        console.error('Error during test:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected.');
    }
}

testSnippets();
