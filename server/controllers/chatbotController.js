const ChatbotLead = require('../models/chatbotLead');
const mongoose = require('mongoose');

// Save chatbot lead to database
exports.saveChatbotLead = async (req, res) => {
  try {
    const { studentName, schoolName, contactInfo, selectedCourse, userPath } = req.body;
    
    // Get client info
    const userAgent = req.get('User-Agent');
    const ipAddress = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;

    // Create new lead
    const newLead = new ChatbotLead({
      studentName,
      schoolName,
      contactInfo,
      selectedCourse,
      userPath,
      userAgent,
      ipAddress
    });

    const savedLead = await newLead.save();
    console.log(`[Chatbot] Lead saved successfully: ${savedLead._id} - ${studentName}`);

    res.status(201).json({
      success: true,
      message: 'Lead saved successfully',
      data: newLead
    });
  } catch (error) {
    console.error('Error saving chatbot lead:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving lead',
      error: error.message
    });
  }
};

// Get all chatbot leads for admin
exports.getAllChatbotLeads = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, course } = req.query;
    const skip = (page - 1) * limit;

    // Build query
    const query = {};
    if (status) query.status = status;
    if (course) query.selectedCourse = course;

    // Get leads with pagination
    const leads = await ChatbotLead.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await ChatbotLead.countDocuments(query);

    res.status(200).json({
      success: true,
      data: leads,
      pagination: {
        current: parseInt(page),
        pageSize: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching chatbot leads:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching leads',
      error: error.message
    });
  }
};

// Get single lead by ID
exports.getChatbotLeadById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const lead = await ChatbotLead.findById(id);
    
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (error) {
    console.error('Error fetching lead:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching lead',
      error: error.message
    });
  }
};

// Update lead status
exports.updateLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const lead = await ChatbotLead.findByIdAndUpdate(
      id,
      { 
        status,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lead status updated successfully',
      data: lead
    });
  } catch (error) {
    console.error('Error updating lead status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating lead status',
      error: error.message
    });
  }
};

// Delete lead
exports.deleteChatbotLead = async (req, res) => {
  try {
    const { id } = req.params;

    const lead = await ChatbotLead.findByIdAndDelete(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting lead:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting lead',
      error: error.message
    });
  }
};

// Get statistics
exports.getChatbotStats = async (req, res) => {
  try {
    const stats = await ChatbotLead.aggregate([
      {
        $group: {
          _id: '$selectedCourse',
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: null,
          totalLeads: { $sum: 1 },
          newLeads: {
            $sum: {
              $cond: [{ $eq: ['$status', 'new'] }, 1, 0]
            }
          },
          contactedLeads: {
            $sum: {
              $cond: [{ $eq: ['$status', 'contacted'] }, 1, 0]
            }
          },
          convertedLeads: {
            $sum: {
              $cond: [{ $eq: ['$status', 'converted'] }, 1, 0]
            }
          }
        }
      }
    ]);

    // Get today's leads
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayLeads = await ChatbotLead.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow }
    });

    res.status(200).json({
      success: true,
      data: {
        ...stats[2], // Overall stats
        todayLeads,
        courseBreakdown: stats[0],
        statusBreakdown: stats[1]
      }
    });
  } catch (error) {
    console.error('Error fetching chatbot stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};
