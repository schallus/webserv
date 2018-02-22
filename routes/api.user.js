'use strict';

// ----- REQUIREMENTS -----

// custom
const User = require('../models/user');

const user = {};

user.listUsers = (req, res, next) => {
    User.find()
        .exec()
        .then((users) => {
            res.status(200).json({
                result: users,
            });
        })
        .catch((err) => {
            next(err);
        });
};

user.getInformation = (req, res, next) => {
    const userId = req.params.userId;
    User.findOne({
            _id: userId
        })
        .exec()
        .then((user) => {
            // the user does not exist
            if (!user) {
                return Promise.reject({
                    status: 404,
                    message: 'This user does not exist.',
                });
            }
            res.status(200).json({
                result: user,
            });
        })
        .catch((err) => {
            next(err);
        });
};


user.addUser = (req, res, next) => {
    const user = res.locals.user;

    if (!req.body || !req.body.firstName || !req.body.lastName || !req.body.role) {
        return next({
            status: 422,
            message: 'Please provide all the information required.',
        });
    }

    User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            role: req.body.role,
            createdAt: new Date()
        })
        .then((user) => {
            res.status(200).json({
                result: user,
            });
        })
        .catch((err) => {
            next(err);
        });
};

user.editUser = (req, res, next) => {
    const user = res.locals.user;
    const userId = req.params.userId;

    if (!req.body.firstName && !req.body.lastName && !req.body.role) {
        return next({
            status: 422,
            message: 'Nothing to update. Please provide a firstName, a lastName or a role.',
        });
    }
};


module.exports = user;