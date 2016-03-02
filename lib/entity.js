"use strict";

var EntityMap = require('./entitymap');
var SchemaProcessing = require('./schemaProcessing');
var T1Connection = require('./t1connection');

var Entity = function (type, connection, id) {
    this.entity_type = type;

    if (id != null && connection != null) {
        this.get(id, connection)
    }
};

Entity.prototype.get = function (id, connection, userParams) {
    if (connection == null) {
        throw new Error("connection object must be provided")
    }
    var that = this;
    return SchemaProcessing.getSchema('userparams')
        .then(function (schema) {
            var verification = SchemaProcessing.validateJson(userParams, schema);
            if (verification.length !== 0) {
                // you may want to specify a custom error type here, and set the verification
                // results as a property of them.
                throw new Error(verification);
            }
            var queryString = T1Connection.buildQueryString(EntityMap.getEndpoint(that.entity_type) + "/" + id, userParams);
            return connection.get(queryString);
        }).then(function (body) {
            var content = JSON.parse(body);
            return that.processEntity(content.data, content.meta);
        })
};


// called on successful save of entity
Entity.prototype.processEntity = function (data, meta) {
    for (var property in data) {
        if (!data.hasOwnProperty(property)) {
            continue;
        }
        if (data[property].constructor === Array &&
            data[property][0].hasOwnProperty('entity_type')) {
            var EntityList = require('./entitylist');
            data[property] = EntityList.processEntityList(data[property], {});
        }
        else if (data[property].constructor === Object &&
            data[property].hasOwnProperty('entity_type')) {
            var related = new Entity(data[property].entity_type);
            related.processEntity(data[property], {});
            data[property] = related;
        }
        else if (data[property].constructor === Array &&
            data[property][0].hasOwnProperty('currency_code')) {
            data[property] = Number(data[property][0].value);
        }
    }

    if (meta !== undefined) {
        data.meta = meta;
    }

    Object.assign(this, data);
    return this;
};

Entity.prototype.save = function (connection) {
    var that = this;
    return SchemaProcessing.getSchema(that.entity_type)
        .then(function (schema) {
            var verification = SchemaProcessing.validateJson(that, schema);
            if (verification.length != 0) {
                throw new Error(verification);
            }
            else {
                var schemaAllOf = schema.allOf;
                var encodeForPost = function (key, value) {
                    if (typeof value === "boolean") {
                        return Number(value);
                    }
                    else if (typeof value === "function") {
                        return undefined;
                    }
                    return value;
                };

                var form = JSON.parse(JSON.stringify(that, encodeForPost));
                schemaAllOf.map(function (schema) {
                    Object.keys(schema.properties).forEach(function (key) {
                        if (schema.properties[key].readonly) {
                            delete form[key];
                        }
                    });
                });
                var endpoint = entitymap.getEndpoint(that.entity_type);
                if (typeof that.id != 'undefined') {
                    endpoint += "/" + that.id;
                }
                return connection.post(endpoint, form).then(function (body) {
                    var content = JSON.parse(body);
                    return that.processEntity(content.data, content.meta);
                });
            }
        });
};


module.exports = Entity;
