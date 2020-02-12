const express = require('express');

const database = require('./userDb');
const postDatabase = require('../posts/postDb');

const router = express.Router();

router.post('/', validateUser, (req, res) => {
  database.insert(req.body).then(userIDObj => {
      //returns an object containing the id of the user just created.
      res.status(201).json(userIDObj);
  }).catch(err => {
      console.log(err);
      res.status(500).json({ errorMessage: 'oops' });
  });
});

router.post('/:id/posts', validatePost, validateUserId, (req, res) => {
  newPost = {
    user_id: req.params.id,
    text: req.body.text
  }
  postDatabase.insert(newPost).then(post => {
    res.status(201).json(post);
  }).catch(err => {
    console.log(err);
    res.status(500).json({ errorMessage: 'Could not post.' });
});
});

router.get('/', (req, res) => {
  // do your magic!
  database.get().then(users => {
    res.status(200).json(users);
  }).catch(err => {
    console.log(err);
    res.status(500).json({ errorMessage: "The users information could not be retrieved." });
  });
});

router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json(req.user);
});

router.get('/:id/posts', validateUserId, (req, res) => {
  database.getUserPosts(req.params.id).then(post => {
    res.status(200).json(post);
  }).catch(err => {
    console.log(err);
    res.status(500).json({ errorMessage: "The user's posts could not be removed" });
  });
});

router.delete('/:id', validateUserId, (req, res) => {
  database.remove(req.params.id).then(numDeleted => {
    res.status(200).json(req.user);
  }).catch(err => {
    console.log(err);
    res.status(500).json({ errorMessage: "The user could not be removed" });
  });
});

router.put('/:id', validateUser, validateUserId, (req, res) => {
  database.update(req.params.id, req.body).then(userID => {
    database.getById(req.params.id).then(user => {
      res.status(200).json(user);
    }).catch(err => {
      console.log(err);
      res.status(500).json({ errorMessage: "The user information could not be retrieved." });
    });
  }).catch(err => {
    console.log(err);
    res.status(500).json({ errorMessage: "The user information could not be modified." });
  });
});

//custom middleware

function validateUserId(req, res, next) {
  database.getById(req.params.id).then(user => {
    if (!user) {
        res.status(400).json({ message: "invalid user id" });
    } else {
      req.user = user;
      next();
    }
  }).catch(err => {
      console.log(err);
      res.status(500).json({ errorMessage: "The user information could not be retrieved." });
  });
}

function validateUser(req, res, next) {
  if (!req.body) {
    res.status(400).json({ message: "missing user data" });
  } else if (!req.body.name) {
    res.status(400).json({ message: "missing required name field" });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  if (!req.body) {
    res.status(400).json({ message: "missing post data" });
  } else if (!req.body.text) {
    res.status(400).json({ message: "missing required text field" });
  } else {
    next();
  }
}

module.exports = router;
