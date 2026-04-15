const SchoolPartnershipLead = require('../models/SchoolPartnershipLead');

// Save school partnership lead
exports.saveSchoolPartnershipLead = async (req, res) => {
  try {
    const { schoolName, contactPerson, designation, phone, city, domain, students, requirements } = req.body;
    
    const newLead = new SchoolPartnershipLead({
      schoolName,
      contactPerson,
      designation,
      phone,
      city,
      domain,
      approxStudents: students ? parseInt(students) : 0,
      requirements
    });

    const savedLead = await newLead.save();
    console.log(`[School Partnership] Lead saved successfully: ${savedLead._id} from ${schoolName}`);

    res.status(201).json({
      success: true,
      message: 'Partnership request submitted successfully',
      data: savedLead
    });
  } catch (error) {
    console.error('[School Partnership] SAVE ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save partnership request',
      error: error.message
    });
  }
};

// Get all school partnership leads
exports.getAllSchoolPartnershipLeads = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (status) query.status = status;

    const leads = await SchoolPartnershipLead.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await SchoolPartnershipLead.countDocuments(query);

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
    console.error('Error fetching school partnership leads:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching leads',
      error: error.message
    });
  }
};

// Get single lead
exports.getSchoolPartnershipLeadById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const lead = await SchoolPartnershipLead.findById(id);
    
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
exports.updateSchoolPartnershipLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const updateData = { status };
    if (notes) updateData.notes = notes;

    const lead = await SchoolPartnershipLead.findByIdAndUpdate(
      id,
      updateData,
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
      message: 'Lead status updated',
      data: lead
    });
  } catch (error) {
    console.error('Error updating lead status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating status',
      error: error.message
    });
  }
};

// Delete lead
exports.deleteSchoolPartnershipLead = async (req, res) => {
  try {
    const { id } = req.params;

    const lead = await SchoolPartnershipLead.findByIdAndDelete(id);

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
exports.getSchoolPartnershipStats = async (req, res) => {
  try {
    const total = await SchoolPartnershipLead.countDocuments();
    
    const statusStats = await SchoolPartnershipLead.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const domainStats = await SchoolPartnershipLead.aggregate([
      {
        $group: {
          _id: '$domain',
          count: { $sum: 1 }
        }
      }
    ]);

    // Today's leads
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayLeads = await SchoolPartnershipLead.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow }
    });

    res.status(200).json({
      success: true,
      data: {
        total,
        todayLeads,
        statusBreakdown: statusStats,
        domainBreakdown: domainStats
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};