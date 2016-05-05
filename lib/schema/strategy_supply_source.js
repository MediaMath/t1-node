var common = require('./common');

module.exports = {
    "strategy_domain": {
        "id": "/strategy_domain",
        "type": "object",
        "properties": {
            "strategy_id": {
                "id": "/strategy_domain/concept_id",
                "type": "integer"
            },
            "supply_source_id": {
                "id": "/strategy_domain/supply_source_id",
                "type": "integer"
            }
        },
        "required": [
            "strategy_id",
            "supply_source_id"
        ]
    },
    "allOf": [
        common.entity,
        {
            "$ref": "#/strategy_domain"
        }
    ]
};
