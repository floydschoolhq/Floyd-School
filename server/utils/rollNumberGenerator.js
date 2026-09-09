const User = require('../models/User');

/**
 * Generates a unique, standardized roll number in the format:
 * [SchoolCode]-[BatchCode]-[001]
 * Example: FLOY-001-001 or STXAV-B01-001
 * 
 * @param {Object} school - School document or object with code/name
 * @param {Object} batch - Batch document or object with code/name
 * @returns {Promise<string>} Unique roll number
 */
async function generateUniqueRollNumber(school, batch) {
    // School Code (2-4 uppercase characters)
    let schoolPrefix = 'FLOY';
    if (school) {
        if (school.code) {
            schoolPrefix = school.code.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5);
        } else if (school.name) {
            schoolPrefix = school.name.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4);
        }
    }
    if (!schoolPrefix) schoolPrefix = 'SCH';

    // Batch Code (3 uppercase alphanumeric characters)
    let batchPrefix = '001';
    if (batch) {
        if (batch.code) {
            batchPrefix = batch.code.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
        } else if (batch.name) {
            batchPrefix = batch.name.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 3);
        }
    }
    if (!batchPrefix) batchPrefix = 'B01';

    const basePrefix = `${schoolPrefix}-${batchPrefix}`;

    // Count existing students with this prefix to get starting index
    const count = await User.countDocuments({
        offlineRollNo: new RegExp(`^${basePrefix}-`, 'i')
    });

    let index = count + 1;
    let candidate = '';
    let exists = true;

    while (exists) {
        const paddedIndex = String(index).padStart(3, '0');
        candidate = `${basePrefix}-${paddedIndex}`;

        const existingStudent = await User.findOne({ offlineRollNo: candidate });
        if (!existingStudent) {
            exists = false;
        } else {
            index++;
        }
    }

    return candidate;
}

module.exports = { generateUniqueRollNumber };
