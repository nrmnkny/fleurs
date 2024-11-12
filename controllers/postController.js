const PostModel = require('../models/postModel');

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await PostModel.findAll();
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getPostById = async (req, res) => {
    try {
        const post = await PostModel.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createPost = async (req, res) => {
    const { Title, Body, CategoryId } = req.body;
    if (!Title || !Body || !CategoryId) {
        return res.status(400).json({ message: "Title, Body, and CategoryId are required." });
    }
    try {
        const newPost = await PostModel.create(req.body);
        res.status(201).json(newPost);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updatePost = async (req, res) => {
    console.log("Updating post with data:", req.body);

    const { Title, Body, CategoryId } = req.body;
    if (!Title || !Body || !CategoryId) {
        return res.status(400).json({ message: "Title, Body, and CategoryId are required." });
    }

    try {
        const result = await PostModel.update(req.params.id, req.body);
        if (result === 0) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.json({ message: 'Post updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        await PostModel.delete(req.params.id);
        res.status(204).json({ message: 'Post deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getFilteredPosts = async (req, res) => {
    const { categoryId, searchTerm } = req.query;
    let query = 'SELECT * FROM Posts WHERE 1=1';
    const params = {};

    if (categoryId && categoryId !== 'All') {
        query += ' AND CategoryId = @categoryId';
        params.categoryId = parseInt(categoryId);
    }

    if (searchTerm) {
        query += ' AND (Title LIKE @searchTerm OR Body LIKE @searchTerm)';
        params.searchTerm = `%${searchTerm}%`;
    }

    try {
        const pool = await getPool();
        const result = await pool.request()
            .input('categoryId', sql.Int, params.categoryId || null)
            .input('searchTerm', sql.VarChar, params.searchTerm || null)
            .query(query);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
