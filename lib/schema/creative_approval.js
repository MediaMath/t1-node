var common = require('./common');

module.exports = {
  'creative_approval': {
    'id': '/creative_approval',
    'type': 'object',
    'properties': {
      'additional_detail': {
        'id': '/creative_approval/additional_detail',
        'type': 'integer',
        'readonly': true
      },
      'approval_status': {
        'id': '/creative_approval/approval_status',
        'type': 'integer',
        'readonly': true
      },
      'atomic_creative_approval_id': {
        'id': '/creative_approval/atomic_creative_id',
        'type': 'integer',
        'readonly': true
      },
      'creative_import_file_id': {
        'id': '/creative_approval/creative_import_file_id',
        'type': 'integer',
        'readonly': true
      },
      'external_identifier': {
        'id': '/creative_approval/external_identifier',
        'type': 'string',
        'readonly': true
      },
      'rejected_reason': {
        'id': '/creative_approval/rejected_reason',
        'type': 'string',
        'readonly': true
      },
      'supply_source_id': {
        'id': '/creative_approval/supply_source_id',
        'type': 'integer',
        'readonly': true
      },
      'created_on': {
        'id': '/creative_approval/created_on',
        'type': 'string',
        'format': 'datetimezone',
        'readonly': true
      },
      'updated_on': {
        'id': '/creative_approval/updated_on',
        'type': 'string',
        'format': 'datetimezone',
        'readonly': true
      }
    },
    'required': []
  },
  'allOf': [
    common.entity,
    {
      '$ref': '#/creative_approval'
    }
  ]
};
