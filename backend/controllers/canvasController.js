const Canvas = require('../models/canvasModel');
const User = require('../models/userModel');

const getAllCanvases = async (req, res) => {
    const email = req.email;
    try {
        const canvases = await Canvas.getAllCanvases(email);
        res.status(200).json(canvases);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const createCanvas = async (req, res) => {
    const email = req.email;
    const { name } = req.body;

    try {
        const newCanvas = await Canvas.createCanvas(email, name);
        res.status(201).json(newCanvas);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const loadCanvas = async (req, res) => {
    const email = req.email;
    const id = req.params.id;

    try {
        const canvas = await Canvas.loadCanvas(email, id);
        res.status(200).json(canvas);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateCanvas = async (req, res) => {
    const email = req.email;
    const id = req.params.id;
    const { elements } = req.body;
    try {
        const canvas = await Canvas.updateCanvas(email, id, elements);
        res.status(200).json(canvas);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const shareCanvas = async (req, res) => {
    const email = req.email;
    const id = req.params.id;
    const { shared_with } = req.body;

    // 1. Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shared_with)) {
        return res.status(400).json({ message: 'Invalid email format.' });
    }

    // 2. Check if user exists
    const userToShare = await User.findOne({ email: shared_with });
    if (!userToShare) {
        return res.status(404).json({ message: 'User to share with does not exist.' });
    }

    try {
        const canvas = await Canvas.shareCanvas(email, id, shared_with);
        res.status(200).json(canvas);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteCanvas = async (req, res) => {
    const email = req.email;
    const id = req.params.id;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found:', email);
            return res.status(404).json({ message: 'User not found' });
        }

        const canvas = await Canvas.findById(id);
        if (!canvas) {
            console.log('Canvas not found:', id);
            return res.status(404).json({ message: 'Canvas not found' });
        }

        // If owner, delete from DB
        if (canvas.owner.toString() === user._id.toString()) {
            await Canvas.findByIdAndDelete(id);
            console.log('Canvas deleted by owner:', id);
            return res.status(200).json({ message: 'Canvas deleted' });
        }

        // If shared, remove user from shared_with
        const wasShared = canvas.shared_with.map(uid => uid.toString()).includes(user._id.toString());
        if (wasShared) {
            canvas.shared_with = canvas.shared_with.filter(uid => uid.toString() !== user._id.toString());
            await canvas.save();
            console.log('User removed from shared canvases:', email, id);
            return res.status(200).json({ message: 'Removed from shared canvases' });
        }

        console.log('Not authorized:', email, id);
        return res.status(403).json({ message: 'Not authorized to delete this canvas' });
    } catch (error) {
        console.log('Error in deleteCanvas:', error);
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getAllCanvases,
    createCanvas,
    loadCanvas,
    updateCanvas,
    shareCanvas,
    deleteCanvas
};