var common = require('./common');

module.exports = {
    "vendor_pixel": {
        "id": "/vendor_pixel",
        "type": "object",
        "properties": {
            "creative_id": {
                "id": "/vendor_pixel/creative_id",
                "type": "integer"
            },
            "set_by": {
                "id": "/vendor_pixel/set_by",
                "enum": [
                    "SYSTEM",
                    "USER"
                ],
                "default": "USER"
            },
            "tag": {
                "id": "/vendor_pixel/tag",
                "type": "string"
            },
            "tag_type": {
                "id": "/vendor_pixel/tag_type",
                "type": "string"
            },
            "created_on": {
                "id": "/vendor_pixel/created_on",
                "type": "string",
                "format": "datetimezone",
                "readonly": true
            },
            "updated_on": {
                "id": "/vendor_pixel/updated_on",
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
            "$ref": "#/vendor_pixel"
        }
    ]
};
