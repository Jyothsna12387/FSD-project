import asyncHandler from '../utils/asyncHandler.js';
import  RoomChangeRequest from '../models/RoomChange.model.js';
import User from '../models/User.model.js';

// POST /api/v1/room-change → student submits request
export const submitRoomChange = asyncHandler(async (req, res) => {
  const { preferredBlock, preferredRoomNumber, reason } = req.body;
 
  const studentId = req.user._id;
 
  const newRequest = await RoomChangeRequest.create({
    studentId,
    preferredBlock,
    preferredRoomNumber,
    reason,
    status: 'Pending',
  });
  res.status(201).json({ success: true, request: newRequest });
});
 
// Get all room change requests of a student (for history and status)
export const getStudentRoomChangeRequests = async (req, res, next) => {
  try {
    const studentId = req.user._id;

    const requests = await RoomChangeRequest.find({ studentId }).sort({ createdAt: -1 });

    res.status(200).json({ requests });
  } catch (err) {
    console.error("Error in getStudentRoomChangeRequests:", err);
    res.status(500).json({ message: "Failed to fetch room change history" });
  }
};

// GET /api/v1/room-change → warden gets all requests
export const getAllRoomChangeRequests = asyncHandler(async (req, res) => {
  const requests = await RoomChangeRequest.find()
    .populate('studentId', 'name roomNumber block')
    .sort({ createdAt: -1 });
  res.json({ success: true, requests });
});

 // PATCH /api/v1/room-change/:id/status -> warden may approve or rejects
export const updateRoomChangeStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['Approved', 'Rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  const request = await RoomChangeRequest.findById(id);
  if (!request) {
    return res.status(404).json({ message: 'Room change request not found' });
  }

  request.status = status;
  await request.save();

  res.status(200).json({ message: 'Status updated successfully', request });
});


