const common = require('./common');

module.exports = {
  target_value: {
    id: '/target_value',
    type: 'object',
    properties: {
      dimension_code: {
        id: '/target_value/dimension_code',
        type: 'string',
      },
      child_count: {
        id: '/target_value/child_count',
        type: 'integer',
      },
      is_targetable: {
        id: '/target_value/is_targetable',
        type: 'boolean',
      },
      target_dimension_id: {
        id: '/target_value/target_dimension_id',
        type: 'integer',
      },
      value: {
        id: '/target_value/value',
        type: 'integer',
      },
      type: {
        id: '/target_value/type',
        type: 'string',
      },
    },
    required: [],
  },
  allOf: [
    common.entity,
    {
      $ref: '#/target_value',
    },
  ],
};
