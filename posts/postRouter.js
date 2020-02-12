const express = require('express');
const database = require('./postDb');

const errorHandler = require('../utils/errorHandler');

const router = express.Router();

router.get('/', (req, res) => {
  // do your magic!
  database.get().then(posts => {
    res.status(200).json(posts);
  }).catch(err => {
    errorHandler(err, 500, 'Could not get posts.')
  });
});

router.get('/:id', (req, res) => {
  // do your magic!
});

router.delete('/:id', (req, res) => {
  // do your magic!
});

router.put('/:id', (req, res) => {
  // do your magic!
});

// custom middleware

function validatePostId(req, res, next) {
  // do your magic!
}

module.exports = router;
