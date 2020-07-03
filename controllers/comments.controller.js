const db = require('../models');

// Get All Tutorials
exports.all = async (req, res) => {
  const comments = await db.Comment.find();
  return res.json(comments);
};

exports.one = async (req, res) => {
  const comment = await db.Comment.find({ _id: req.params.id });
  await res.json(comment);
};

exports.create = async (req, res) => {

  try {
    const comment = await db.Comment.create({
      name: req.body.name,
      body: req.body.body
    });
    try {
      const article = await db.Article.findOneAndUpdate(
          { _id: req.params.id },
          { comments: comment._id }
      );
      return await res.json({ success: true, comment: comment });
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
};

exports.delete = async (req, res) => {
  const comment = await db.Comment.deleteOne({ _id: req.params.id});
  return res.json(comment);
};
