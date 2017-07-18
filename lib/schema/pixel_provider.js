const common = require('./common');

module.exports = {
  pixel_provider: {
    id: '/pixel_provider',
    type: 'object',
    properties: {
      agency_id: {
        id: '/pixel_provider/agency_id',
        type: 'integer',
      },
      execution_by: {
        id: '/pixel_provider/execution_by',
        enum: [
          'MEDIAMATH',
          'UDI',
        ],
        default: 'UDI',
      },
      status: {
        id: '/pixel_provider/status',
        type: 'boolean',
      },
      taxonomy_file: {
        id: '/pixel_provider/taxonomy_file',
        type: 'string',
      },
      vendor_id: {
        id: '/pixel_provider/vendor_id',
        type: 'integer',
      },
      created_on: {
        id: '/pixel_provider/created_on',
        type: 'string',
        format: 'datetimezone',
        readonly: true,
      },
      updated_on: {
        id: '/pixel_provider/updated_on',
        type: 'string',
        format: 'datetimezone',
        readonly: true,
      },
    },
    required: [
      'name',
      'vendor_id',
    ],
  },
  allOf: [
    common.entity,
    {
      $ref: '#/pixel_provider',
    },
  ],
};
