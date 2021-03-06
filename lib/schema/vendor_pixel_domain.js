const common = require('./common');

module.exports = {
  vendor_pixel_domain: {
    id: '/vendor_pixel_domain',
    type: 'object',
    properties: {
      domain: {
        id: '/vendor_pixel_domain/domain',
        type: 'string',
      },
      vendor_domain_id: {
        id: '/vendor_pixel_domain/vendor_domain_id',
        type: 'integer',
      },
      vendor_pixel_id: {
        id: '/vendor_pixel_domain/vendor_pixel_id',
        type: 'integer',
      },
      created_on: {
        id: '/vendor_pixel_domain/created_on',
        type: 'string',
        format: 'datetimezone',
        readonly: true,
      },
      updated_on: {
        id: '/vendor_pixel_domain/updated_on',
        type: 'string',
        format: 'datetimezone',
        readonly: true,
      },
    },
    required: [],
  },
  allOf: [
    common.entity,
    {
      $ref: '#/vendor_pixel_domain',
    },
  ],
};
