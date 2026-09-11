const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    platformName: {
        type: String,
        default: 'Floyd School'
    },
    maintenanceMode: {
        isActive: {
            type: Boolean,
            default: false
        },
        message: {
            type: String,
            default: 'System is undergoing scheduled maintenance. Please check back shortly.'
        },
        allowedRoles: [{
            type: String,
            enum: ['admin', 'mentor', 'student', 'growth_associate'],
            default: ['admin']
        }]
    },
    moduleLocks: {
        codingLab: { type: Boolean, default: false },
        assignments: { type: Boolean, default: false },
        liveClasses: { type: Boolean, default: false },
        masterclasses: { type: Boolean, default: false },
        chat: { type: Boolean, default: false },
        scheduledLive: { type: Boolean, default: false }
    },
    offlineMaintenance: {
        entirePlatform: {
            isActive: { type: Boolean, default: false },
            message: { type: String, default: 'Offline platform is undergoing scheduled maintenance. Please check back shortly.' },
            startTime: { type: Date, default: null },
            endTime: { type: Date, default: null }
        },
        schoolStudent: {
            isActive: { type: Boolean, default: false },
            message: { type: String, default: 'Student Portal is undergoing scheduled maintenance. Please check back shortly.' },
            startTime: { type: Date, default: null },
            endTime: { type: Date, default: null }
        },
        partnerSchool: {
            isActive: { type: Boolean, default: false },
            message: { type: String, default: 'Partner School Portal is undergoing scheduled maintenance. Please check back shortly.' },
            startTime: { type: Date, default: null },
            endTime: { type: Date, default: null }
        },
        mentorSchool: {
            isActive: { type: Boolean, default: false },
            message: { type: String, default: 'Mentor Portal is undergoing scheduled maintenance. Please check back shortly.' },
            startTime: { type: Date, default: null },
            endTime: { type: Date, default: null }
        }
    },
    academicConfig: {
        currentAcademicYear: { type: String, default: '2025-2026' },
        lowAttendanceThreshold: { type: Number, default: 75 },
        defaultBatchCapacity: { type: Number, default: 50 }
    },
    globalConfig: {
        supportEmail: { type: String, default: 'support@floydschool.in' },
        contactNumbers: [{ type: String }],
        socialLinks: {
            linkedin: String,
            twitter: String,
            instagram: String
        }
    },
    security: {
        mfaRequired: { type: Boolean, default: false },
        maxLoginAttempts: { type: Number, default: 5 }
    }
}, {
    timestamps: true
});

// Ensure only one settings document exists
settingsSchema.statics.getInstance = async function () {
    let settings = await this.findOne();
    if (!settings) {
        settings = await this.create({});
    }
    return settings;
};

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;
