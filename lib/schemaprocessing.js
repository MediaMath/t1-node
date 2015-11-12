function loadSchema(schemaName) {
    var fs = require("fs");
    var jsonrefs = require('json-refs');
    var schemaDir = __dirname + "/schema";
    console.log('schemadir: ' + schemaDir)
    var schemaContent = fs.readFileSync(schemaDir + '/' + schemaName + '.json', 'utf8');
    var jsonRefsOptions = {
        depth: 2,
        location: schemaDir
    };

    var entity_schema = JSON.parse(schemaContent);
    return jsonrefs.resolveRefs(entity_schema, jsonRefsOptions)
}

function validateJson(data, schema) {
    var Validator = require('jsonschema').Validator;
    var v = new Validator();
        console.log('data: ' + data);
        console.log('schema: ' + schema);
        var results = (v.validate(data, schema));
        return results.errors.map(function (obj) {
            return obj.stack;
    });
}

module.exports = {
    loadSchema,
    validateJson
};
