const User = require('../models/userModel');
const mongoose = require('mongoose');

// get all users
const getUsers = async (req, res) => {
    const { active, membershipType } = req.query;
    const filter = {};

    if (active) {
        filter.active = active === 'true';
    }
    if (membershipType) {
        filter.membershipType = membershipType;
    }

    const users = await User.find(filter).sort({ createdAt: -1 });
    res.status(200).json(users);
};

// get a single user
const getUser = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such user' });
    }

    const user = await User.findById(id);

    if (!user) {
        return res.status(404).json({ error: 'No such user' });
    }

    res.status(200).json(user);
};

// create a new user
const createUser = async (req, res) => {
    const { name, email, age, membershipType, active } = req.body;

    try {
        const user = await User.create({ name, email, age, membershipType, active });
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// delete a user
const deleteUser = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such user' });
    }

    const user = await User.findOneAndDelete({ _id: id });

    if (!user) {
        return res.status(400).json({ error: 'No such user' });
    }

    res.status(200).json(user);
};

// update a user
const updateUser = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such user' });
    }

    const user = await User.findOneAndUpdate({ _id: id }, {
        ...req.body
    }, { new: true });

    if (!user) {
        return res.status(400).json({ error: 'No such user' });
    }

    res.status(200).json(user);
};

module.exports = {
    getUsers,
    getUser,
    createUser,
    deleteUser,
    updateUser
};
