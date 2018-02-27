'use strict';

// ----- REQUIREMENTS -----

// vendor
const mongoose = require('mongoose');

// custom
const Issue = require('../models/issue');

const issue = {};

issue.listIssues = (req, res, next) => {
    Issue.find().count(function (err, total) {
        if (err) return next(err);

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

        // Filter issue by status
        if (req.query.status) {
            query = query.where('status').equals(req.query.status);
        }

        // Parse the "page" param (default to 1 if invalid)
        let page = parseInt(req.query.page, 10);
        if (isNaN(page) || page < 1) {
            page = 1;
        }
        // Parse the "pageSize" param (default to 100 if invalid)
        let pageSize = parseInt(req.query.pageSize, 10);
        if (isNaN(pageSize) || pageSize < 0 || pageSize > 100) {
            pageSize = 100;
        }
        // Apply skip and limit to select the correct page of elements
        query = query.skip((page - 1) * pageSize).limit(pageSize);

        // Add user information if 'showUserInformation' parameter is equal to 'true'
        if (req.query.showUserInformation && req.query.showUserInformation == 'true') query.populate('user');

        query.exec()
            .then((issues) => {
                res.status(200).json({
                    page: page,
                    pageSize: pageSize,
                    total: total,
                    result: issues,
                });
            })
            .catch((err) => {
                next(err);
            });
    });
};

issue.getInformation = (req, res, next) => {
    const issueId = req.params.issueId;
    Issue.findOne({
            _id: issueId
        })
        .populate('user')
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
            return issue.populate('user').execPopulate();
        })
        .then((issueWithUser) => {
            res.status(200).json({
                result: issueWithUser,
            });
        })
        .catch((err) => {
            next(err);
        });
};

issue.editIssue = (req, res, next) => {
    const issueId = req.params.issueId;

    let issuePatch = {
        updatedAt: new Date()
    };
    if (req.body.status) issuePatch.status = req.body.status;
    if (req.body.description) issuePatch.description = req.body.description;
    if (req.body.imageUrl) issuePatch.imageUrl = req.body.imageUrl;
    if (req.body.latitude) issuePatch.latitude = req.body.latitude;
    if (req.body.longitude) issuePatch.longitude = req.body.longitude;
    if (req.body.tags) issuePatch.tags = req.body.tags.replace(/^[,\s]+|[,\s]+$/g, '').replace(/\s*,\s*/g, ',').split(",");
    if (req.body.user) issuePatch.user = req.body.user;

    Issue.findByIdAndUpdate(issueId, {
            $set: issuePatch
        }, {
            new: true,
            runValidators: true
        })
        .then((issue) => {
            return issue.populate('user').execPopulate();
        })
        .then((issueWithUser) => {
            res.status(200).json({
                result: issueWithUser,
            });
        }).catch((err) => {
            next(err);
        });
};

issue.deleteIssue = (req, res, next) => {
    const issueId = req.params.issueId;

    Issue.findOne({
            _id: issueId
        }).exec()
        .then((issue) => {
            if (!issue) {
                return Promise.reject({
                    status: 404,
                    message: 'This issue does not exist.',
                });
            }
            Issue.remove({
                _id: issueId
            }).exec().then(() => {
                res.status(200).json({
                    result: issue
                });
            }).catch((err) => {
                next(err);
            });
        })
        .catch((err) => {
            next(err);
        });
};

module.exports = issue;