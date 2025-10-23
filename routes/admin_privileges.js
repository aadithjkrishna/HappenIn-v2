import express from 'express';
import User from '../models/User.js';
import Resource from '../models/Resource.js';

const router = express.Router();

// GET all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users.map(user => ({
            id: user._id,
            name: user.fullname,
            username: user.username,
            address: user.address,
            email: user.email,
            phone: user.phone,
        })));
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

router.post('/resources', async (req, res) => {
    const { resourceName, quantity } = req.body;

    if (!resourceName || quantity == null) {
        return res.status(400).json({ message: "resourceName and quantity are required" });
    }

    try {
        const newResource = new Resource({ resourceName, quantity });
        await newResource.save();
        res.status(201).json(newResource);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

router.get('/resources', async (req, res) => {
    try {
        const resources = await Resource.find();
        res.json(resources);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

router.delete('/resources/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Resource.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "Resource not found" });
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

router.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        console.log("Editing user with ID:", id);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

router.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        console.log("Deleting user with ID:", id);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
