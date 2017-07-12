var common = require('./common');

module.exports = {
  'site_placement': {
    'id': '/site_placement',
    'type': 'object',
    'properties': {
      'display_text': {
        'id': '/site_placement/display_text',
        'type': 'string'
      },
      'bill_media_to_client': {
        'id': '/site_placement/bill_media_to_client',
        'type': 'boolean'
      },
      'pmp_type': {
        'id': '/site_placement/pmp_type',
        'enum': [
          'DIRECT',
          'PREMIUM'
        ],
        'default': 'DIRECT'
      },
      'publisher_site_id': {
        'id': '/site_placement/publisher_site_id',
        'type': 'integer'
      },
      'media_type': {
        'id': '/site_placement/media_type',
        'enum': [
          'display',
          'video',
          'mobile'
        ],
        'default': 'display'
      },
      'deal_source': {
        'id': '/site_placement/deal_source',
        'enum': [
          'USER',
          'INTERNAL'
        ],
        'default': 'USER'
      },
      'created_on': {
        'id': '/site_placement/created_on',
        'type': 'string',
        'format': 'datetimezone',
        'readonly': true
      },
      'updated_on': {
        'id': '/site_placement/updated_on',
        'type': 'string',
        'format': 'datetimezone',
        'readonly': true
      }
    },
    'required': [
      'name',
      'publisher_site_id'
    ]
  },
  'allOf': [
    common.entity,
    {
      '$ref': '#/site_placement'
    }
  ]
};
