var entitymap = require('./entitymap');
var schemaProcessing = require('./schemaProcessing');
var Promise = require('bluebird');
var Entity = (function () {
    function Entity(type, connection, id) {
        this.data = {};
        this.meta = {};
        this.data.entity_type = type;
        schemaProcessing.loadSchema(type).then(function (results) {
            that.schema = results.resolved;
            that.schema_meta = results.metadata;
        });
    }

    Entity.prototype.get = function (id, connection) {
        if (connection != null ) {
            var that = this;
            return connection.get(entitymap.get_endpoint(this.data.entity_type) + "/" + id)
                .then(function (body) {
                    return that.update_entity(body);
                });
        }
    };


    // called on successful save of entity
    Entity.prototype.update_entity = function (body) {
        var content = JSON.parse(body);
        this.data = content.data;
        this.meta = content.meta;
        return this;
    };

    Entity.prototype.save = function (connection) {
        var that = this;
        return Promise.try(function() {
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
            var endpoint = entitymap.get_endpoint(this.data.entity_type);
            if (typeof this.data.id != 'undefined') {
                endpoint += "/" + that.data.id;
            }
            return connection.post(endpoint, form).then(function () {
                that.update_entity.apply(that, arguments);
            });
        }
        })
    };


    return Entity;
})();

module.exports = Entity;
