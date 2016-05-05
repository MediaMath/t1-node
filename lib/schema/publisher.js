var common = require('./common');

module.exports = {
    "publisher": {
        "id": "/publisher",
        "type": "object",
        "properties": {
            "organization_id": {
                "id": "/publisher/organization_id",
                "type": "integer"
            },
            "created_on": {
                "id": "/publisher/created_on",
                "type": "string",
                "format": "datetimezone",
                "readonly": true
            },
            "updated_on": {
                "id": "/publisher/updated_on",
                "type": "string",
                "format": "datetimezone",
                "readonly": true
            }
        },
        "required": [
            "name"
        ]
    },
    "allOf": [
        common.entity,
        {
            "$ref": "#/publisher"
        }
    ]
};
