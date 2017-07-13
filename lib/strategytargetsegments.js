'use strict';

let EntityMap = require('./entitymap');
let SchemaProcessing = require('./schemaprocessing');
let Targeting = require('./common/targeting');

let StrategyTargetSegments = function (id) {
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
StrategyTargetSegments.prototype.updateTargeting = function (data, meta) {
  this.data = data;
  this.meta = meta;
  this.include = [];
  this.exclude = [];
  let that = this;

  if (data.hasOwnProperty('targeting_segment_include_op')) {
    that.include_op = data.targeting_segment_include_op;
  }
  if (data.hasOwnProperty('targeting_segment_exclude_op')) {
    that.exclude_op = data.targeting_segment_include_op;
  }

  if (data.hasOwnProperty('strategy_targeting_segments')) {
    Array.from(data.strategy_targeting_segments).forEach(function (target) {
      that[target.restriction.toLowerCase()]
        .push([target.targeting_segment_id, target.operator]);
    });
  }

  return this;
};

StrategyTargetSegments.prototype.getCpmEstimate = function (connection) {
  let that = this;

  return that._generateForm()
    .then(function (form) {
      let endpoint = EntityMap.getEndpoint('strategy') + '/' + 
                that.strategy_id + '/targeting_segments/cpm';

      return connection.postFormdata(endpoint, form).then(function (body) {
        that.price_estimate = JSON.parse(body).data.prop[0];
        return that;
      });
    });
};

StrategyTargetSegments.prototype._generateForm = function () {
  let that = this;
  return SchemaProcessing.getSchema('strategy_targeting_segment_form')
    .then(function (schema) {
      let verification = SchemaProcessing.validateJson(that, schema);
      if (verification.length !== 0) {
        throw new Error(verification);
      }
      else {
        let form = {
          include_op: that.include_op,
          exclude_op: that.exclude_op
        };

        let target_index = 1;
        that.include.forEach(function (tuple) {
          form['segments.' + target_index + '.id'] = tuple[0];
          form['segments.' + target_index + '.operator'] = tuple[1];
          form['segments.' + target_index + '.restriction'] = 'INCLUDE';
          target_index++;
        });


        that.exclude.forEach(function (tuple) {
          form['segments.' + target_index + '.id'] = tuple[0];
          form['segments.' + target_index + '.operator'] = tuple[1];
          form['segments.' + target_index + '.restriction'] = 'EXCLUDE';
          target_index++;
        });

        return form;
      }
    });
};


module.exports = StrategyTargetSegments;
