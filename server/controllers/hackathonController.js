const HackathonSchoolLead = require('../models/HackathonSchoolLead');
const HackathonParticipantLead = require('../models/HackathonParticipantLead');

// ─── PUBLIC ACTIONS ──────────────────────────────────────────────

// Save school host request
exports.saveSchoolLead = async (req, res) => {
  try {
    const {
      schoolName, schoolAddress, city, state, principalName,
      yourName, designation, email, phone, whatsappNumber,
      preferredMonth, expectedStudents, hallAvailable, projectorAvailable,
      additionalInfo
    } = req.body;

    const newLead = new HackathonSchoolLead({
      schoolName, schoolAddress, city, state, principalName,
      yourName, designation, email, phone, whatsappNumber,
      preferredMonth, expectedStudents, hallAvailable, projectorAvailable,
      additionalInfo
    });

    const savedLead = await newLead.save();
    console.log(`[Hackathon School Host] Lead saved successfully: ${savedLead._id} from ${schoolName}`);

    res.status(201).json({
      success: true,
      message: 'School hackathon host request submitted successfully',
      data: savedLead
    });
  } catch (error) {
    console.error('[Hackathon School Host] SAVE ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit school host request',
      error: error.message
    });
  }
};

// Save participant team registration
exports.saveParticipantLead = async (req, res) => {
  try {
    const {
      teamName, schoolName, city, classGroup, teamMembers,
      teamLeaderName, teamLeaderClass, teamLeaderWhatsapp, teamLeaderEmail,
      teammate2Name, teammate2Class, teammate3Name, teammate3Class, teammate4Name, teammate4Class,
      parentName, parentRelationship, parentWhatsapp, parentEmail,
      previousHackathon, additionalInfo
    } = req.body;

    const newLead = new HackathonParticipantLead({
      teamName, schoolName, city, classGroup, teamMembers: parseInt(teamMembers) || 2,
      teamLeaderName, teamLeaderClass, teamLeaderWhatsapp, teamLeaderEmail,
      teammate2Name, teammate2Class, teammate3Name, teammate3Class, teammate4Name, teammate4Class,
      parentName, parentRelationship, parentWhatsapp, parentEmail,
      previousHackathon, additionalInfo
    });

    const savedLead = await newLead.save();
    console.log(`[Hackathon Participant] Team registered successfully: ${savedLead._id} - ${teamName}`);

    res.status(201).json({
      success: true,
      message: 'Hackathon team registered successfully',
      data: savedLead
    });
  } catch (error) {
    console.error('[Hackathon Participant] SAVE ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register hackathon team',
      error: error.message
    });
  }
};

// ─── ADMIN GOVERNANCE ACTIONS ───────────────────────────────────

// Get all school host leads
exports.getSchoolLeads = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (status) query.status = status;

    const leads = await HackathonSchoolLead.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await HackathonSchoolLead.countDocuments(query);

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
    console.error('Error fetching school host leads:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching school host requests',
      error: error.message
    });
  }
};

// Get all participant team registrations
exports.getParticipantLeads = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, classGroup } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (status) query.status = status;
    if (classGroup) query.classGroup = classGroup;

    const leads = await HackathonParticipantLead.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await HackathonParticipantLead.countDocuments(query);

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
    console.error('Error fetching participant registrations:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching participant registrations',
      error: error.message
    });
  }
};

// Update school host status & notes
exports.updateSchoolLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    const lead = await HackathonSchoolLead.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!lead) {
      return res.status(404).json({ success: false, message: 'School lead not found' });
    }

    res.status(200).json({
      success: true,
      message: 'School lead status updated',
      data: lead
    });
  } catch (error) {
    console.error('Error updating school lead status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating status',
      error: error.message
    });
  }
};

// Update participant team status & notes
exports.updateParticipantLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    const lead = await HackathonParticipantLead.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Participant lead not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Participant lead status updated',
      data: lead
    });
  } catch (error) {
    console.error('Error updating participant lead status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating status',
      error: error.message
    });
  }
};

// Delete school host lead
exports.deleteSchoolLead = async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await HackathonSchoolLead.findByIdAndDelete(id);

    if (!lead) {
      return res.status(404).json({ success: false, message: 'School lead not found' });
    }

    res.status(200).json({ success: true, message: 'School host request deleted successfully' });
  } catch (error) {
    console.error('Error deleting school lead:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting lead',
      error: error.message
    });
  }
};

// Delete participant team lead
exports.deleteParticipantLead = async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await HackathonParticipantLead.findByIdAndDelete(id);

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Participant lead not found' });
    }

    res.status(200).json({ success: true, message: 'Participant team registration deleted successfully' });
  } catch (error) {
    console.error('Error deleting participant lead:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting lead',
      error: error.message
    });
  }
};

// Get unified statistics
exports.getHackathonStats = async (req, res) => {
  try {
    const totalSchools = await HackathonSchoolLead.countDocuments();
    const totalParticipants = await HackathonParticipantLead.countDocuments();

    // Today's boundaries
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaySchools = await HackathonSchoolLead.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow }
    });

    const todayParticipants = await HackathonParticipantLead.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow }
    });

    const schoolStatusBreakdown = await HackathonSchoolLead.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const participantStatusBreakdown = await HackathonParticipantLead.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        schools: {
          total: totalSchools,
          today: todaySchools,
          statusBreakdown: schoolStatusBreakdown
        },
        participants: {
          total: totalParticipants,
          today: todayParticipants,
          statusBreakdown: participantStatusBreakdown
        }
      }
    });
  } catch (error) {
    console.error('Error fetching hackathon stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching stats',
      error: error.message
    });
  }
};
