var entitymap = require('./entitymap');
var schemaProcessing = require('./schemaProcessing');
var Promise = require('bluebird');
var Entity = (function () {
    function Entity(type, connection, id) {
        this.data = {};
        this.meta = {};
        this.data.entity_type = type;
        this.schemaLoaded = false;

    }

    Entity.prototype.get = function (id, connection, userParams) {
        if (connection != null) {
            var that = this;
            return connection.get(entitymap.get_endpoint(this.data.entity_type) + "/" + id)
                .then(function (body) {
                    var content = JSON.parse(body);
                    return that.update_entity(content.data, content.meta);
                });
        }
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
        return Promise.try(function () {
            if (!this.schemaLoaded) {
                return Promise.try(function () {
                    return schemaProcessing.loadSchema(that.data.entity_type);
                }).then(function (results) {
                    that.schemaLoaded = true;
                    that.schema = results.resolved;
                });
            } else {
                return undefined;
            }
        }).then(function (schemaPromise) {
            var verification = schemaProcessing.validateJson(that.data, that.schema);
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


    return Entity;
})();

module.exports = Entity;
