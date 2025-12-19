// Custom validation middleware for production-grade API safety
const validate = (schema) => (req, res, next) => {
    const errors = [];

    Object.keys(schema).forEach(key => {
        const rules = schema[key];
        const value = req.body[key];

        if (rules.required && (value === undefined || value === null || value === '')) {
            errors.push(`${key} is required`);
        } else if (value !== undefined) {
            if (rules.type === 'string' && typeof value !== 'string') {
                errors.push(`${key} must be a string`);
            } else if (rules.type === 'number' && typeof value !== 'number') {
                errors.push(`${key} must be a number`);
            } else if (rules.minLength && value.length < rules.minLength) {
                errors.push(`${key} must be at least ${rules.minLength} characters`);
            } else if (rules.maxLength && value.length > rules.maxLength) {
                errors.push(`${key} cannot exceed ${rules.maxLength} characters`);
            } else if (rules.min !== undefined && value < rules.min) {
                errors.push(`${key} must be at least ${rules.min}`);
            } else if (rules.max !== undefined && value > rules.max) {
                errors.push(`${key} cannot exceed ${rules.max}`);
            } else if (rules.pattern && !rules.pattern.test(value)) {
                errors.push(`${key} is in an invalid format`);
            }
        }
    });

    if (errors.length > 0) {
        return res.status(400).json({
            message: 'Validation failed',
            errors
        });
    }

    next();
};

const youtubePattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;

const schemas = {
    course: {
        title: { required: true, type: 'string', minLength: 5, maxLength: 100 },
        description: { required: true, type: 'string', minLength: 20 },
        category: { required: true, type: 'string' },
        difficulty: { required: true, type: 'string' },
        duration: { required: true, type: 'string' }
    },
    grading: {
        grade: { required: true, type: 'number', min: 0, max: 100 },
        feedback: { type: 'string', maxLength: 500 }
    },
    announcement: {
        title: { required: true, type: 'string', minLength: 3, maxLength: 50 },
        message: { required: true, type: 'string', minLength: 10, maxLength: 1000 }
    },
    liveClass: {
        title: { required: true, type: 'string', minLength: 5 },
        topic: { required: true, type: 'string', minLength: 3 },
        meetingLink: { required: true, type: 'string' }
    },
    supportMessage: {
        text: { required: true, type: 'string', minLength: 1 }
    }
};

module.exports = { validate, schemas };
