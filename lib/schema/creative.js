var common = require('./common')

module.exports = {
  "creative": {
    "id": "/creative",
    "type": "object",
    "properties": {
      "atomic_creative_id": {
        "id": "/creative/atomic_creative_id",
        "type": "integer"
      },
      "created_on": {
        "id": "/creative/created_on",
        "type": "string"
      },
      "last_modified": {
        "id": "/creative/last_modified",
        "type": "string"
      },
      "tag": {
        "id": "/creative/tag",
        "type": "string"
      },
      "tag_type": {
        "id": "/creative/tag_type",
        "type": "string"
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
      "$ref": "#/creative"
    }
  ]
};
