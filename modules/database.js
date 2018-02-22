'use strict';

require('dotenv').config();

// Build the connection url
const getConnectionUrl = (user, password, host, port, dbName) => {
    return `mongodb://${user}:${password}@${host}:${port}/${dbName}`;
};

class Database {
    constructor() {
        this.url = getConnectionUrl(
            process.env.DB_USER,
            process.env.DB_PASS,
            process.env.DB_HOST,
            process.env.DB_PORT,
            process.env.DB_NAME
        );
        this.mongoose = require('mongoose');
        this.mongoose.Promise = global.Promise;
        this.Schema = this.mongoose.Schema;
    }

    connect() {
        return this.mongoose.connect(this.url); // return promise
    }

    getModel(schema, name) {
        return this.mongoose.model(name, schema);
    }

    getSchema(schema, name) {
        const newSchema = new this.Schema(schema, {
            versionKey: false
        });
        return newSchema;
    }

    getSchemas() {
        return this.Schema;
    }
}

module.exports = new Database();