const mongoose = require('mongoose');

const chatbotLeadSchema = new mongoose.Schema({
  // Student Information
  studentName: {
    type: String,
    trim: true,
    default: null
  },
  schoolName: {
    type: String,
    trim: true,
    default: null
  },
  contactInfo: {
    type: String,
    trim: true,
    default: null
  },
  
  // Chat Flow Information
  selectedCourse: {
    type: String,
    enum: ['AI & Machine Learning', 'Web Development', 'Cybersecurity', 'IoT & Robotics', 'Not Sure', 'School Partnership'],
    default: null
  },
  userPath: {
    type: String,
    enum: ['direct_ai', 'redirected_to_ai', 'partnership_inquiry'],
    default: null
  },
  
  // Metadata
  status: {
    type: String,
    enum: ['new', 'contacted', 'converted', 'closed'],
    default: 'new'
  },
  source: {
    type: String,
    default: 'chatbot'
  },
  userAgent: {
    type: String,
    default: null
  },
  ipAddress: {
    type: String,
    default: null
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better query performance
chatbotLeadSchema.index({ createdAt: -1 });
chatbotLeadSchema.index({ status: 1 });
chatbotLeadSchema.index({ selectedCourse: 1 });

module.exports = mongoose.model('ChatbotLead', chatbotLeadSchema);
