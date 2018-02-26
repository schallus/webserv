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
 * @apiErrorExample Error-Response:
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
    .get(issueCtrl.listIssues);
  

router.all('*', (req, res, next) => {
    next({
        status: 404,
        message: 'This endpoint doesn\'t exist',
    });
});

// ----- ERROR MIDDLEWARE -----

router.use((err, req, res, next) => {
    console.log(err);
    // map unexpected errors to default format
    if (!err.status || !err.message) {
        return res.status(500).json({
            error: {
                status: 500,
                message: 'Something unexpected happened',
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
    res.status(err.status).json({
        error: {
            status: err.status,
            message: err.message,
        },
    });
});

module.exports = router;