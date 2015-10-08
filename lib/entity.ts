/// <reference path="references.ts" />

const entitymap = require('./entitymap')

class Entity {
    private entity_type;
    private data;
    private meta;
    private schema;
    private connection;

    constructor(name:string, connection, id?:number) {
        this.data = {};
        this.meta = {};
        this.entity_type = name;
        this.connection = connection;
        const fs = require("fs");
        const schemaContent = fs.readFileSync(__dirname + "/schema/" + this.entity_type + ".json", "utf8");
        this.schema = JSON.parse(schemaContent);
        if (id != null) {
            var that = this;
            this.connection.get(entitymap.get_endpoint(this.entity_type) + "/" + id,
                function () { return that.update_entity.apply(that, arguments) });
        }
    }

    ensure_valid() {
        var Validator = require('jsonschema').Validator;
        var v = new Validator();
        var results = (v.validate(this, this.schema));
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
            var schema = this.schema.properties.data.properties;
            var form = JSON.parse(JSON.stringify(this.data));
            Object.keys(schema).forEach(function (key) {
                if (schema[key].readonly) delete form[key];
            });

            var endpoint = entitymap.get_endpoint(this.entity_type);
            if (typeof this.data.id != 'undefined') {
                endpoint += "/" + this.data.id;
            }
            this.connection.post(endpoint, form,
                function () { return that.update_entity.apply(that, arguments) })
        }
    }


}

export = Entity;
