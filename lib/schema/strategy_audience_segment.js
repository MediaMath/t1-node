const common = require('./common');

module.exports = {
  strategy_audience_segment: {
    id: '/strategy_audience_segment',
    type: 'object',
    properties: {
      strategy_id: {
        id: '/strategy_audience_segment/strategy_id',
        type: 'integer',
      },
      user_cpm: {
        id: '/strategy_audience_segment/user_cpm',
        type: 'number',
      },
      audience_segment_id: {
        id: '/strategy_audience_segment/audience_segment_id',
        type: 'integer',
      },
      group_identifier: {
        id: '/strategy_audience_segment/group_identifier',
        type: 'string',
      },
      restriction: {
        id: '/strategy_audience_segment/restriction',
        type: {
          enum: [
            'INCLUDE',
            'EXCLUDE',
          ],
        },
      },
      created_on: {
        id: '/strategy_audience_segment/created_on',
        type: 'string',
        format: 'datetimezone',
        readonly: true,
      },
      updated_on: {
        id: '/strategy_audience_segment/updated_on',
        type: 'string',
        format: 'datetimezone',
        readonly: true,
      },
    },
    required: [
      'name',
      'organization_id',
    ],
  },
  allOf: [
    common.entity,
    {
      $ref: '#/strategy_audience_segment',
    },
  ],
};
