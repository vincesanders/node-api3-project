const express = require('express');
const database = require('./postDb');

const errorHandler = require('../utils/errorHandler');

const router = express.Router();

router.get('/', (req, res) => {
  database.get().then(posts => {
    res.status(200).json(posts);
  }).catch(err => {
    errorHandler(err, 500, 'Could not get posts.')
  });
});

router.get('/:id', validatePostId, (req, res) => {
  res.status(200).json(req.post);
});

router.delete('/:id', validatePostId, (req, res) => {
  database.remove(req.params.id).then(post => {
    res.status(200).json(req.post);
  }).catch(err => {
    errorHandler(err, 500, 'The post could not be deleted.')
  });
});

router.put('/:id', validatePostId, (req, res) => {
  // do your magic!
});

// custom middleware

function validatePostId(req, res, next) {
  database.getById(req.params.id).then(post => {
    if (!post) {
      res.status(400).json({ message: "invalid post id" });
    } else {
      req.post = post;
      next();
    }
  }).catch(err => {
    errorHandler(err, 500, "Could not get post. Check the post id.")
  })
}

module.exports = router;
