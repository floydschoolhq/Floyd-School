const crypto = require('crypto');
const User = require('../models/User');

/**
 * Generate next permanent Floyd Student ID
 * Format: FLOYD-STU-XXXXXX (e.g. FLOYD-STU-000001)
 */
async function generateStudentId() {
    // Find the latest user with a studentId
    const latestStudent = await User.findOne({
        studentId: { $regex: /^FLOYD-STU-\d+$/ }
    }).sort({ studentId: -1 }).select('studentId').lean();

    let nextNumber = 1;
    if (latestStudent && latestStudent.studentId) {
        const parts = latestStudent.studentId.split('FLOYD-STU-');
        if (parts.length === 2) {
            const parsed = parseInt(parts[1], 10);
            if (!isNaN(parsed)) {
                nextNumber = parsed + 1;
            }
        }
    }

    // Double check that the candidate ID does not exist
    let candidate = `FLOYD-STU-${String(nextNumber).padStart(6, '0')}`;
    while (await User.exists({ studentId: candidate })) {
        nextNumber++;
        candidate = `FLOYD-STU-${String(nextNumber).padStart(6, '0')}`;
    }

    return candidate;
}

/**
 * Generate next permanent Floyd Mentor ID
 * Format: FLOYD-MEN-XXXXX (e.g. FLOYD-MEN-00001)
 */
async function generateMentorId() {
    const latestMentor = await User.findOne({
        mentorId: { $regex: /^FLOYD-MEN-\d+$/ }
    }).sort({ mentorId: -1 }).select('mentorId').lean();

    let nextNumber = 1;
    if (latestMentor && latestMentor.mentorId) {
        const parts = latestMentor.mentorId.split('FLOYD-MEN-');
        if (parts.length === 2) {
            const parsed = parseInt(parts[1], 10);
            if (!isNaN(parsed)) {
                nextNumber = parsed + 1;
            }
        }
    }

    let candidate = `FLOYD-MEN-${String(nextNumber).padStart(5, '0')}`;
    while (await User.exists({ mentorId: candidate })) {
        nextNumber++;
        candidate = `FLOYD-MEN-${String(nextNumber).padStart(5, '0')}`;
    }

    return candidate;
}

/**
 * Generate a strong temporary password (10-12 characters)
 * Meets password criteria: uppercase, lowercase, numbers, special symbol
 */
function generateTempPassword() {
    const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const lower = 'abcdefghjkmnpqrstuvwxyz';
    const numbers = '23456789';
    const symbols = '!@#$%&*';

    let pass = '';
    pass += upper[crypto.randomInt(0, upper.length)];
    pass += lower[crypto.randomInt(0, lower.length)];
    pass += numbers[crypto.randomInt(0, numbers.length)];
    pass += symbols[crypto.randomInt(0, symbols.length)];

    const allChars = upper + lower + numbers + symbols;
    for (let i = 0; i < 6; i++) {
        pass += allChars[crypto.randomInt(0, allChars.length)];
    }

    // Shuffle characters
    return pass.split('').sort(() => 0.5 - Math.random()).join('');
}

module.exports = {
    generateStudentId,
    generateMentorId,
    generateTempPassword
};
