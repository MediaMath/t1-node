'use strict';

var SchemaProcessing = require('./schemaprocessing');
var Targeting = require('./common/targeting');


var StrategyTargetValues = function (id) {
  Targeting.call(this, 
    'target_values?full=*',
    'target_values',
    id);
  this.dimensions = [];

};

StrategyTargetValues.prototype = Object.create(Targeting.prototype);


// called on successful get/save
StrategyTargetValues.prototype.updateTargeting = function (data, meta) {
  this.data = data;
  this.meta = meta;
  this.dimensions = [];
  var that = this;
  data.forEach(function (dimension) {
    var dim = {};
    dim.code = dimension.target_dimension.code;
    dim.operation = dimension.target_op;
    dim.restriction = dimension.exclude ? 'EXCLUDE' : 'INCLUDE';
    dim.value_ids = dimension.target_values.map(function (t) {return t.id;});
    that.dimensions.push(dim);
  });
  return this;
};

StrategyTargetValues.prototype.addTargetValues = function (code, restriction,
  operator, values) {
  let dimension = {
    code,
    restriction,
    operation: operator,
    value_ids: values
  };

  this.dimensions.push(dimension);
};

StrategyTargetValues.prototype._generateForm = function () {
  var that = this;
  return SchemaProcessing.getSchema('strategy_target_values_form')
    .then(function (schema) {
      var verification = SchemaProcessing.validateJson(that, schema);
      if (verification.length !== 0) {
        throw new Error(verification);
      }
      else {
        var form = {};

        that.dimensions.forEach(function (dimension, target_index) {
          target_index++;
          form['dimensions.' + target_index + '.code'] = dimension.code;
          form['dimensions.' + target_index + '.operation'] = dimension.operation;
          form['dimensions.' + target_index + '.restriction'] = dimension.restriction;
          form['dimensions.' + target_index + '.value_ids'] = dimension.value_ids.join(',');
        });
        return form;
      }
    });
};


module.exports = StrategyTargetValues;
