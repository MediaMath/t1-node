var common = require('./common');

module.exports = {
    "strategy_domain": {
        "id": "/strategy_domain",
        "type": "object",
        "properties": {
            "domain": {
                "id": "/strategy_domain/domain",
                "type": "string"
            },
            "restriction": {
                "id": "/strategy_domain/restriction",
                "type": "string"
            },
            "strategy_id": {
                "id": "/strategy_domain/strategy_id",
                "type": "integer"
            },
            "created_on": {
                "id": "/strategy_domain/created_on",
                "type": "string",
                "format": "datetimezone",
                "readonly": true
            },
            "updated_on": {
                "id": "/strategy_domain/updated_on",
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
            "$ref": "#/strategy_domain"
        }
    ]
};
