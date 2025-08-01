import Contact from "../models/Contact.js";

export const createContact = async (req, res) => {
  try {
    const { description, imageUrl } = req.body;
    if (!description) return res.status(400).json({ message: "Description is required" });

    const existing = await Contact.findOne();
    if (existing) return res.status(409).json({ message: "Contact info already exists" });

    const newContact = new Contact({ description, image: imageUrl || null });
    await newContact.save();
    res.status(201).json(newContact);
  } catch (err) {
    console.error("Create Contact Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAdminContact = async (_req, res) => {
  try {
    const record = await Contact.findOne();
    res.status(200).json(record || {});
  } catch (err) {
    console.error("Get Admin Contact Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateContact = async (req, res) => {
  try {
    const { description, imageUrl } = req.body;

    const existing = await Contact.findOne();
    if (!existing) return res.status(404).json({ message: "No contact info found to update" });

    if (description !== undefined) existing.description = description;
    if (imageUrl !== undefined) existing.image = imageUrl;

    await existing.save();
    res.status(200).json(existing);
  } catch (err) {
    console.error("Update Contact Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteContact = async (_req, res) => {
  try {
    const existing = await Contact.findOne();
    if (!existing) return res.status(404).json({ message: "No contact info to delete" });

    await Contact.deleteOne({ _id: existing._id });
    res.status(200).json({ message: "Contact info deleted" });
  } catch (err) {
    console.error("Delete Contact Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPublicContact = async (_req, res) => {
  try {
    const record = await Contact.findOne();
    res.status(200).json(record || {});
  } catch (err) {
    console.error("Get Public Contact Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
