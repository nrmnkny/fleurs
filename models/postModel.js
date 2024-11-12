const { getPool, sql } = require('../config/db');

exports.findAll = async () => {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM Posts');
    return result.recordset;
};

exports.findById = async (id) => {
    const pool = await getPool();
    const result = await pool.request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM Posts WHERE PostId = @id');
    return result.recordset[0];
};

exports.create = async (postData) => {
    const { Title, Body, ImageURL, CategoryId } = postData;
    const pool = await getPool();
    const result = await pool.request()
        .input('title', sql.VarChar, Title)
        .input('body', sql.Text, Body)
        .input('imageURL', sql.VarChar, ImageURL || null) 
        .input('categoryId', sql.Int, CategoryId)
        .input('postDate', sql.DateTime, new Date()) 
        .query('INSERT INTO Posts (Title, Body, ImageURL, CategoryId, PostDate) VALUES (@title, @body, @imageURL, @categoryId, @postDate)');
    return result.recordset;
};

exports.update = async (id, postData) => {
    const { Title, Body, ImageURL, CategoryId } = postData;
    const pool = await getPool();
    const result = await pool.request()
        .input('id', sql.Int, id)
        .input('title', sql.VarChar, Title)
        .input('body', sql.Text, Body)
        .input('imageURL', sql.VarChar, ImageURL || null)
        .input('categoryId', sql.Int, CategoryId)
        .query('UPDATE Posts SET Title = @title, Body = @body, ImageURL = @imageURL, CategoryId = @categoryId WHERE PostId = @id');
    return result.rowsAffected;
};

exports.delete = async (id) => {
    const pool = await getPool();
    await pool.request()
        .input('id', sql.Int, id)
        .query('DELETE FROM Posts WHERE PostId = @id');
};
