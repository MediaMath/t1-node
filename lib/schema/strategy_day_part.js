var common = require('./common');

module.exports = {
  'strategy_day_part': {
    'id': '/strategy_day_part',
    'type': 'object',
    'properties': {
      'days': {
        'id': '/strategy_day_part/days',
        'type': 'string'
      },
      'end_hour': {
        'id': '/strategy_day_part/end_hour',
        'type': 'integer'
      },
      'start_hour': {
        'id': '/strategy_day_part/start_hour',
        'type': 'integer'
      },
      'status': {
        'id': '/strategy_day_part/status',
        'type': 'boolean'
      },
      'strategy_id': {
        'id': '/strategy_day_part/strategy_id',
        'type': 'integer'
      },
      'user_time': {
        'id': '/strategy_day_part/user_time',
        'type': 'boolean'
      },
      'created_on': {
        'id': '/strategy_day_part/created_on',
        'type': 'string',
        'format': 'datetimezone',
        'readonly': true
      },
      'updated_on': {
        'id': '/strategy_day_part/updated_on',
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
      '$ref': '#/strategy_day_part'
    }
  ]
};
