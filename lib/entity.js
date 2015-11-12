var entitymap = require('./entitymap');
var schemaProcessing = require('./schemaProcessing');
var Q = require('q');
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
        var verification = schemaProcessing.validateJson(this.data, this.schema);
        if (verification.length != 0) {
            return Q.resolve({
                then: function(onFulfill, onReject) { onReject(verification); }
            })
        }
        else {
            var that = this;
            var schemaAllOf = this.schema.allOf;
            var form = JSON.parse(JSON.stringify(this.data));
            schemaAllOf.map(function (schema) {
                Object.keys(schema.properties).forEach(function (key) {
                    if (schema.properties[key].readonly)
                        delete form[key];
                });
            });
            var endpoint = entitymap.get_endpoint(this.data.entity_type);
            if (typeof this.data.id != 'undefined') {
                endpoint += "/" + this.data.id;
            }
            return connection.post(endpoint, form).then(function () {
                that.update_entity.apply(that, arguments);
                return Q.resolve({
                    then: function(onFulfill, onReject) { onFulfill(that); }
                })
            });
        }
    };


    return Entity;
})();

module.exports = Entity;
