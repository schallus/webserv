'use strict';

// ----- REQUIREMENTS -----

// custom
const DB = require('../modules/database');
const validators = require('mongoose-validators');

// ----- MODEL -----

const issue = {
    status: {
        type: String,
        enum: ['new', 'inProgress', 'canceled', 'completed'],
        default: 'new',
        required: true
    },
    description: {
        type: String,
        maxlength: 1000,
        required: true
    },
    imageUrl: {
        type: String,
        maxlength: 500,
        validate: validators.isURL(),
        required: true
    },
    latitude: {
        type: Number,
        validate: validators.matches('^-?[0-9]{1,3}(?:\.[0-9]{1,10})?$'),
        required: true
    },
    longitude: {
        type: Number,
        validate: validators.matches('^-?[0-9]{1,3}(?:\.[0-9]{1,10})?$'),
        required: true
    },
    tags: {
        type: [String]
    },
    user: {
        type: DB.getSchemas().Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    updatedAt: {
        type: Date
    }
};

const issueSchema = DB.getSchema(issue, 'Issue');

// ----- EXPORT -----

module.exports = DB.getModel(issueSchema, 'Issue');