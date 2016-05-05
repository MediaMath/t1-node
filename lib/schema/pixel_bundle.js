var common = require('./common');

module.exports = {
    "pixel_bundle": {
        "id": "/pixel_bundle",
        "type": "object",
        "properties": {
            "advertiser_id": {
                "id": "/pixel_bundle/advertiser_id",
                "type": "integer"
            },
            "agency_id": {
                "id": "/pixel_bundle/agency_id",
                "type": "integer"
            },
            "cost_cpm": {
                "id": "/pixel_bundle/cost_cpm",
                "type": "number"
            },
            "cost_cpts": {
                "id": "/pixel_bundle/cost_cpts",
                "type": "number"
            },
            "cost_pct_cpm": {
                "id": "/pixel_bundle/cost_pct_cpm",
                "type": "number"
            },
            "eligible": {
                "id": "/pixel_bundle/eligible",
                "type": "boolean"
            },
            "external_identifier": {
                "id": "/pixel_bundle/external_identifier",
                "type": "string"
            },
            "keywords": {
                "id": "/pixel_bundle/keywords",
                "type": "string"
            },
            "pixel_type": {
                "id": "/pixel_bundle/pixel_type",
                "enum": [
                    "creative",
                    "event",
                    "data",
                    "segment"
                ],
                "default": "event"
            },
            "pricing": {
                "id": "/pixel_bundle/pricing",
                "enum": [
                    "CPM",
                    "CPTS"
                ],
                "default": "CPM"
            },
            "provider_id": {
                "id": "/pixel_bundle/provider_id",
                "type": "integer"
            },
            "rmx_conversion_minutes": {
                "id": "/pixel_bundle/rmx_conversion_minutes",
                "type": "integer"
            },
            "rmx_conversion_type": {
                "id": "/pixel_bundle/rmx_conversion_type",
                "enum": [
                    "one",
                    "variable"
                ],
                "default": "one"
            },
            "rmx_friendly": {
                "id": "/pixel_bundle/rmx_friendly",
                "type": "boolean"
            },
            "rmx_merit": {
                "id": "/pixel_bundle/rmx_merit",
                "type": "boolean"
            },
            "rmx_pc_window_minutes": {
                "id": "/pixel_bundle/rmx_pc_window_minutes",
                "type": "integer"
            },
            "rmx_pv_window_minutes": {
                "id": "/pixel_bundle/rmx_pv_window_minutes",
                "type": "integer"
            },
            "segment_op": {
                "id": "/pixel_bundle/segment_op",
                "type": "string"
            },
            "status": {
                "id": "/pixel_bundle/status",
                "type": "boolean"
            },
            "tag_type": {
                "id": "/pixel_bundle/tag_type",
                "enum": [
                    "dfa",
                    "uat",
                    "image",
                    "iframe",
                    "js"
                ],
                "default": "image"
            },
            "tags": {
                "id": "/pixel_bundle/tags",
                "type": "string"
            },
            "type": {
                "id": "/pixel_bundle/type",
                "type": "string"
            },
            "created_on": {
                "id": "/pixel_bundle/created_on",
                "type": "string",
                "format": "datetimezone",
                "readonly": true
            },
            "updated_on": {
                "id": "/pixel_bundle/updated_on",
                "type": "string",
                "format": "datetimezone",
                "readonly": true
            }
        },
        "required": [
            "name",
            "pixel_type",
            "tag_type"
        ]
    },
    "allOf": [
        common.entity,
        {
            "$ref": "#/pixel_bundle"
        }
    ]
};
