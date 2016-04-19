var common = require('./common')

module.exports = {
  "concept": {
    "id": "/concept",
    "type": "object",
    "properties": {
      "advertiser_id": {
        "id": "/concept/advertiser_id",
        "type": "integer"
      },
      "created_on": {
        "id": "/concept/created_on",
        "type": "string",
        "format": "datetimezone"
      },
      "status": {
        "id": "/concept/status",
        "type": "boolean"
      },
      "updated_on": {
        "id": "/concept/updated_on",
        "type": "string",
        "format": "datetimezone"
      }
    },
    "required": [
      "advertiser_id",
      "name"
    ]
  },
  "allOf": [
    common.entity,
    {
      "$ref": "#/concept"
    }
  ]
};
