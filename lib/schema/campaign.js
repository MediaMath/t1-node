var common = require('./common')

module.exports = {
  "campaign": {
    "id": "/campaign",
    "type": "object",
    "properties": {
      "ad_server_fee": {
        "id": "/campaign/ad_server_fee",
        "type": "number"
      },
      "ad_server_id": {
        "id": "/campaign/ad_server_id",
        "type": "integer"
      },
      "ad_server_password": {
        "id": "/campaign/ad_server_password",
        "type": "string"
      },
      "ad_server_username": {
        "id": "/campaign/ad_server_username",
        "type": "string"
      },
      "advertiser_id": {
        "id": "/campaign/advertiser_id",
        "type": "integer"
      },
      "agency_fee_pct": {
        "id": "/campaign/agency_fee_pct",
        "type": "number"
      },
      "conversion_type": {
        "id": "/campaign/conversion_type",
        "type": {
          "enum": [
            "every",
            "one",
            "variable"
          ]
        },
        "default": "variable"
      },
      "conversion_variable_minutes": {
        "id": "/campaign/conversion_variable_minutes",
        "type": "integer"
      },
      "created_on": {
        "id": "/campaign/created_on",
        "type": "string",
        "readonly": true
      },
      "currency_code": {
        "id": "/campaign/currency_code",
        "type": "string"
      },
      "dcs_data_is_campaign_level": {
        "id": "/campaign/dcs_data_is_campaign_level",
        "type": "boolean"
      },
      "end_date": {
        "id": "/campaign/end_date",
        "type": "string",
        "format": "datetimezone"
      },
      "frequency_amount": {
        "id": "/campaign/frequency_amount",
        "type": "integer"
      },
      "frequency_interval": {
        "id": "/campaign/frequency_interval",
        "type": {
          "enum": [
            "hour",
            "day",
            "week",
            "month",
            "not-applicable"
          ]
        },
        "default": "not-applicable"
      },
      "frequency_type": {
        "id": "/campaign/frequency_type",
        "type": {
          "enum": [
            "even",
            "asap",
            "no-limit"
          ]
        },
        "default": "no-limit"
      },
      "goal_alert": {
        "type": "string"
      },
      "goal_category": {
        "id": "/campaign/goal_category",
        "type": {
          "enum": [
            "audience",
            "engagement",
            "response"
          ]
        }
      },
      "goal_type": {
        "id": "/campaign/goal_type",
        "type": {
          "enum": [
            "spend",
            "reach",
            "cpc",
            "cpe",
            "cpa",
            "roi"
          ]
        }
      },
      "goal_value": common.currency_array,
      "has_custom_attribution": {
        "id": "/campaign/has_custom_attribution",
        "type": "boolean"
      },
      "io_name": {
        "id": "/campaign/io_name",
        "type": "string"
      },
      "io_reference_num": {
        "id": "/campaign/io_reference_num",
        "type": "string"
      },
      "initial_start_date": {
        "id": "/campaign/initial_start_date",
        "type": "string",
        "readonly" : true
      },
      "margin_pct": {
        "id": "/campaign/margin_pct",
        "type": "number"
      },
      "merit_pixel_id": {
        "id": "/campaign/merit_pixel_id",
        "type": "integer"
      },
      "pacing_alert": {
        "id": "/campaign/pacing_alert",
        "type": "number"
      },
      "pc_window_minutes": {
        "id": "/campaign/pc_window_minutes",
        "type": "integer"
      },
      "pv_pct": {
        "id": "/campaign/pv_pct",
        "type": "number"
      },
      "pv_window_minutes": {
        "id": "/campaign/pv_window_minutes",
        "type": "integer"
      },
      "service_type": {
        "id": "/campaign/service_type",
        "type": {
          "enum": [
            "SELF",
            "MANAGED"
          ]
        },
        "default": "SELF"
      },
      "spend_cap_amount": {
        "id": "/campaign/spend_cap_amount",
        "type": "number"
      },
      "spend_cap_automatic": {
        "id": "/campaign/spend_cap_automatic",
        "type": "boolean"
      },
      "spend_cap_enabled": {
        "id": "/campaign/spend_cap_enabled",
        "type": "boolean"
      },
      "start_date": {
        "id": "/campaign/start_date",
        "type": "string",
        "format": "datetimezone"
      },
      "status": {
        "id": "/campaign/status",
        "type": "boolean"
      },
      "total_budget": common.currency_array,
      "updated_on": {
        "id": "/campaign/updated_on",
        "type": "string",
        "readonly": true
      },
      "use_default_ad_server": {
        "id": "/campaign/use_default_ad_server",
        "type": "boolean"
      },
      "use_mm_freq": {
        "id": "/campaign/use_mm_freq",
        "type": "boolean"
      },
      "zone_name": {
        "id": "/campaign/zone_name",
        "type": "string"
      }
    },
    "required": [
      "ad_server_id",
      "advertiser_id",
      "end_date",
      "goal_type",
      "goal_value",
      "service_type",
      "start_date",
      "total_budget",
      "use_mm_freq"
    ]
  },
  "allOf": [
    common.entity,
    {
      "$ref": "#/campaign"
    }
  ]
};
