import About from "../models/About.js";

// Admin – Create
export const createAbout = async (req, res) => {
  try {
    const { description } = req.body;
    if (!description) return res.status(400).json({ message: "Description required" });

    const record = new About({ description, imageUrl: req.body.imageUrl });
    await record.save();
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Admin – Read
export const getAdminAbout = async (_req, res) => {
  try {
    const record = await About.findOne();
    res.json(record || {});
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Admin – Update (partial OK)
export const updateAbout = async (req, res) => {
  try {
    const update = {};
    if (req.body.description !== undefined) update.description = req.body.description;
    if (req.body.imageUrl !== undefined) update.imageUrl = req.body.imageUrl;

    const record = await About.findOneAndUpdate({}, update, { new: true, upsert: true });
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Admin – Delete
export const deleteAbout = async (_req, res) => {
  try {
    await About.deleteMany({});
    res.json({ message: "About info deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Public – Read
export const getPublicAbout = async (_req, res) => {
  try {
    const record = await About.findOne();
    res.json(record || {});
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};