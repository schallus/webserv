'use strict';

// ----- REQUIREMENTS -----

// custom
const DB = require('../modules/database');

// ----- MODEL -----

const user = {
    firstName: {
        type: String,
        minlength: 2,
        maxlength: 20,
        required: true
    },
    lastName: {
        type: String,
        minlength: 2,
        maxlength: 20,
        required: true
    },
    role: {
        type: String,
        enum: ['citizen', 'manager'],
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
};

const userSchema = DB.getSchema(user, 'User');

userSchema.index({
    firstName: 1,
    lastName: 1
}, {
    unique: true
});

// ----- STATIC METHODS -----

/* userSchema.statics.findByEmail = (email) => {
    return DB.getModel(userSchema, 'User').findOne({email: email});
}; */

// ----- EXPORT -----

module.exports = DB.getModel(userSchema, 'User');