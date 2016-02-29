"use strict";

var fs = require("fs");
var jsonrefs = require('json-refs');
var Promise = require('bluebird');

var _schemas = {};

function getSchema(schemaName) {
    return Promise.try(function () {
        if (!_schemas[schemaName]) {
            return Promise.try(function () {
                return _loadSchema(schemaName);
            }).then(function (results) {
                _schemas[schemaName] = results.resolved;
                return _schemas[schemaName];
            });
        } else {
            return _schemas[schemaName];
        }
    })
}

function _loadSchema(schemaName) {
    var schemaDir = __dirname + "/schema";
    var schemaContent = fs.readFileSync(schemaDir + '/' + schemaName + '.json', 'utf8');
    var jsonRefsOptions = {
        depth: 2,
        location: schemaDir
    };

    var entity_schema = JSON.parse(schemaContent);
    return jsonrefs.resolveRefs(entity_schema, jsonRefsOptions)
}

function validateJson(data, schema) {
    var Validator = require('jsonschema').Validator;
    var v = new Validator();
    var results = (v.validate(data, schema));
    return results.errors.map(function (obj) {
        return obj.stack;
    });
}

module.exports = {
    getSchema,
    validateJson
};
