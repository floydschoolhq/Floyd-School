const axios = require('axios');

class Judge0Service {
    constructor() {
        this.apiKey = process.env.JUDGE0_API_KEY;
        this.host = process.env.JUDGE0_HOST || 'judge0-ce.p.rapidapi.com';
        this.baseURL = `https://${this.host}`;
    }

    async submitCode(sourceCode, languageId, stdin = '', expectedOutput = '') {
        try {
            const options = {
                method: 'POST',
                url: `${this.baseURL}/submissions`,
                params: { base64_encoded: 'false', wait: 'false' },
                headers: {
                    'content-type': 'application/json',
                    'X-RapidAPI-Key': this.apiKey,
                    'X-RapidAPI-Host': this.host
                },
                data: {
                    language_id: languageId,
                    source_code: sourceCode,
                    stdin: stdin,
                    expected_output: expectedOutput
                }
            };

            const response = await axios.request(options);
            return response.data;
        } catch (error) {
            console.error('Judge0 submission error:', error.response?.data || error.message);
            throw new Error('Failed to submit code for execution');
        }
    }

    async getSubmission(token) {
        try {
            const options = {
                method: 'GET',
                url: `${this.baseURL}/submissions/${token}`,
                params: { base64_encoded: 'false' },
                headers: {
                    'X-RapidAPI-Key': this.apiKey,
                    'X-RapidAPI-Host': this.host
                }
            };

            const response = await axios.request(options);
            return response.data;
        } catch (error) {
            console.error('Judge0 get submission error:', error.response?.data || error.message);
            throw new Error('Failed to get submission status');
        }
    }

    async getSupportedLanguages() {
        try {
            const options = {
                method: 'GET',
                url: `${this.baseURL}/languages`,
                headers: {
                    'X-RapidAPI-Key': this.apiKey,
                    'X-RapidAPI-Host': this.host
                }
            };

            const response = await axios.request(options);
            return response.data;
        } catch (error) {
            console.error('Judge0 languages error:', error.response?.data || error.message);
            // Return default languages if API fails
            return this.getDefaultLanguages();
        }
    }

    getDefaultLanguages() {
        return [
            { id: 63, name: 'JavaScript (Node.js 12.14.0)' },
            { id: 71, name: 'Python (3.8.1)' },
            { id: 62, name: 'Java (OpenJDK 13.0.1)' },
            { id: 54, name: 'C++ (GCC 9.2.0)' },
            { id: 50, name: 'C (GCC 9.2.0)' },
            { id: 51, name: 'C# (Mono 6.6.0.161)' },
            { id: 72, name: 'Ruby (2.7.0)' },
            { id: 68, name: 'PHP (7.4.1)' },
            { id: 60, name: 'Go (1.13.5)' },
            { id: 78, name: 'Kotlin (1.3.70)' },
            { id: 82, name: 'SQL (SQLite 3.27.2)' },
            { id: 83, name: 'Swift (5.2.3)' },
            { id: 74, name: 'TypeScript (3.7.4)' }
        ];
    }

    getLanguageById(languageId) {
        const languages = {
            63: 'JavaScript',
            71: 'Python',
            62: 'Java',
            54: 'C++',
            50: 'C',
            51: 'C#',
            72: 'Ruby',
            68: 'PHP',
            60: 'Go',
            78: 'Kotlin',
            82: 'SQL',
            83: 'Swift',
            74: 'TypeScript'
        };
        return languages[languageId] || 'Unknown';
    }
}

module.exports = new Judge0Service();
