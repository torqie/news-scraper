const db = require('../models');
const mongoose = require('mongoose');

// Get All Tutorials
exports.all = async (req, res) => {
  const comments = await db.Comment.find();
  return res.status("200").send(comments);
};

exports.one = async (req, res) => {
  const comment = await db.Comment.find({ _id: req.params.id });
  await res.status("200").send(comment);
};

exports.create = async (req, res) => {

  try {
    const comment = await db.Comment.create({
      name: req.body.name,
      body: req.body.body

    });
    await db.Article.findOneAndUpdate(
        { _id: req.params.id},
        {$push:{comments: comment._id}},
        { new: true }
    ).exec(function(error, article) {
      if (error) {
        console.log(error);
        return res.status(400).send({message: 'Failed to add comment due to invalid params!'});
      }
      return res.status(200).send(article);
    });
  } catch (error) {
    console.log(error);
  }
};

exports.delete = async (req, res) => {
  const comment = await db.Comment.deleteOne({ _id: req.params.id});
  const article = await db.Article.updateMany(
      {},
      { $pull: { comments: req.params.id }});
  await db.Article.updateMany(
      {},
      { $unset: { comments: [] }});
  return res.status("200").send(article)
};
