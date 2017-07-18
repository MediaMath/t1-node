const common = require('./common');

module.exports = {
  vendor: {
    id: '/vendor',
    type: 'object',
    properties: {
      adx_approved: {
        id: '/vendor/adx_approved',
        type: 'boolean',
      },
      adx_declaration_required: {
        id: '/vendor/adx_declaration_required',
        type: 'boolean',
      },
      adx_ssl_approved: {
        id: '/vendor/adx_ssl_approved',
        type: 'boolean',
      },
      adx_vendor_identifier: {
        id: '/vendor/adx_vendor_identifier',
        type: 'string',
      },
      adx_video_approved: {
        id: '/vendor/adx_video_approved',
        type: 'boolean',
      },
      adx_video_ssl_approved: {
        id: '/vendor/adx_video_ssl_approved',
        type: 'boolean',
      },
      description: {
        id: '/vendor/description',
        type: 'string',
      },
      is_eligible: {
        id: '/vendor/is_eligible',
        type: 'boolean',
      },
      mm_contract_available: {
        id: '/vendor/mm_contract_available',
        type: 'boolean',
      },
      rate_card_price: {
        id: '/vendor/rate_card_price',
        type: 'number',
      },
      rate_card_type: {
        id: '/vendor/rate_card_type',
        type: 'string',
      },
      vendor_type: {
        id: '/vendor/vendor_type',
        type: {
          enum: [
            'AD_SERVER',
            'AD_VERIFICATION',
            'CONTEXTUAL',
            'DATA',
            'DSP',
            'DYNAMIC_CREATIVE',
            'NETWORK',
            'OBA_COMPLIANCE',
            'OTHER',
            'PIXEL_TRACKING',
            'RICH_MEDIA',
            'SURVEY',
          ],
        },
        default: 'OTHER',
      },
      wholesale_price: {
        id: '/vendor/wholesale_price',
        type: 'number',
      },
      created_on: {
        id: '/vendor/created_on',
        type: 'string',
        format: 'datetimezone',
        readonly: true,
      },
      updated_on: {
        id: '/vendor/updated_on',
        type: 'string',
        format: 'datetimezone',
        readonly: true,
      },
    },
    required: [
      'name',
    ],
  },
  allOf: [
    common.entity,
    {
      $ref: '#/vendor',
    },
  ],
};
