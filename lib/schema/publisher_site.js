const common = require('./common');

module.exports = {
  publisher_site: {
    id: '/publisher_site',
    type: 'object',
    properties: {
      publisher_id: {
        id: '/publisher_site/publisher_id',
        type: 'integer',
      },
      created_on: {
        id: '/publisher_site/created_on',
        type: 'string',
        format: 'datetimezone',
        readonly: true,
      },
      updated_on: {
        id: '/publisher_site/updated_on',
        type: 'string',
        format: 'datetimezone',
        readonly: true,
      },
    },
    required: [
      'name',
      'publisher_id',
    ],
  },
  allOf: [
    common.entity,
    {
      $ref: '#/publisher_site',
    },
  ],
};
