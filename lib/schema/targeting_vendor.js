const common = require('./common');

module.exports = {
  targeting_vendor: {
    id: '/targeting_vendor',
    type: 'object',
    properties: {
      organization_id: {
        id: '/targeting_vendor/organization_id',
        type: 'integer',
      },
      targeting_vendor_type_id: {
        id: '/targeting_vendor/targeting_vendor_type_id',
        type: 'integer',
      },
      sites_count_domain: {
        id: '/targeting_vendor/sites_count_domain',
        type: 'integer',
      },
      namespace_code: {
        id: '/targeting_vendor/namespace_code',
        type: 'string',
      },
      created_on: {
        id: '/targeting_vendor/created_on',
        type: 'string',
        format: 'datetimezone',
        readonly: true,
      },
      updated_on: {
        id: '/targeting_vendor/updated_on',
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
      $ref: '#/targeting_vendor',
    },
  ],
};
