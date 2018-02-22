'use strict';

// ----- REQUIREMENTS -----

// custom
const DB = require('../modules/database');

// ----- MODEL -----

const issue = {
    status: {
        type: String,
        enum: ['new', 'inProgress', 'canceled', 'completed'],
        default: 'new'
    },
    description: {
        type: String,
        maxlength: 1000
    },
    imageUrl: {
        type: String,
        maxlength: 500
    },
    latitude: {
        type: Number
    },
    longitude: {
        type: Number
    },
    tags: {
        type: [String]
    },
    user: {
        type: DB.getSchemas().Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date
    },
    updatedAt: {
        type: Date
    }
};

const issueSchema = DB.getSchema(issue, 'Issue');

// ----- EXPORT -----

module.exports = DB.getModel(issueSchema, 'Issue');