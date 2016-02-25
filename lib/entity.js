"use strict";

var entitymap = require('./entitymap');
var schemaProcessing = require('./schemaProcessing');
var T1Connection = require('./t1connection');

var Entity = function (type, connection, id) {
    this.data = {};
    this.meta = {};
    this.data.entity_type = type;

    if (id != null && connection != null) {
        this.get(id, connection)
    }
};

Entity.prototype.get = function (id, connection, userParams) {
    if (connection == null) {
        throw new Error("connection object must be provided")
    }
    var that = this;
    return schemaProcessing.getSchema('userparams')
        .then(function (schema) {
            var verification = schemaProcessing.validateJson(userParams, schema);
            if (verification.length !== 0) {
                // you may want to specify a custom error type here, and set the verification
                // results as a property of them.
                throw new Error(verification);
            }
            var queryString = T1Connection.buildQueryString(entitymap.get_endpoint(that.data.entity_type) + "/" + id, userParams);
            return connection.get(queryString);
        }).then(function (body) {
            var content = JSON.parse(body);
            return that.update_entity(content.data, content.meta);
        })
};


// called on successful save of entity
Entity.prototype.update_entity = function (data, meta) {
    for (var property in data) {
        if (data.hasOwnProperty(property) &&
            data[property].constructor === Array &&
            data[property][0].hasOwnProperty('entity_type')) {
            var related = new Entity(data[property][0].entity_type);
            related.update_entity(data[property][0], {});
            data[property][0] = related;
        }
    }
    this.data = data;
    this.meta = meta;
    return this;
};

Entity.prototype.save = function (connection) {
    var that = this;
    return schemaProcessing.getSchema(that.data.entity_type)
        .then(function (schema) {
            var verification = schemaProcessing.validateJson(that.data, schema);
            if (verification.length != 0) {
                throw new Error(verification);
            }
            else {
                var schemaAllOf = that.schema.allOf;
                var form = JSON.parse(JSON.stringify(that.data));
                schemaAllOf.map(function (schema) {
                    Object.keys(schema.properties).forEach(function (key) {
                        if (schema.properties[key].readonly)
                            delete form[key];
                    });
                });
                var endpoint = entitymap.get_endpoint(that.data.entity_type);
                if (typeof that.data.id != 'undefined') {
                    endpoint += "/" + that.data.id;
                }
                return connection.post(endpoint, form).then(function (body) {
                    var content = JSON.parse(body);
                    return that.update_entity(content.data, content.meta);
                });
            }
        });
};


module.exports = Entity;
