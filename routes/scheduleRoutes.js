const express = require('express');
const {
    scheduleWorkout,
    getScheduledWorkouts,
    getScheduledWorkout,
    updateScheduleStatus
} = require('../controllers/scheduleController');

const router = express.Router();

// GET all scheduled workouts
router.get('/', getScheduledWorkouts);

// GET a single scheduled workout
router.get('/:id', getScheduledWorkout);

// POST a new schedule
router.post('/', scheduleWorkout);

// UPDATE status
router.patch('/:id', updateScheduleStatus);

module.exports = router;
