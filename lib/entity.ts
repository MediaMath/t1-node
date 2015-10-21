/// <reference path="references.ts" />

const entitymap = require('./entitymap')

class Entity {
    private entity_type;
    private data;
    private meta;
    private schema;
    private schema_meta;
    private connection;

    constructor(name:string, connection, id?:number) {
        var that = this
        this.data = {};
        this.meta = {};
        this.entity_type = name;
        this.connection = connection;
        const fs = require("fs");
        const jsonrefs = require('json-refs');
        const schemaDir = __dirname + "/schema";
        const schemaContent = fs.readFileSync(schemaDir + '/' + this.entity_type + ".json", "utf8");
        var jsonrefs_options = {
            depth: 2,
            location: schemaDir
        };

        var entity_schema = JSON.parse(schemaContent);

        jsonrefs.resolveRefs(entity_schema, jsonrefs_options).then(function (results) {
            that.schema = results.resolved;
            that.schema_meta = results.metadata;
        });

        if (id != null) {
            var that = this;
            this.connection.get(entitymap.get_endpoint(this.entity_type) + "/" + id,
                function () {
                    return that.update_entity.apply(that, arguments)
                });
        }
    }

    ensure_valid() {
        var Validator = require('jsonschema').Validator;

        var v = new Validator();
        var results = (v.validate(this.data, this.schema));
        return results.errors.map(function (obj) {
            return obj.stack;
        })
    }


    // called on successful save of entity
    private update_entity(response, body) {
        var content = JSON.parse(body);
        console.log(content);
        this.data = content.data;
        this.meta = content.meta;
    }

    save() {
        var verification = this.ensure_valid();
        if (verification.length != 0) {
            console.log(verification.join(', '));
        }
        else {
            var that = this;
            var schema = this.schema[this.entity_type].properties;
            var form = JSON.parse(JSON.stringify(this.data));
            Object.keys(schema).forEach(function (key) {
                if (schema[key].readonly) delete form[key];
            });

            var endpoint = entitymap.get_endpoint(this.entity_type);
            if (typeof this.data.id != 'undefined') {
                endpoint += "/" + this.data.id;
            }
            console.log(endpoint)
            console.log(form)
            this.connection.post(endpoint, form,
                function () {
                    return that.update_entity.apply(that, arguments)
                })
        }
    }


}

export = Entity;
