var common = require('./common')

module.exports = {
  "placement_slot": {
    "id": "/placement_slot",
    "type": "object",
    "properties": {
      "ad_slot": {
        "id": "/placement_slot/ad_slot",
        "type": "integer"
      },
      "allow_remnant": {
        "id": "/placement_slot/allow_remnant",
        "type": "boolean"
      },
      "auction_type": {
        "id": "/placement_slot/auction_type",
        "type": {
          "enum": [
            "FIRST_PRICED",
            "SECOND_PRICED"
          ]
        },
        "default": "FIRST_PRICED"
      },
      "budget": {
        "id": "/placement_slot/budget",
        "type": "number"
      },
      "buy_price": {
        "id": "/placement_slot/buy_price",
        "type": "number"
      },
      "buy_price_type": {
        "id": "/placement_slot/buy_price_type",
        "type": {
          "enum": [
            "CPM"
          ]
        },
        "default": "CPM"
      },
      "description": {
        "id": "/placement_slot/description",
        "type": "string"
      },
      "end_date": {
        "id": "/placement_slot/end_date",
        "type": "string",
        "format": "datetimezone"
      },
      "est_volume": {
        "id": "/placement_slot/est_volume",
        "type": "number"
      },
      "frequency_amount": {
        "id": "/placement_slot/frequency_amount",
        "type": "integer"
      },
      "frequency_interval": {
        "id": "/placement_slot/frequency_interval",
        "type": {
          "enum": [
            "hour",
            "day",
            "week",
            "month",
            "campaign",
            "not-applicable"
          ]
        },
        "default": "not-applicable"
      },
      "frequency_type": {
        "id": "/placement_slot/frequency_type",
        "type": {
          "enum": [
            "even",
            "asap",
            "no-limit"
          ]
        },
        "default": "no-limit"
      },
      "height": {
        "id": "/placement_slot/height",
        "type": "integer"
      },
      "prm_pub_ceiling": {
        "id": "/placement_slot/prm_pub_ceiling",
        "type": "number"
      },
      "prm_pub_markup": {
        "id": "/placement_slot/prm_pub_markup",
        "type": "number"
      },
      "sell_price": {
        "id": "/placement_slot/sell_price",
        "type": "number"
      },
      "sell_price_type": {
        "id": "/placement_slot/sell_price_type",
        "type": {
          "enum": [
            "CPM"
          ]
        },
        "default": "CPM"
      },
      "site_placement_id": {
        "id": "/placement_slot/site_placement_id",
        "type": "integer"
      },
      "start_date": {
        "id": "/placement_slot/start_date",
        "type": "string",
        "format": "datetimezone"
      },
      "volume_unit": {
        "id": "/placement_slot/volume_unit",
        "type": {
          "enum": [
            "impressions"
          ]
        },
        "default": "impressions"
      },
      "width": {
        "id": "/placement_slot/sell_price",
        "type": "integer"
      },
      "created_on": {
        "id": "/placement_slot/created_on",
        "type": "string",
        "format": "datetimezone",
        "readonly": true
      },
      "updated_on": {
        "id": "/placement_slot/updated_on",
        "type": "string",
        "format": "datetimezone",
        "readonly": true
      }
    },
    "required": [
      "auction_type",
      "buy_price",
      "buy_price_type",
      "height",
      "site_placement_id",
      "width"
    ]
  },
  "allOf": [
    common.entity,
    {
      "$ref": "#/placement_slot"
    }
  ]
};
