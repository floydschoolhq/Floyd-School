const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const CodeSnippet = require('../models/CodeSnippet');

async function listAllSnippets() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB successfully!');

        const snippets = await CodeSnippet.find({}).populate('user', 'name email role');
        console.log(`Total snippets found: ${snippets.length}`);
        snippets.forEach((snippet, index) => {
            console.log(`[${index + 1}] User: ${snippet.user ? snippet.user.name : 'Unknown User'} (${snippet.user ? snippet.user.email : 'No email'}), Lang: ${snippet.languageName} (ID: ${snippet.languageId}), Code Length: ${snippet.code ? snippet.code.length : 0}`);
        });

    } catch (error) {
        console.error('Error listing snippets:', error);
    } finally {
        await mongoose.disconnect();
    }
}

listAllSnippets();
