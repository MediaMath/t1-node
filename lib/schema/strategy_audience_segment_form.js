module.exports = {
  "definitions": {
    "segment_array": {
      "type": "array",
      "items": {
        "type": "integer"
      },
      "minItems": 0,
      "uniqueItems": true
    }
  },
  "type": "object",
  "properties": {
    "include": {
      "$ref": "#/definitions/segment_array"
    },
    "include_op": {
      "enum": [
        "OR",
        "AND"
      ]
    },
    "exclude_op": {
      "enum": [
        "OR",
        "AND"
      ]
    }
  },
  "required": [
    "include_op",
    "exclude_op"
  ]
};
