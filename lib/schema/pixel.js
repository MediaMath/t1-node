var common = require('./common')

module.exports = {
  "pixel": {
    "id": "/pixel",
    "type": "object",
    "properties": {
      "bundle_id": {
        "id": "/pixel/bundle_id",
        "type": "integer"
      },
      "distributed": {
        "id": "/pixel/distributed",
        "type": "boolean"
      },
      "pixel_type": {
        "id": "/pixel/pixel_type",
        "type": {
          "enum": [
            "USER",
            "INTERNAL"
          ]
        }
      },
      "supply_source_id": {
        "id": "/pixel/supply_source_id",
        "type": "integer"
      },
      "tag": {
        "id": "/pixel/tag",
        "type": "string"
      },
      "created_on": {
        "id": "/pixel/created_on",
        "type": "string",
        "format": "datetimezone",
        "readonly": true
      },
      "updated_on": {
        "id": "/pixel/updated_on",
        "type": "string",
        "format": "datetimezone",
        "readonly": true
      }
    },
    "required": [
      "bundle_id",
      "pixel_type",
      "tag"
    ]
  },
  "allOf": [
    common.entity,
    {
      "$ref": "#/pixel"
    }
  ]
};
