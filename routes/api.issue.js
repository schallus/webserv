'use strict';

// ----- REQUIREMENTS -----

// custom
const Issue = require('../models/issue');

const issue = {};

issue.listIssues = (req, res, next) => {
    Issue.find()
        .exec()
        .then((issues) => {
            res.status(200).json({
                result: issues,
            });
        })
        .catch((err) => {
            next(err);
        });
};

module.exports = issue;