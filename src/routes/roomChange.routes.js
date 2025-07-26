import express from 'express';
import { submitRoomChange,
        getStudentRoomChangeRequests, 
        updateRoomChangeStatus,
        getAllRoomChangeRequests 
     } from '../controllers/roomChange.controller.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// POST /api/room-change
router.post('/', protect, restrictTo('student'),submitRoomChange);
router.get('/my-requests', protect,restrictTo('student'), getStudentRoomChangeRequests);

// Warden routes
router.get('/', protect, restrictTo('warden'), getAllRoomChangeRequests);
router.put('/:id/status', protect, restrictTo('warden'), updateRoomChangeStatus);


export default router;
