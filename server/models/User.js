const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: function() {
            return this.provider === 'local';
        },
    },
    role: {
        type: String,
        enum: ['student', 'mentor', 'admin', 'growth_associate', 'school_partner', 'school_student'],
        default: 'student',
    },
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PartnerSchool',
        default: null
    },
    batchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OfflineBatch',
        default: null
    },
    offlineRollNo: {
        type: String,
        default: null
    },
    grade: {
        type: String,
        default: null
    },
    section: {
        type: String,
        default: null
    },
    fatherName: {
        type: String,
        default: null
    },
    studentMobile: {
        type: String,
        default: null
    },
    fatherMobile: {
        type: String,
        default: null
    },
    approvalStatus: {
        type: String,
        enum: ['Pending_Approval', 'Approved', 'Rejected'],
        default: 'Approved'
    },
    permissions: {
        canAccessCourses: { type: Boolean, default: false },
        canAccessLabs: { type: Boolean, default: false },
        canAccessCommunity: { type: Boolean, default: false },
        enrolledSpecialCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
        grantedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    sessionToken: {
        type: String,
        default: null
    },
    googleId: {
        type: String,
        default: null
    },
    firebaseUid: {
        type: String,
        default: null
    },
    provider: {
        type: String,
        enum: ['local', 'google', 'firebase'],
        default: 'local'
    },
    mobileNumber: {
        type: String,
        default: null
    }
}, {
    timestamps: true,
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
userSchema.pre('save', async function () {
    if (!this.isModified('password') || this.provider === 'google' || this.provider === 'firebase') {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

module.exports = User;
