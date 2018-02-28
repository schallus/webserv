'use strict';

// ----- REQUIREMENTS -----

// vendor
const express = require('express');
const bodyParser = require('body-parser');
const timeout = require('connect-timeout');

// custom
const userCtrl = require('./api.user');
const issueCtrl = require('./api.issue');

// Create API router
const router = new express.Router();

// ----- MIDDLEWARES -----

router.use(bodyParser.urlencoded({
    extended: false
}));
router.use(bodyParser.json({
    limit: '5mb'
}));

/**
 * @apiDefine ServerTimeout
 *
 * @apiError (522) {Object} ConnectionTimeOut Connection Timed Out after 5 seconds.
 *
 * @apiErrorExample Error-Timed-Out:
 *     HTTP/1.1 522 Connection Timed Out
 *     {
 *       "error": {
 *          "status": 522,
 *          "message": "Connection Timed Out."
 *       }
 *     }
 */
router.use(timeout('5s')); // After 5 seconds, connection time out

// ----- ROUTES -----

// ----- user -----
router.route('/users')
    .get(userCtrl.listUsers)
    .post(userCtrl.addUser);
router.route('/users/:userId')
    .get(userCtrl.getInformation)
    .patch(userCtrl.editUser);

// ----- issue -----
router.route('/issues')
    .get(issueCtrl.listIssues)
    .post(issueCtrl.addIssue);
router.route('/issues/:issueId')
    .get(issueCtrl.getInformation)
    .delete(issueCtrl.deleteIssue)
    .patch(issueCtrl.editIssue);


router.all('*', (req, res, next) => {
    next({
        status: 404,
        message: 'This endpoint doesn\'t exist',
    });
});

// ----- ERROR MIDDLEWARE -----

router.use((err, req, res, next) => {
    console.log(err);
    if (err.name === 'ValidationError') {
        return res.status(422).json({
            error: {
                status: 422,
                message: err.toString().replace('ValidationError: ', '').split(', ')
            },
        });
    }
    if (err.code === 'ETIMEDOUT') {
        return res.status(522).json({
            error: {
                status: 522,
                message: 'Connection Timed Out.',
            },
        });
    }
    if (err.status && err.message) {
        res.status(err.status).json({
            error: {
                status: err.status,
                message: err.message,
            },
        });
    }
    // map unexpected errors to default format
    return res.status(500).json({
        error: {
            status: 500,
            message: 'Something unexpected happened',
        },
    });
});

module.exports = router;