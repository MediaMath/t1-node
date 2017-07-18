const EntityMap = require('./entitymap');
const SchemaProcessing = require('./schemaprocessing');
const Targeting = require('./common/targeting');

const StrategyTargetSegments = function StrategyTargetSegments(id) {
  Targeting.call(this,
    '?with=strategy_targeting_segments&full=strategy_targeting_segment',
    'targeting_segments',
    id);
  this.include = [];
  this.exclude = [];
  this.include_op = '';
  this.exclude_op = '';
};

StrategyTargetSegments.prototype = Object.create(Targeting.prototype);

// called on successful get/save
StrategyTargetSegments.prototype.updateTargeting = function updateTargeting(data, meta) {
  this.data = data;
  this.meta = meta;
  this.include = [];
  this.exclude = [];
  const that = this;

  if (Object.prototype.hasOwnProperty.call(data, 'targeting_segment_include_op')) {
    that.include_op = data.targeting_segment_include_op;
  }
  if (Object.prototype.hasOwnProperty.call(data, 'targeting_segment_exclude_op')) {
    that.exclude_op = data.targeting_segment_include_op;
  }

  if (Object.prototype.hasOwnProperty.call(data, 'strategy_targeting_segments')) {
    Array.from(data.strategy_targeting_segments).forEach((target) => {
      that[target.restriction.toLowerCase()]
        .push([target.targeting_segment_id, target.operator]);
    });
  }

  return this;
};

StrategyTargetSegments.prototype.getCpmEstimate = function getCpmEstimate(connection) {
  const that = this;

  return that.generateForm()
    .then((form) => {
      const endpoint = `${EntityMap.getEndpoint('strategy')}/${that.strategy_id}/targeting_segments/cpm`;

      return connection.postFormdata(endpoint, form).then((body) => {
        that.price_estimate = JSON.parse(body).data.prop[0];
        return that;
      });
    });
};

StrategyTargetSegments.prototype.generateForm = function generateForm() {
  const that = this;
  return SchemaProcessing.getSchema('strategy_targeting_segment_form')
    .then((schema) => {
      const verification = SchemaProcessing.validateJson(that, schema);
      if (verification.length !== 0) {
        throw new Error(verification);
      } else {
        const form = {
          include_op: that.include_op,
          exclude_op: that.exclude_op,
        };

        let target_index = 1;
        that.include.forEach((tuple) => {
          form[`segments.${target_index}.id`] = tuple[0];
          form[`segments.${target_index}.operator`] = tuple[1];
          form[`segments.${target_index}.restriction`] = 'INCLUDE';
          target_index += 1;
        });

        that.exclude.forEach((tuple) => {
          form[`segments.${target_index}.id`] = tuple[0];
          form[`segments.${target_index}.operator`] = tuple[1];
          form[`segments.${target_index}.restriction`] = 'EXCLUDE';
          target_index += 1;
        });

        return form;
      }
    });
};


module.exports = StrategyTargetSegments;
