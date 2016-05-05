var common = require('./common');

module.exports = {
    "organization": {
        "id": "/organization",
        "type": "object",
        "properties": {
            "address_1": {
                "id": "/organization/address_1",
                "type": "string"
            },
            "address_2": {
                "id": "/organization/address_2",
                "type": "string"
            },
            "adx_seat_account_id": {
                "id": "/organization/adx_seat_account_id",
                "type": "integer"
            },
            "allow_byo_price": {
                "id": "/organization/allow_byo_price",
                "type": "boolean"
            },
            "allow_x_agency_pixels": {
                "id": "/organization/allow_x_agency_pixels",
                "type": "boolean"
            },
            "city": {
                "id": "/organization/city",
                "type": "string"
            },
            "contact_name": {
                "id": "/organization/contact_name",
                "type": "string"
            },
            "country": {
                "id": "/organization/country",
                "type": "string"
            },
            "currency_code": {
                "id": "/organization/currency_code",
                "type": "string"
            },
            "mm_contact_name": {
                "id": "/organization/mm_contact_name",
                "type": "string"
            },
            "phone": {
                "id": "/organization/phone",
                "type": "string"
            },
            "state": {
                "id": "/organization/state",
                "type": "string"
            },
            "status": {
                "id": "/organization/status",
                "type": "boolean"
            },
            "tag_ruleset": {
                "id": "/organization/tag_ruleset",
                "type": "string"
            },
            "use_evidon_optout": {
                "id": "/organization/use_evidon_optout",
                "type": "boolean"
            },
            "zip": {
                "id": "/organization/zip",
                "type": "string"
            },
            "created_on": {
                "id": "/organization/created_on",
                "type": "string",
                "format": "datetimezone",
                "readonly": true
            },
            "updated_on": {
                "id": "/organization/updated_on",
                "type": "string",
                "format": "datetimezone",
                "readonly": true
            }
        },
        "required": [
            "address_1",
            "city",
            "contact_name",
            "mm_contact_name",
            "name",
            "phone",
            "state",
            "zip"
        ]
    },
    "allOf": [
        common.entity,
        {
            "$ref": "#/organization"
        }
    ]
};
