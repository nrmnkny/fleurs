const { getPool, sql } = require('../config/db');

exports.findAll = async () => {
    const pool = await getPool();
    console.log("Running query to fetch all posts");
    const result = await pool.request().query('SELECT * FROM Posts');
    console.log("Query result:", result.recordset);
    return result.recordset;
};

exports.findById = async (id) => {
    const pool = await getPool();
    console.log("Running query to find post by ID:", id);
    const result = await pool.request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM Posts WHERE PostId = @id');
    console.log("Query result for findById:", result.recordset[0]);
    return result.recordset[0];
};

exports.create = async (postData) => {
    const { Title, Body, ImageURL, CategoryId } = postData;
    const pool = await getPool();
    console.log("Inserting new post:", postData);
    const result = await pool.request()
        .input('title', sql.VarChar, Title)
        .input('body', sql.Text, Body)
        .input('imageURL', sql.VarChar, ImageURL || null)
        .input('categoryId', sql.Int, CategoryId)
        .input('postDate', sql.DateTime, new Date())
        .query('INSERT INTO Posts (Title, Body, ImageURL, CategoryId, PostDate) VALUES (@title, @body, @imageURL, @categoryId, @postDate)');
    console.log("New post created with ID:", result.recordset);
    return result.recordset;
};
