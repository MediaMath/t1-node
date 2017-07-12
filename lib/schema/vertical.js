var common = require('./common');

module.exports = {
  'vertical': {
    'id': '/vertical',
    'type': 'object',
    'properties': {
      'created_on': {
        'id': '/vertical/created_on',
        'type': 'string',
        'format': 'datetimezone',
        'readonly': true
      },
      'updated_on': {
        'id': '/vertical/updated_on',
        'type': 'string',
        'format': 'datetimezone',
        'readonly': true
      }
    },
    'required': [
      'name'
    ]
  },
  'allOf': [
    common.entity,
    {
      '$ref': '#/vertical'
    }
  ]
};
