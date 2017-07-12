module.exports = {
  'entity': {
    'id': '/entity',
    'type': 'object',
    'properties': {
      'id': {
        'id': '/entity/id',
        'type': 'integer',
        'readonly': true
      },
      'entity_type': {
        'id': '/entity/entity_type',
        'type': 'string',
        'readonly': true
      },
      'name': {
        'id': '/entity/name',
        'type': 'string'
      },
      'version': {
        'id': '/entity/version',
        'type': 'integer'
      },
      'meta': {
        'id': '/entity/meta',
        'type': 'object',
        'readonly': true
      }
    },
    'required': [
      'entity_type',
      'name'
    ]
  },
  'currency_array': {
    'type': 'array',
    'items': {
      'type': 'object',
      'properties': {
        'currency_code': {
          'type': 'string'
        },
        'value': {
          'type': 'number'
        }
      }
    },
    'minItems': 1,
    'uniqueItems': true
  },
  'logical_and_or': {
    'type': {
      'enum': [
        'AND',
        'OR'
      ]
    },
    'default': 'OR'
  }
};
