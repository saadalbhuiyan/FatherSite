import About from "../models/About.js";

/**
 * Create "About" content (only allowed once)
 */
export const createAbout = async (req, res) => {
  try {
    const { description, imageUrl } = req.body;

    // Validate required fields
    if (!description) {
      return res.status(400).json({ message: "Description required" });
    }

    // Prevent duplicate "About" entries
    const exists = await About.findOne();
    if (exists) {
      return res.status(409).json({ message: "About info already exists" });
    }

    // Create and save new "About" document
    const about = new About({ description, imageUrl });
    await about.save();

    res.status(201).json(about);
  } catch (err) {
    console.error("Create About Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Get "About" content for admin panel
 */
export const getAdminAbout = async (_req, res) => {
  try {
    const about = await About.findOne();
    res.json(about || {}); // Return empty object if not found
  } catch (err) {
    console.error("Get Admin About Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Update the "About" section
 */
export const updateAbout = async (req, res) => {
  try {
    const { description, imageUrl } = req.body;

    // Find existing "About" document
    const about = await About.findOne();
    if (!about) {
      return res.status(404).json({ message: "About info not found" });
    }

    // Update fields if provided
    if (description !== undefined) about.description = description;
    if (imageUrl !== undefined) about.imageUrl = imageUrl;

    await about.save();
    res.json(about);
  } catch (err) {
    console.error("Update About Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Delete the "About" section
 */
export const deleteAbout = async (_req, res) => {
  try {
    const about = await About.findOne();
    if (!about) {
      return res.status(404).json({ message: "About info not found" });
    }

    await About.deleteOne({ _id: about._id });
    res.json({ message: "About info deleted" });
  } catch (err) {
    console.error("Delete About Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Get "About" content for public website
 */
export const getPublicAbout = async (_req, res) => {
  try {
    const about = await About.findOne();
    res.json(about || {}); // Return empty object if not found
  } catch (err) {
    console.error("Get Public About Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
