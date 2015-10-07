/// <reference path="../../typings/node/node.d.ts"/>

var entityMap = require("./entitymap");

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
        const schemaContent = fs.readFileSync("./schema/" + this.entity_type + ".json", "utf8");
        this.schema = JSON.parse(schemaContent);
        if (id != null) {
            var that = this;
            this.connection.get(entityMap[this.entity_type] + "/" + id, function (response, body) {
                var content = JSON.parse(body);
                console.log(content);
                that.data = content.data;
                that.meta = content.meta;
            });
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

    save() {
        var verification = this.ensure_valid();
        if (verification.length == 0) {
            var schema = this.schema.properties.data.properties;
            var form = JSON.parse(JSON.stringify(this.data));
            Object.keys(schema).forEach(function (key) {
                if (schema[key].readonly) delete form[key];
            });

            this.connection.post(entityMap[this.entity_type] + "/" + this.data.id, form, console.log)
        }
        else {
            console.log(verification.join(', '));
        }
    }


}

export = Entity;