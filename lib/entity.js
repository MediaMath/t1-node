var entitymap = require('./entitymap');
var Q = require('q');
var Entity = (function () {
    function Entity(type, connection, id) {
        this.data = {};
        this.meta = {};
        this.data.entity_type = type;
        this.loadSchema();

        if (connection != null ) {
            var that = this;
            return connection.get(entitymap.get_endpoint(this.data.entity_type) + "/" + id)
                .then(function (body) {
                    that.update_entity.apply(that, arguments);
                    return Q.resolve({
                        then: function(onFulfill, onReject) { onFulfill(that); }
                    })

                });
        }
    }

    Entity.prototype.ensure_valid = function () {
        var Validator = require('jsonschema').Validator;
        var v = new Validator();
        var results = (v.validate(this.data, this.schema));
        return results.errors.map(function (obj) {
            return obj.stack;
        });
    };

    Entity.prototype.loadSchema = function() {
        var fs = require("fs");
        var jsonrefs = require('json-refs');
        var schemaDir = __dirname + "/schema";
        var schemaContent = fs.readFileSync(schemaDir + '/' + this.data.entity_type + ".json", "utf8");
        var jsonRefsOptions = {
            depth: 2,
            location: schemaDir
        };
        var that = this;
        var entity_schema = JSON.parse(schemaContent);
        jsonrefs.resolveRefs(entity_schema, jsonRefsOptions).then(function (results) {
            that.schema = results.resolved;
            that.schema_meta = results.metadata;
        });
    };

    // called on successful save of entity
    Entity.prototype.update_entity = function (body) {
        var content = JSON.parse(body);
        this.data = content.data;
        this.meta = content.meta;
    };

    Entity.prototype.save = function (connection) {
        var verification = this.ensure_valid();
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
