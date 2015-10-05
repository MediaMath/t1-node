/// <reference path="../../typings/node/node.d.ts"/>

class Agency {
    private data;
    private meta;
    private schema;
    private connection = require("../connection");

    constructor() {
        this.data = {};
        this.meta = {};
        var fs = require("fs");
        var schemaContent = fs.readFileSync("../schema/agency.json", "utf8");
        this.schema = JSON.parse(schemaContent);
    }

    ensure_valid() {
        var Validator = require('jsonschema').Validator;
        var v = new Validator();
        console.log(v.validate(this, this.schema))
    }
}

export = Agency;