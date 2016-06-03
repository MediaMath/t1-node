module.exports = {
    "definitions": {
        "target_value": {
            "type": "object",
            "properties": {
                "code": {
                    "type": "string",
                    "format": "[A-Z]{4}"
                },
                "value_ids": {
                    "type": "array",
                    "items": {
                        "type": "integer"
                    },
                    "minItems": 1,
                    "uniqueItems": true
                },
                "restriction": {
                    "enum": [
                        "INCLUDE",
                        "EXCLUDE"
                    ]
                },
                "operation": {
                    "enum": [
                        "OR",
                        "AND"
                    ]
                }
            },
            "required": [
                "code",
                "value_ids",
                "restriction",
                "operation"
            ]
        }
    },
    "type":"object",
    "properties": {
        "dimensions": {
            "type": "array",
            "items": {
                "$ref": "#/definitions/target_value"
            },
            "minItems": 1,
            "uniqueItems": true
        }
    },
    "required": [
        "dimensions"
    ]
};
