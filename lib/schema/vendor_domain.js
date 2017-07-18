const common = require('./common');

module.exports = {
  vendor_domain: {
    id: '/vendor_domain',
    type: 'object',
    properties: {
      allow_subdomain_match: {
        id: '/vendor_domain/allow_subdomain_match',
        type: 'boolean',
      },
      domain: {
        id: '/vendor_domain/domain',
        type: 'string',
      },
      vendor_id: {
        id: '/vendor_domain/vendor_id',
        type: 'integer',
      },
      created_on: {
        id: '/vendor_domain/created_on',
        type: 'string',
        format: 'datetimezone',
        readonly: true,
      },
      updated_on: {
        id: '/vendor_domain/updated_on',
        type: 'string',
        format: 'datetimezone',
        readonly: true,
      },
    },
    required: [
      'domain',
      'vendor_id',
    ],
  },
  allOf: [
    common.entity,
    {
      $ref: '#/vendor_domain',
    },
  ],
};
