var common = require('./common');

module.exports = {
    "target_dimension": {
        "id": "/target_dimension",
        "type": "object",
        "properties": {
            "code": {
                "id": "/target_dimension/code",
                "type": "string"
            }
        },
        "required": []
    },
    "allOf": [
        common.entity,
        {
            "$ref": "#/target_dimension"
        }
    ]
};
