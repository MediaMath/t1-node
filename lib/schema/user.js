var common = require('./common');

module.exports = {
    "user": {
        "id": "/user",
        "type": "object",
        "properties": {
            "access_internal_fees": {
                "id": "/user/access_internal_fees",
                "type": "boolean"
            },
            "active": {
                "id": "/user/active",
                "type": "boolean"
            },
            "creator_id": {
                "id": "/user/creator_id",
                "type": "integer",
                "readonly": true
            },
            "edit_campaigns": {
                "id": "/user/edit_campaigns",
                "type": "boolean"
            },
            "edit_data_definition": {
                "id": "/user/edit_data_definition",
                "type": "boolean"
            },
            "edit_margins_and_performance": {
                "id": "/user/edit_margins_and_performance",
                "type": "boolean"
            },
            "fax": {
                "id": "/user/fax",
                "type": "string"
            },
            "first_name": {
                "id": "/user/first_name",
                "type": "string"
            },
            "labs_enable_rmx": {
                "id": "/user/labs_enable_rmx",
                "type": "boolean"
            },
            "last_login_on": {
                "id": "/user/last_login_on",
                "type": "string",
                "format": "datetimezone",
                "readonly": true
            },
            "last_name": {
                "id": "/user/last_name",
                "type": "string"
            },
            "link_ldap": {
                "id": "/user/link_ldap",
                "type": "boolean"
            },
            "mobile": {
                "id": "/user/mobile",
                "type": "string"
            },
            "password": {
                "id": "/user/password",
                "type": "string"
            },
            "password_reset_sent": {
                "id": "/user/password_reset_sent",
                "type": "string",
                "format": "datetimezone",
                "readonly": true
            },
            "password_reset_token": {
                "id": "/user/password_reset_token",
                "type": "string",
                "readonly": true
            },
            "phone": {
                "id": "/user/phone",
                "type": "string"
            },
            "role": {
                "id": "/user/role",
                "enum": [
                    "ADMIN",
                    "MANAGER",
                    "REPORTER"
                ],
                "default": "REPORTER"
            },
            "scope": {
                "id": "/user/role",
                "enum": [
                    "GLOBAL",
                    "SELECT"
                ],
                "default": "SELECT"
            },
            "sso_auth_sent": {
                "id": "/user/sso_auth_sent",
                "type": "string",
                "format": "datetimezone",
                "readonly": true
            },
            "sso_auth_token": {
                "id": "/user/sso_auth_token",
                "type": "string",
                "readonly": true
            },
            "title": {
                "id": "/user/title",
                "type": "string"
            },
            "type": {
                "id": "/user/type",
                "enum": [
                    "INTERNAL",
                    "AGENCY",
                    "VPAN",
                    "ADVERTISER"
                ],
                "default": "ADVERTISER"
            },
            "username": {
                "id": "/user/username",
                "type": "string"
            },
            "view_data_definition": {
                "id": "/user/view_data_definition",
                "type": "boolean"
            },
            "view_dmp_reports": {
                "id": "/user/view_dmp_reports",
                "type": "boolean"
            },
            "view_segments": {
                "id": "/user/view_segments",
                "type": "boolean"
            },
            "view_organizations": {
                "id": "/user/view_organizations",
                "type": "boolean"
            },
            "created_on": {
                "id": "/user/created_on",
                "type": "string",
                "format": "datetimezone",
                "readonly": true
            },
            "updated_on": {
                "id": "/user/updated_on",
                "type": "string",
                "format": "datetimezone",
                "readonly": true
            }
        },
        "required": [
            "first_name",
            "last_name",
            "role",
            "scope",
            "title",
            "type",
            "username"
        ]
    },
    "allOf": [
        common.entity,
        {
            "$ref": "#/user"
        }
    ]
};
