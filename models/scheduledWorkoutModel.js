const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const scheduledWorkoutSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    trainer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trainer',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    workoutType: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['scheduled', 'completed', 'cancelled'],
        default: 'scheduled'
    },
    notes: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('ScheduledWorkout', scheduledWorkoutSchema);
