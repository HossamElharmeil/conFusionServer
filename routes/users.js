var express = require('express');
var bodyParser = require('body-parser');
var User = require('../models/user');
var passport = require('passport');
var router = express.Router();
var authenticate = require('../authenticate');
var cors = require('./cors');
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  User.find({})
    .then((users) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(users);
    }).catch((err) => next(err));
});

router.post('/signup', cors.corsWithOptions, (req, res, next) => {
  User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {

    if (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({ err: err });
    }
    else {
      user.firstname = req.body.firstname == null ? "" : req.body.firstname;
      user.lastname = req.body.lastname == null ? "" : req.body.lastname;
      user.save()
        .then((user) => {
          passport.authenticate('local')(req, res, () => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ success: true, status: 'Registration Successful' });
          });
        }).catch((err) => {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({ error: err });
        });
    }
  });
});

router.post('/login', cors.corsWithOptions, passport.authenticate('local'), (req, res, next) => {
  var token = authenticate.getToken({ _id: req.user._id });

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({ success: true, token: token, status: 'You are successfully logged in.' });
});

router.get('/logout', cors.corsWithOptions, (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in.');
    err.status = 403;
    next(err);
  }
});

router.get('/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
  if (req.user) {
    var token = authenticate.getToken({ _id: req.user._id });
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token: token, status: 'You\'re successfully logged in.'});
  }
});

module.exports = router;
