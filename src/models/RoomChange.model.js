import mongoose from 'mongoose';

const roomChangeSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
//   currentRoom: {
//     type: String,
//     required: true
//   },
//   currentBlockFloor: {
//     type: String,
//     required: true
//   },
//   bedType: {
//     type: String,
//     required: true
//   },
  preferredBlock: {
    type: String,
    required: true
  },
  preferredRoomNumber: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const RoomChangeRequest = mongoose.model('RoomChangeRequest', roomChangeSchema, 'room');

export default RoomChangeRequest;
