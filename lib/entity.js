var entitymap = require('./entitymap');
var Q = require('q');
var Entity = (function () {
    function Entity(type, connection, id) {
        this.data = {};
        this.meta = {};
        this.data.entity_type = type;
        if (connection != null ) {
            var that = this;
            this.connection.get(entitymap.get_endpoint(this.data.entity_type) + "/" + id, function () {
                return that.update_entity.apply(that, arguments);
            });
        }

        this.loadSchema();
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
    Entity.prototype.update_entity = function (response, body) {
        var content = JSON.parse(body);
        console.log(content);
        this.data = content.data;
        this.meta = content.meta;
    };

    Entity.prototype.save = function (connection) {
        var verification = this.ensure_valid();
        if (verification.length != 0) {
            console.log(verification.join(', '));
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
            connection.post(endpoint, form, function () {
                return that.update_entity.apply(that, arguments);
            });
        }
    };
    return Entity;
})();

module.exports = Entity;
