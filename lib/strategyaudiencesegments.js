'use strict';

let EntityMap = require('./entitymap');
let SchemaProcessing = require('./schemaprocessing');
let Targeting = require('./common/targeting');

let StrategyAudienceSegments = function (connection, id) {
  Targeting.call(this, 
    '?with=strategy_audience_segments&full=strategy_audience_segments',
    'audience_segments',
    id);
  this.include = [];
  this.exclude = [];
  this.include_op = '';
  this.exclude_op = '';

  if (connection) {
    this.get(id, connection);
  }
};

StrategyAudienceSegments.prototype = Object.create(Targeting.prototype);

// called on successful get/save
StrategyAudienceSegments.prototype.updateTargeting = function (data, meta) {
  this.data = data;
  this.meta = meta;
  this.include = [];
  this.exclude = [];
  let that = this;

  if (data.hasOwnProperty('audience_segment_include_op')) {
    that.include_op = data.audience_segment_include_op;
  }
  if (data.hasOwnProperty('audience_segment_exclude_op')) {
    that.exclude_op = data.audience_segment_exclude_op;
  }

  if (data.hasOwnProperty('strategy_audience_segments')) {
    Array.from(data.strategy_audience_segments).forEach(function (target) {
      that[target.restriction.toLowerCase()]
        .push(target.audience_segment_id);
    });
  }

  return this;
};

StrategyAudienceSegments.prototype.getCpmEstimate = function (connection) {
  let that = this;

  return that._generateForm()
    .then(function (form) {
      let endpoint = EntityMap.getEndpoint('strategy') + '/' + 
                that.strategy_id + '/audience_segments/cpm';

      return connection.postFormdata(endpoint, form).then(function (body) {
        that.price_estimate = JSON.parse(body).data.prop[0];
        return that;
      });
    });
};

StrategyAudienceSegments.prototype._generateForm = function () {
  let that = this;
  return SchemaProcessing.getSchema('strategy_audience_segment_form')
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
        that.include.forEach(function (segment_id) {
          form['segments.' + target_index + '.id'] = segment_id;
          form['segments.' + target_index + '.restriction'] = 'INCLUDE';
          target_index++;
        });

        that.exclude.forEach(function (segment_id) {
          form['segments.' + target_index + '.id'] = segment_id;
          form['segments.' + target_index + '.restriction'] = 'EXCLUDE';
          target_index++;
        });

        return form;
      }
    });
};


module.exports = StrategyAudienceSegments;
