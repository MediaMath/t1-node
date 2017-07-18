const common = require('./common');

module.exports = {
  ad_server: {
    id: '/ad_server',
    type: 'object',
    properties: {},
    required: [],
  },
  allOf: [
    common.entity,
    {
      $ref: '#/ad_server',
    },
  ],
};
