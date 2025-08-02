import Blog from "../models/Blog.js";
import { generateSlug } from "../utils/slugify.js";

/**
 * Create a new blog post
 */
export const createBlog = async (req, res) => {
  try {
    const { title, content, image } = req.body;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({ message: "Title & content required" });
    }

    // Generate a unique slug from the title
    let slug = generateSlug(title);
    let uniqueSlug = slug;
    let counter = 1;

    // If slug already exists, append a number to make it unique
    while (await Blog.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${slug}-${counter++}`;
    }

    // Create the blog post
    const blog = await Blog.create({
      title,
      content,
      slug: uniqueSlug,
      image: image || null,
    });

    res.status(201).json(blog);
  } catch (err) {
    console.error("Create Blog Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Update an existing blog post by ID
 */
export const updateBlog = async (req, res) => {
  try {
    const { title, content, image } = req.body;
    const update = {};

    // Update title and regenerate slug if title is changed
    if (title) {
      update.title = title;
      update.slug = generateSlug(title);
    }

    if (content !== undefined) update.content = content;
    if (image !== undefined) update.image = image;

    // Find the blog by ID and update it
    const blog = await Blog.findByIdAndUpdate(req.params.id, update, { new: true });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(blog);
  } catch (err) {
    console.error("Update Blog Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Delete a blog post by ID
 */
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json({ message: "Blog deleted" });
  } catch (err) {
    console.error("Delete Blog Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Get all blog posts (sorted by newest first)
 */
export const getBlogs = async (_req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    console.error("Get Blogs Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Get a single blog post by ID
 */
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(blog);
  } catch (err) {
    console.error("Get Blog By Id Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
