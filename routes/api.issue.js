'use strict';

// ----- REQUIREMENTS -----

// vendor
const mongoose = require('mongoose');

// custom
const Issue = require('../models/issue');

const issue = {};

issue.listIssues = (req, res, next) => {
    let query = Issue.find();

    // Filter issues by user
    if (Array.isArray(req.query.user)) {
        // Find all issues created by any of the specified users
        const users = req.query.user.filter(mongoose.Types.ObjectId.isValid);
        query = query.where('user').in(users);
    } else if (mongoose.Types.ObjectId.isValid(req.query.user)) {
        // Find all issues created by a specific users
        query = query.where('user').equals(req.query.user);
    }

    query.exec()
        .then((issues) => {
            res.status(200).json({
                result: issues,
            });
        })
        .catch((err) => {
            next(err);
        });
};

issue.getInformation = (req, res, next) => {
    const issueId = req.params.issueId;
    User.findOne({
            _id: issueId
        })
        .exec()
        .then((issue) => {
            // the issue does not exist
            if (!issue) {
                return Promise.reject({
                    status: 404,
                    message: 'This issue does not exist.',
                });
            }
            res.status(200).json({
                result: issue,
            });
        })
        .catch((err) => {
            next(err);
        });
};

issue.addIssue = (req, res, next) => {
    Issue.create({
            status: 'new',
            description: req.body.description,
            imageUrl: req.body.imageUrl,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            tags: req.body.tags.replace(/^[,\s]+|[,\s]+$/g, '').replace(/\s*,\s*/g, ',').split(","),
            user: req.body.user,
            createdAt: new Date()
        })
        .then((issue) => {
            res.status(200).json({
                result: issue,
            });
        })
        .catch((err) => {
            next(err);
        });
};

module.exports = issue;