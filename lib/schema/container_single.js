var common = require('./common')

module.exports = {
  "id": "/container_single",
  "type": "object",
  "properties": {
    "data": {
      "oneOf": [
        {
          "$ref": "atomic_creative.json#/atomic_creative"
        },
        {
          "$ref": "agency.json#/agency"
        }
      ]
    }
  },

  "required": [
    "data",
    "meta"
  ]
};
