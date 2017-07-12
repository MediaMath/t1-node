module.exports = {
  'definitions': {
    'segment_tuple': {
      'type': 'array',
      'items': [
        {
          'type': 'integer'
        },
        {
          'enum': [
            'OR',
            'AND'
          ]
        }
      ],
      'additionalItems': false
    },
    'segment_array': {
      'type': 'array',
      'items': {
        '$ref': '#/definitions/segment_tuple'
      },
      'minItems': 0,
      'uniqueItems': true
    }
  },
  'type': 'object',
  'properties': {
    'include': {
      '$ref': '#/definitions/segment_array'
    },
    'include_op': {
      'enum': [
        'OR',
        'AND'
      ]
    },
    'exclude_op': {
      'enum': [
        'OR',
        'AND'
      ]
    }
  },
  'required': [
    'include_op',
    'exclude_op'
  ]
};
