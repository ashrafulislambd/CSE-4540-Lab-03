const Trainer = require('../models/trainerModel');
const mongoose = require('mongoose');

// get all trainers
const getTrainers = async (req, res) => {
    const { specialization, available } = req.query;
    const filter = {};

    if (available) {
        filter.available = available === 'true';
    }
    if (specialization) {
        filter.specialization = { $in: [specialization] };
    }

    const trainers = await Trainer.find(filter).sort({ createdAt: -1 });
    res.status(200).json(trainers);
};

// get a single trainer
const getTrainer = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such trainer' });
    }

    const trainer = await Trainer.findById(id);

    if (!trainer) {
        return res.status(404).json({ error: 'No such trainer' });
    }

    res.status(200).json(trainer);
};

// create a new trainer
const createTrainer = async (req, res) => {
    const { name, email, specialization, experienceYears, hourlyRate, available, certifications } = req.body;

    try {
        const trainer = await Trainer.create({ name, email, specialization, experienceYears, hourlyRate, available, certifications });
        res.status(200).json(trainer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// delete a trainer
const deleteTrainer = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such trainer' });
    }

    const trainer = await Trainer.findOneAndDelete({ _id: id });

    if (!trainer) {
        return res.status(400).json({ error: 'No such trainer' });
    }

    res.status(200).json(trainer);
};

// update a trainer
const updateTrainer = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such trainer' });
    }

    const trainer = await Trainer.findOneAndUpdate({ _id: id }, {
        ...req.body
    }, { new: true });

    if (!trainer) {
        return res.status(400).json({ error: 'No such trainer' });
    }

    res.status(200).json(trainer);
};

module.exports = {
    getTrainers,
    getTrainer,
    createTrainer,
    deleteTrainer,
    updateTrainer
};
