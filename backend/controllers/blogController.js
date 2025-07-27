import Blog from "../models/Blog.js";
import { generateSlug } from "../utils/slugify.js";

// 1. Create
export const createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ message: "Title & content required" });

    let slug = generateSlug(title);
    let uniqueSlug = slug;
    let counter = 1;

    // ensure unique slug
    while (await Blog.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${slug}-${counter++}`;
    }

    const blog = await Blog.create({ title, content, slug, imageUrl: req.body.imageUrl || null });
    res.status(201).json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 2. Update
export const updateBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    const update = { content };
    if (title) {
      update.title = title;
      update.slug = generateSlug(title); // simple overwrite, or re-unique if you want
    }
    if (req.body.imageUrl !== undefined) update.imageUrl = req.body.imageUrl;

    const blog = await Blog.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 3. Delete
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json({ message: "Blog deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 4. List all (public)
export const getBlogs = async (_req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 5. Single blog (public)
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};