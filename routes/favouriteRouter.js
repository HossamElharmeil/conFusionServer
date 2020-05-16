const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');

const Favourites = require('../models/favourite');

var favouriteRouter = express.Router();

favouriteRouter.use(bodyParser.json());

favouriteRouter.route('/')
    .get(authenticate.verifyUser, (req, res, next) => {
        Favourites.find({ user: req.user._id })
            .populate('user')
            .populate('dishes')
            .then((favourite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favourite);
            }).catch((err) => next(err));
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        Favourites.findOne({ user: req.user._id })
            .then((favourite) => {
                if (favourite == null) {
                    Favourites.create({ user: req.user._id, dishes: req.body })
                        .then((favourite) => {
                            Favourites.findById(favourite._id)
                                .populate('user')
                                .populate('dishes')
                                .then((fav) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(fav);
                                }).catch((err) => next(err));
                        }).catch((err) => next(err));
                }
                else {
                    for (i = req.body.length - 1; i >= 0; i--) {
                        if (favourite.dishes.indexOf(req.body[i]["_id"]) == -1) {
                            favourite.dishes.push(req.body[i]);
                        }
                    }
                    favourite.save()
                        .then((favourite) => {
                            Favourites.findById(favourite._id)
                                .populate('user')
                                .populate('dishes')
                                .then((fav) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(fav);
                                }).catch((err) => next(err));
                        });

                }
            }).catch((err) => next(err));
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Favourites.findOneAndDelete({ user: req.user._id })
            .then((result) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'appliaction/json');
                res.json(result);
            })
    });

favouriteRouter.route('/:dishId')
    .post(authenticate.verifyUser, (req, res, next) => {
        Favourites.findOne({ user: req.user._id })
            .then((favourite) => {
                if (favourite == null) {
                    Favourites.create({ user: req.user._id, dishes: [req.params.dishId] })
                        .then((favourite) => {
                            Favourites.findById(favourite._id)
                                .populate('user')
                                .populate('dishes')
                                .then((fav) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(fav);
                                }).catch((err) => next(err));
                        }).catch((err) => next(err));
                }
                else if (favourite.dishes.indexOf(req.params.dishId) == -1) {
                    favourite.dishes.push(favourite.params.dishId);
                    favourite.save()
                        .then((favourite) => {
                            Favourites.findById(favourite._id)
                                .populate('user')
                                .populate('dishes')
                                .then((fav) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(fav);
                                }).catch((err) => next(err));
                        });
                }
                else {
                    var err = new Error('Dish already exists.');
                    err.status = 403;
                    next(err);
                }
            }).catch((err) => next(err));
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Favourites.findOne({ user: req.user._id })
            .then((favourite) => {
                console.log(favourite);
                var index = favourite.dishes.indexOf(req.params.dishId);
                if (index != -1) {
                    favourite.dishes.splice(favourite.dishes.indexOf(req.params.dishId), 1);
                    favourite.save()
                        .then((favourite) => {
                            Favourites.findById(favourite._id)
                                .populate('user')
                                .populate('dishes')
                                .then((fav) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(fav);
                                }).catch((err) => next(err));
                        });
                }
                else {
                    var err = new Error('Unable to find the dish ID in favourites.');
                    err.status = 403;
                    next(err);
                }
            }).catch((err) => next(err));
    });

module.exports = favouriteRouter;