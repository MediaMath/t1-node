var common = require('./common')

module.exports = {
  "audience_segment": {
    "id": "/audience_segment",
    "type": "object",
    "properties": {
      "buyable": {
        "id": "/audience_segment/data/buyable",
        "type": "boolean"
      },
      "child_count": {
        "id": "/audience_segment/data/child_count",
        "type": "integer",
        "readonly": true
      },
      "audience_vendor_id": {
        "id": "/audience_segment/data/audience_vendor_id",
        "type": "integer",
        "readonly": true
      },
      "full_path": {
        "id": "/audience_segment/data/full_path",
        "type": "string",
        "readonly": true
      },
      "type": {
        "id": "/audience_segment/data/type",
        "type": "type",
        "readonly": true
      },
      "updated_on": {
        "id": "/audience_segment/data/updated_on",
        "type": "string",
        "format": "datetimezone",
        "readonly": true
      },
      "created_on": {
        "id": "/audience_segment/data/created_on",
        "type": "string",
        "format": "datetimezone",
        "readonly": true
      }
    },
    "required": [
    ]
  },

  "allOf": [
    common.entity,
    {
      "$ref": "#/audience_segment"
    }
  ]
};
