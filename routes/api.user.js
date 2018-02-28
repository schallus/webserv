'use strict';

// ----- REQUIREMENTS -----

// custom
const User = require('../models/user');
const Issue = require('../models/issue');

const user = {};

/**
 * @api {get} /users List all the user
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {Number} id Unique identifier of the user
 *
 * @apiSuccess {String} firstName First name of the user
 * @apiSuccess {String} lastName  Last name of the user
 */
user.listUsers = (req, res, next) => {
    User.find()
        .exec()
        .then((users) => {
            // Get the users IDs
            const usersIds = users.map(user => user._id);
            Issue.aggregate([{
                        $match: { // Select issues created by the user we are interested in
                            user: {
                                $in: usersIds
                            }
                        }
                    },
                    {
                        $group: { // Group the documents by user ID
                            _id: '$user',
                            issuesCount: { // Count the number of issues for that ID
                                $sum: 1
                            }
                        }
                    }
                ]).exec()
                .then((results) => {
                    // Convert the User documents to JSON
                    const usersJson = users.map(user => user.toJSON());
                    // For each result...
                    results.forEach(function (result) {
                        // Get the user ID (that was used to $group)...
                        const resultId = result._id.toString();
                        // Find the corresponding user...
                        const correspondingUser = usersJson.find(user => user._id == resultId);
                        // And attach the new property
                        correspondingUser.issuesCreatedCount = result.issuesCount;
                    });
                    return usersJson;
                }).then((users) => {
                    res.status(200).json({
                        result: users,
                    });
                }).catch((err) => {
                    next(err);
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
            if (err.name == "BulkWriteError"){
                next ({
                    status: 418,
                    message: 'This user already exist.',
                })
            }
            next(err);
        });
};

user.editUser = (req, res, next) => {
    const userId = req.params.userId;

    let userPatch = {};
    if (req.body.firstName) userPatch.firstName = req.body.firstName;
    if (req.body.lastName) userPatch.lastName = req.body.lastName;
    if (req.body.role) userPatch.role = req.body.role;

    if (Object.keys(userPatch).length == 0) {
        return next({
            status: 422,
            message: 'Nothing to update. Please make a change.',
        });
    }

    User.findByIdAndUpdate(userId, {
            $set: userPatch
        }, {
            new: true,
            runValidators: true
        })
        .then((user) => {
            res.status(200).json({
                result: user,
            });
        }).catch((err) => {
            next(err);
        });
};


module.exports = user;