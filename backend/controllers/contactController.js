import Contact from "../models/Contact.js";

export const createContact = async (req, res) => {
  try {
    const { description } = req.body;
    if (!description) return res.status(400).json({ message: "Description required" });
    const record = new Contact({ description, image: req.body.imageUrl });
    await record.save();
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getAdminContact = async (_req, res) => {
  try {
    const record = await Contact.findOne();
    res.json(record || {});
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateContact = async (req, res) => {
  try {
    const update = {};
    if (req.body.description !== undefined) update.description = req.body.description;
    if (req.body.imageUrl !== undefined) update.image = req.body.imageUrl;

    const record = await Contact.findOneAndUpdate({}, update, { new: true, upsert: true });
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteContact = async (_req, res) => {
  try {
    await Contact.deleteMany({});
    res.json({ message: "Contact info deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getPublicContact = async (_req, res) => {
  try {
    const record = await Contact.findOne();
    res.json(record || {});
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};