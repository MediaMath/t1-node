const common = require('./common');

module.exports = {
  agency: {
    id: '/agency',
    type: 'object',
    properties: {
      organization_id: {
        id: '/agency/data/organization_id',
        type: 'integer',
      },
      status: {
        id: '/agency/data/status',
        type: 'boolean',
      },
      allow_x_adv_pixels: {
        id: '/agency/data/allow_x_adv_pixels',
        type: 'boolean',
      },
      allow_x_adv_optimization: {
        id: '/agency/data/allow_x_adv_optimization',
        type: 'boolean',
      },
      updated_on: {
        id: '/agency/data/updated_on',
        type: 'string',
        format: 'datetimezone',
        readonly: true,
      },
      created_on: {
        id: '/agency/data/created_on',
        type: 'string',
        format: 'datetimezone',
        readonly: true,
      },
    },
    required: [
      'organization_id',
    ],
  },

  allOf: [
    common.entity,
    {
      $ref: '#/agency',
    },
  ],
};
