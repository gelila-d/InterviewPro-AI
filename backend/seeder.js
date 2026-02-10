const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Question = require('./models/Question');
const User = require('./models/User');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected for Seeding');
        importData();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

dotenv.config();
connectDB();

const questions = [
    {
        category: 'JavaScript',
        difficulty: 'Medium',
        questionText: 'Explain the concept of closures in JavaScript and provide an example.',
        hints: ['Think about scope chains', 'Inner functions accessing outer variables'],
        exampleInput: 'N/A',
        exampleOutput: 'N/A'
    },
    {
        category: 'DSA',
        difficulty: 'Easy',
        questionText: 'Write a function to reverse a string without using built-in reverse() method.',
        hints: ['Iterate backwards', 'Use a temporary string'],
        exampleInput: '"hello"',
        exampleOutput: '"olleh"'
    },
    {
        category: 'MERN',
        difficulty: 'Medium',
        questionText: 'Describe the role of middleware in Express.js.',
        hints: ['Request-Response cycle', 'next() function'],
        exampleInput: 'N/A',
        exampleOutput: 'N/A'
    },
    {
        category: 'System Design',
        difficulty: 'Hard',
        questionText: 'Design a URL shortening service like TinyURL.',
        hints: ['Hashing', 'Database schema', 'Redirect logic'],
        exampleInput: 'N/A',
        exampleOutput: 'N/A'
    }
];

const importData = async () => {
    try {
        await Question.deleteMany(); // Clear existing
        await Question.insertMany(questions);
        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};


