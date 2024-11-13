const PostModel = require('../models/postModel');

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await PostModel.findAll();
        console.log("Fetched all posts successfully");
        res.json(posts);
    } catch (err) {
        console.error("Error fetching posts:", err.message);
        res.status(500).json({ message: err.message });
    }
};

exports.getPostById = async (req, res) => {
    try {
        const post = await PostModel.findById(req.params.id);
        if (!post) {
            console.log("Post not found for ID:", req.params.id);
            return res.status(404).json({ message: 'Post not found' });
        }
        console.log("Fetched post:", post);
        res.json(post);
    } catch (err) {
        console.error("Error fetching post by ID:", err.message);
        res.status(500).json({ message: err.message });
    }
};

exports.createPost = async (req, res) => {
    const { Title, Body, CategoryId } = req.body;
    console.log("Creating post with data:", req.body);
    
    if (!Title || !Body || !CategoryId) {
        console.warn("Validation failed for post creation:", req.body);
        return res.status(400).json({ message: "Title, Body, and CategoryId are required." });
    }
    try {
        const newPost = await PostModel.create(req.body);
        console.log("Post created successfully:", newPost);
        res.status(201).json(newPost);
    } catch (err) {
        console.error("Error creating post:", err.message);
        res.status(500).json({ message: err.message });
    }
};

exports.updatePost = async (req, res) => {
    console.log("Updating post with ID:", req.params.id, "and data:", req.body);

    const { Title, Body, CategoryId } = req.body;
    if (!Title || !Body || !CategoryId) {
        console.warn("Validation failed for post update:", req.body);
        return res.status(400).json({ message: "Title, Body, and CategoryId are required." });
    }

    try {
        const result = await PostModel.update(req.params.id, req.body);
        if (result === 0) {
            console.log("Post not found for ID:", req.params.id);
            return res.status(404).json({ message: "Post not found" });
        }
        console.log("Post updated successfully for ID:", req.params.id);
        res.json({ message: 'Post updated successfully' });
    } catch (err) {
        console.error("Error updating post:", err.message);
        res.status(500).json({ message: err.message });
    }
};

exports.deletePost = async (req, res) => {
    console.log("Deleting post with ID:", req.params.id);
    try {
        await PostModel.delete(req.params.id);
        console.log("Post deleted successfully for ID:", req.params.id);
        res.status(204).json({ message: 'Post deleted' });
    } catch (err) {
        console.error("Error deleting post:", err.message);
        res.status(500).json({ message: err.message });
    }
};
