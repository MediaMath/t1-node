const common = require('./common');

module.exports = {
  supply_source: {
    id: '/supply_source',
    type: 'object',
    properties: {
      bidder_exchange_identifier: {
        id: '/supply_source/bidder_exchange_identifier',
        type: 'integer',
      },
      code: {
        id: '/supply_source/code',
        type: 'string',
      },
      default_seat_identifier: {
        id: '/supply_source/default_seat_identifier',
        type: 'string',
      },
      distribute: {
        id: '/supply_source/distribute',
        type: 'boolean',
      },
      has_display: {
        id: '/supply_source/has_display',
        type: 'boolean',
      },
      has_mobile_display: {
        id: '/supply_source/has_mobile_display',
        type: 'boolean',
      },
      has_mobile_video: {
        id: '/supply_source/has_mobile_video',
        type: 'boolean',
      },
      has_video: {
        id: '/supply_source/has_video',
        type: 'boolean',
      },
      is_proservice: {
        id: '/supply_source/is_proservice',
        type: 'boolean',
      },
      mm_safe: {
        id: '/supply_source/mm_safe',
        type: 'boolean',
      },
      parent_supply_id: {
        id: '/supply_source/parent_supply_id',
        type: 'integer',
      },
      pixel_tag: {
        id: '/supply_source/pixel_tag',
        type: 'string',
      },
      pmp_enabled: {
        id: '/supply_source/pmp_enabled',
        type: 'boolean',
      },
      rtb_enabled: {
        id: '/supply_source/rtb_enabled',
        type: 'boolean',
      },
      rtb_type: {
        id: '/supply_source/rtb_type',
        enum: [
          'STANDARD',
          'MARKETPLACE',
        ],
      },
      seat_enabled: {
        id: '/supply_source/seat_enabled',
        type: 'boolean',
      },
      status: {
        id: '/supply_source/status',
        type: 'boolean',
      },
      supply_type: {
        id: '/supply_source/supply_type',
        enum: [
          'exchange',
          'data',
        ],
      },
      use_pool: {
        id: '/supply_source/use_pool',
        type: 'boolean',
      },
      created_on: {
        id: '/supply_source/created_on',
        type: 'string',
        format: 'datetimezone',
        readonly: true,
      },
      updated_on: {
        id: '/supply_source/updated_on',
        type: 'string',
        format: 'datetimezone',
        readonly: true,
      },
    },
    required: [
      'code',
      'name',
    ],
  },
  allOf: [
    common.entity,
    {
      $ref: '#/supply_source',
    },
  ],
};
