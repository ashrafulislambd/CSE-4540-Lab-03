const ScheduledWorkout = require('../models/scheduledWorkoutModel');
const User = require('../models/userModel');
const Trainer = require('../models/trainerModel');
const mongoose = require('mongoose');

// Schedule a workout
const scheduleWorkout = async (req, res) => {
    const { userId, trainerId, date, workoutType, notes } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(trainerId)) {
        return res.status(400).json({ error: 'Invalid user or trainer ID' });
    }

    try {
        // 1. Validate User
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (!['premium', 'elite'].includes(user.membershipType)) {
            return res.status(403).json({ error: 'Membership must be premium or elite to schedule workouts' });
        }

        // 2. Validate Trainer
        const trainer = await Trainer.findById(trainerId);
        if (!trainer) {
            return res.status(404).json({ error: 'Trainer not found' });
        }
        // Check specialization? (optional based on requirements, but good practice)
        // Check if trainer is available in general
        if (!trainer.available) {
            return res.status(400).json({ error: 'Trainer is not available' });
        }

        // 3. Check for specific time conflict (Bonus)
        const scheduleDate = new Date(date);
        // Assuming a workout takes 1 hour for conflict checking
        const oneHourLater = new Date(scheduleDate.getTime() + 60 * 60 * 1000);

        const conflict = await ScheduledWorkout.findOne({
            trainer: trainerId,
            date: { $gte: scheduleDate, $lt: oneHourLater },
            status: 'scheduled'
        });

        if (conflict) {
            return res.status(409).json({ error: 'Trainer is already booked at this time' });
        }

        // 4. Create Schedule
        const workout = await ScheduledWorkout.create({
            user: userId,
            trainer: trainerId,
            date: scheduleDate,
            workoutType,
            notes,
            status: 'scheduled'
        });

        res.status(200).json(workout);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all scheduled workouts
const getScheduledWorkouts = async (req, res) => {
    const workouts = await ScheduledWorkout.find({})
        .populate('user', 'name email')
        .populate('trainer', 'name specialization')
        .sort({ createdAt: -1 });

    res.status(200).json(workouts);
};

// get a single scheduled workout
const getScheduledWorkout = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such workout schedule' });
    }

    const workout = await ScheduledWorkout.findById(id)
        .populate('user', 'name email')
        .populate('trainer', 'name specialization');

    if (!workout) {
        return res.status(404).json({ error: 'No such workout schedule' });
    }

    res.status(200).json(workout);
};


// Update status (e.g. cancel, complete)
const updateScheduleStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such workout schedule' });
    }

    if (!['scheduled', 'completed', 'cancelled'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    const workout = await ScheduledWorkout.findOneAndUpdate({ _id: id }, {
        status
    }, { new: true });

    if (!workout) {
        return res.status(400).json({ error: 'No such workout schedule' });
    }

    res.status(200).json(workout);
};


module.exports = {
    scheduleWorkout,
    getScheduledWorkouts,
    getScheduledWorkout,
    updateScheduleStatus
};
