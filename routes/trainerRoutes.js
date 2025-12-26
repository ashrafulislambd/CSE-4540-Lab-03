const express = require('express');
const {
    getTrainers,
    getTrainer,
    createTrainer,
    deleteTrainer,
    updateTrainer
} = require('../controllers/trainerController');

const router = express.Router();

// GET all trainers
router.get('/', getTrainers);

// GET a single trainer
router.get('/:id', getTrainer);

// POST a new trainer
router.post('/', createTrainer);

// DELETE a trainer
router.delete('/:id', deleteTrainer);

// UPDATE a trainer
router.patch('/:id', updateTrainer);

module.exports = router;
