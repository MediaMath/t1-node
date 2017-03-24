var common = require('./common');

module.exports = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "allEndpoints": {
        "id": "/allEndpoints",
        "type": "object",
        "properties": {
            "full": {
                "id": "/allEndpoints/full",
                "type": "array",
                "items": {
                    "type": "string"
                },
                "minItems": 1,
                "uniqueItems": true
            },
            "limit": {
                "id": "/allEndpoints/limit",
                "type": "object",
                "patternProperties": {
                    "^[a-zA-Z\.]+$": {"type": "integer"}
                },
                "additionalProperties": false,
                "maxProperties": 1
            },
            "page_limit": {
                "id": "/allEndpoints/page_limit",
                "type": "integer"
            },
            "page_offset": {
                "id": "/allEndpoints/page_offset",
                "type": "integer"
            },
            "q": {
                "id": "/allEndpoints/q",
                "type": "string"
            },
            "sort_by": {
                "id": "/allEndpoints/sort_by",
                "type": "string"
            },
            "with": {
                "id": "/allEndpoints/with",
                "type": "array",
                "items": {
                    "anyOf": [
                        {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        {
                            "type": "string"
                        }
                    ]
                },
                "minItems": 1,
                "uniqueItems": true
            }
        }
    },
    "allOf": [
        {
            "$ref": "#/allEndpoints"
        }
    ]
};
