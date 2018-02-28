'use strict';

// ----- REQUIREMENTS -----

// vendor
const mongoose = require('mongoose');

// custom
const Issue = require('../models/issue');
const User = require('../models/user');

const issue = {};

/**
 * @api {get} /issues List all the issues
 * @apiName GetIssues
 * @apiGroup Issue
 *
 * @apiParam {Number} issueId Unique identifier of the issue
 * @apiParam {String} [status] Filter by status
 * @apiParam {Number} [page] Number of the page to retrieve
 * @apiParam {Number} [pageSize] Size of the page to retrieve
 * @apiParam {ObjectID} [userId] The ID of the user who create the issue to retrieve
 *
 * @apiSuccess {Object[]} issues List of all the issues
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *    "page": 1,
 *    "pageSize": 100,
 *    "total": 9,
 *    "result": [
 *        {
 *            "status": "inProgress",
 *            "tags": [
 *                "test",
 *                "test123",
 *                "blabliblou"
 *            ],
 *            "_id": "5a952acd04ec4715b814437c",
 *            "description": "123",
 *            "imageUrl": "https://wikiclic.com/wp-content/uploads/2017/04/images-libres-de-droit.jpg",
 *            "latitude": 46.778507,
 *            "longitude": 6.648635,
 *            "user": "5a8ec4a26232180d984b6ebb",
 *            "createdAt": "2018-02-27T09:54:21.189Z",
 *           "updatedAt": "2018-02-28T09:46:33.409Z"
 *        },
 *    ]
 * }
 *
 * @apiUse ServerTimeout
 */

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
        } else if (req.query.user) {
            return next({
                status: 422,
                message: 'This user ID does not exist.',
            })
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
/**
 * @api {get} /issues/:issueId Get the Issue information
 * @apiName GetIssue
 * @apiGroup Issue
 *
 * @apiParam {ObjectId} issueId Unique identifier of the issue
 *
 * @apiSuccess {Object} issue Requested issue
 * 
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *    "page": 1,
 *    "pageSize": 100,
 *    "total": 9,
 *    "result": [
 *       {
 *        "status": "inProgress",
 *        "tags": [
 *           "test",
 *           "test123",
 *           "blabliblou"
 *       ],
 *       "_id": "5a952acd04ec4715b814437c",
 *       "description": "123",
 *       "imageUrl": "https://wikiclic.com/wp-content/uploads/2017/04/images-libres-de-droit.jpg",
 *       "latitude": 46.778507,
 *       "longitude": 6.648635,
 *       "user": "5a8ec4a26232180d984b6ebb",
 *       "createdAt": "2018-02-27T09:54:21.189Z",
 *       "updatedAt": "2018-02-28T09:46:33.409Z"
 *   }
 *    ]
 *}
 * 
 * @apiError (404) {Object} inexistantIssue This issue does not exist
 * 
 * @apiErrorExample Error-Issue-Inexsistant :
 * HTTP/1.1 404 Not Found
 * {
 * "error": {
 *     "status": 422,
 *      "message": "This user ID does not exist."
 *   }
 * }
 * @apiUse ServerTimeout
 */

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

/**
 * @api {post} /issues Create a new Issue
 * @apiName CreateIssue
 * @apiGroup Issue
 * 
 * @apiParam {String{..1000}} description  Short description of the issue
 * @apiParam {String{..500}} imageUrl     A valid URL
 * @apiParam {Number{-90, 90}} latitude     A valid coordinate Ex. 90.45678939 
 * @apiParam {Number{-180, 180}} longitude     A valid coordinate Ex. 123.45678939 
 * @apiParam {String} [tags]        Optional Tags
 * @apiParam {String} user        UserID of the user who create the issue
 *
 * @apiUse DataFormUrlencoded
 * 
 * @apiParam {ObjectId} issueId Unique identifier of the issue
 * 
 * @apiSuccess {Object} issue New issue created
 * 
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 201 Created
 * {
 *   "result": {
 *       "status": "new",
 *       "description": "test",
 *       "imageUrl": "wikicli.ch",
 *       "latitude": 54.928,
 *       "longitude": 5.686756,
 *       "tags": [
 *           "test",
 *           "keksni"
 *       ],
 *       "user": {
 *           "_id": "5a8ec4096232180d984b6eb9",
 *           "firstName": "Florian",
 *           "lastName": "Schaller",
 *           "role": "manager",
 *           "createdAt": "2018-02-22T13:22:17.749Z"
 *       },
 *        "createdAt": "2018-02-28T09:24:08.485Z",
 *        "_id": "5a96753856fef588979c6ad5"
 *    }
 * }
 * 
 * @apiError (422) {Object} UserInvalid the userID is not valid
 * 
 * @apiErrorExample Error-User-Unvalid:
 *  HTTP/1.1 422 Unprocessable Entity
 *  {
 *      "error": {
 *          "status": 422,
 *          "message": "The user is not valid."
 *      }
 *  }
 * 
 * @apiError (422) {Object} UserInexistant the userID does not exist
 * 
 * @apiErrorExample Error-User-Inexistant:
 *  HTTP/1.1 422 Unprocessable Entity
 *  {
 *      "error": {
 *          "status": 422,
 *          "message": "The user does not exist."
 *      }
 *  }
 * 
 * @apiUse ServerTimeout
 * 
 */

issue.addIssue = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.body.user)) {
        return next({
            status: 418,
            message: 'The user id is not valid',
        });

    }
    User.findOne({
            _id: req.body.user
        })
        .exec()
        .then((user) => {
            if (!user) {
                return Promise.reject({
                    status: 422,
                    message: 'The user does not exist',
                });
            }
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
                    res.status(201).json({
                        result: issueWithUser,
                    });
                })
                .catch((err) => {
                    next(err);
                });

        })
        .catch((err) => {
            next(err);
        });


};
/**
 * @api {patch} /issues/:issueId Edit an issue
 * @apiName EditIssue
 * @apiGroup Issue
 *
 * @apiParam {String{..1000}} [description]  Short description of the issue
 * @apiParam {String="new","inProgress","canceled","completed"} [status]    The status of the issue. 
 * @apiParam {String{..500}} [imageUrl]     A valid URL
 * @apiParam {Number} [latitude]     A valid coordinate Ex. 123.45678939 
 * @apiParam {Number} [longitude]     A valid coordinate Ex. 123.45678939 
 * @apiParam {String} [tags]        Optional Tags. Separated by comas
 * @apiParam {String} [user]        UserID of the user who create the issue
 *
 * @apiSuccess {Object} issue Updated issue
 * 
 * @apiUse DataFormUrlencoded
 * 
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *  "result": {
 *     "status": "inProgress",
 *    "tags": [
 *          "test123"
 *       ],
 *        "_id": "5a952acd04ec4715b814437c",
 *        "description": "123",
 *        "imageUrl": "https://wikiclic.com/wp-content/uploads/2017/04/images-libres-de-droit.jpg",
 *        "latitude": 46.778507,
 *        "longitude": 6.648635,
 *        "user": {
 *            "_id": "5a8ec4a26232180d984b6ebb",
 *            "firstName": "test",
 *            "lastName": "test123",
 *            "role": "manager",
 *            "createdAt": "2018-02-22T13:24:50.873Z"
 *        },
 *        "createdAt": "2018-02-27T09:54:21.189Z",
 *        "updatedAt": "2018-02-28T11:37:12.150Z"
 *    }
 *  }
 * 
 * @apiError (422) {Object} NothingToUpdate Nothing to update. Please make a change.
 * 
 * @apiErrorExample Error-No-Change:
 *  HTTP/1.1 422 Unprocessable Entity
 *  {
 *      "error": {
 *          "status": 422,
 *          "message": "Nothing to update. Please make a change."
 *      }
 *  }
 * 
 * @apiUse ServerTimeout
 * 
 */

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

    if (Object.keys(issuePatch).length == 1) {
        return next({
            status: 422,
            message: 'Nothing to update. Please make a change.',
        });
    }

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
/**
 * @api {delete} /issues/:issueId Delete an issue
 * @apiName DeleteIssue
 * @apiGroup Issue
 *
 * @apiParam {ObjectId} issueId Unique identifier of the issue
 * 
 * @apiSuccess {Object} issue Issue deleted
 * 
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 * *  {
 *  "result": {
 *     "status": "inProgress",
 *    "tags": [
 *          "test123"
 *       ],
 *        "_id": "5a952acd04ec4715b814437c",
 *        "description": "123",
 *        "imageUrl": "https://wikiclic.com/wp-content/uploads/2017/04/images-libres-de-droit.jpg",
 *        "latitude": 46.778507,
 *        "longitude": 6.648635,
 *        "user": "5a8ec4a26232180d984b6ebb",
 *        "createdAt": "2018-02-27T09:54:21.189Z",
 *        "updatedAt": "2018-02-28T11:37:12.150Z"
 *    }
 *  }
 * 
 * @apiError (404) {Object} IssueInexistant The issue does not exist
 * 
 * @apiErrorExample Error-Issue-Inexistant :
 * HTTP/1.1 404 Not Found
 * {
 * "error": {
 *     "status": 404,
 *      "message": "This issue does not exist."
 *   }
 * }
 * @apiUse ServerTimeout
 * 
 */

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