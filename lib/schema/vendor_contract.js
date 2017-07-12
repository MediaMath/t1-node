var common = require('./common');

module.exports = {
  'vendor_contract': {
    'id': '/vendor_contract',
    'type': 'object',
    'properties': {
      'campaign_id': {
        'id': '/vendor_contract/campaign_id',
        'type': 'integer'
      },
      'price': {
        'id': '/vendor_contract/price',
        'type': 'number'
      },
      'rate_card_type': {
        'id': '/vendor_contract/rate_card_type',
        'type': 'string'
      },
      'use_mm_contract': {
        'id': '/vendor_contract/use_mm_contract',
        'type': 'boolean'
      },
      'vendor_id': {
        'id': '/vendor_contract/vendor_id',
        'type': 'integer'
      },
      'created_on': {
        'id': '/vendor_contract/created_on',
        'type': 'string',
        'format': 'datetimezone',
        'readonly': true
      },
      'updated_on': {
        'id': '/vendor_contract/updated_on',
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
      '$ref': '#/vendor_contract'
    }
  ]
};
