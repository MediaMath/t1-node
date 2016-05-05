var common = require('./common');

module.exports = {
    "strategy_targeting_segment": {
        "id": "/strategy_targeting_segment",
        "type": "object",
        "properties": {
            "strategy_id": {
                "id": "/strategy_targeting_segment/strategy_id",
                "type": "integer"
            },
            "user_cpm": {
                "id": "/strategy_targeting_segment/user_cpm",
                "type": "number"
            },
            "targeting_segment_id": {
                "id": "/strategy_targeting_segment/targeting_segment_id",
                "type": "integer"
            },
            "operator": {
                "id": "/strategy_targeting_segment/operator",
                "enum": [
                    "AND",
                    "OR"
                ]
            },
            "group_identifier": {
                "id": "/strategy_targeting_segment/group_identifier",
                "type": "string"
            },
            "restriction": {
                "id": "/strategy_targeting_segment/restriction",
                "enum": [
                    "INCLUDE",
                    "EXCLUDE"
                ]
            },
            "created_on": {
                "id": "/strategy_targeting_segment/created_on",
                "type": "string",
                "format": "datetimezone",
                "readonly": true
            },
            "updated_on": {
                "id": "/strategy_targeting_segment/updated_on",
                "type": "string",
                "format": "datetimezone",
                "readonly": true
            }
        },
        "required": [
            "name",
            "organization_id"
        ]
    },
    "allOf": [
        common.entity,
        {
            "$ref": "#/strategy_targeting_segment"
        }
    ]
};
