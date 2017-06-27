var common = require('./common');

module.exports = {
    "deal": {
        "id": "/deal",
        "type": "object",
        "properties": {
            "end_datetime": {
                "id": "/deal/end_datetime",
                "type": "string",
                "format": "datetime"
            },
            "deal_identifier": {
                "id": "/deal/deal_identifier",
                "type": "string"
            },
            "description": {
                "id": "/deal/description",
                "type": ["string", "null"]
            },
            "start_datetime": {
                "id": "/deal/start_datetime",
                "type": "string",
                "format": "datetime"
            },
            "permissions": {
                "type": "object",
                "properties": {
                    "all_organizations": {
                        "id": "/deal/permissions/all_organizations",
                        "type": "boolean"
                    },
                    "agency_ids": {
                        "id": "/deal/permissions/agency_ids",
                        "type": "array",
                        "items": {
                            "type": "integer"
                        },
                        "minItems": 0,
                        "uniqueItems": true
                    },
                    "organization_ids": {
                        "id": "/deal/permissions/organization_ids",
                        "type": "array",
                        "items": {
                            "type": "integer"
                        },
                        "minItems": 0,
                        "uniqueItems": true
                    },
                    "advertiser_ids": {
                        "id": "/deal/permissions/advertiser_ids",
                        "type": "array",
                        "items": {
                            "type": "integer"
                        },
                        "minItems": 0,
                        "uniqueItems": true
                    }
                }
            },
            "owner": {
                "type": "object",
                "properties": {
                    "type": {
                        "id": "/deal/owner/type",
                        "enum": [
                            "INTERNAL",
                            "ORGANIZATION",
                            "AGENCY",
                            "ADVERTISER"
                        ]
                    },
                    "id": {
                        "id": "/deal/price/id",
                        "type": "integer"
                    }
                }
            },
            "price": {
                "type": "object",
                "properties": {
                    "value": {
                        "id": "/deal/price/value",
                        "type": "string",
                        "pattern": "[0-9]+(\.[0-9]+)?"
                    },
                    "currency_code": {
                        "id": "/deal/price/currency_code",
                        "type": "string"
                    }
                }
            },
            "price_method": {
                "id": "/deal/price_method",
                "enum": [
                    "CPM"
                ],
                "default": "CPM"
            },
            "price_type": {
                "id": "/deal/price_type",
                "enum": [
                    "FIXED",
                    "FLOOR"
                ]
            },
            "status": {
                "id": "/deal/status",
                "type": "boolean"
            },
            "supply_source_id": {
                "id": "/deal/supply_source_id",
                "type": ["integer", "null"]
            },
            "sub_supply_source_id": {
                "id": "/deal/sub_supply_source_id",
                "type": ["integer", "null"]
            },
            "created_on": {
                "id": "/deal/created_on",
                "type": "string",
                "format": "datetime"
            },
            "updated_on": {
                "id": "/deal/updated_on",
                "type": "string",
                "format": "datetime"
            }
        },
        "required": [
            "start_datetime",
            "end_datetime",
            "deal_identifier",
            "name",
            "owner",
            "permissions",
            "price",
            "price_method",
            "price_type",
            "status"
        ]
    },
    "allOf": [
        common.entity,
        {
            "$ref": "#/deal"
        }
    ]
};
