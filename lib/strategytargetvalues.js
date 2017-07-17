const SchemaProcessing = require('./schemaprocessing');
const Targeting = require('./common/targeting');


const StrategyTargetValues = function StrategyTargetValues(id) {
  Targeting.call(this,
    'target_values?full=*',
    'target_values',
    id);
  this.dimensions = [];
};

StrategyTargetValues.prototype = Object.create(Targeting.prototype);


// called on successful get/save
StrategyTargetValues.prototype.updateTargeting = function updateTargeting(data, meta) {
  this.data = data;
  this.meta = meta;
  this.dimensions = [];
  const that = this;
  data.forEach((dimension) => {
    const dim = {};
    dim.code = dimension.target_dimension.code;
    dim.operation = dimension.target_op;
    dim.restriction = dimension.exclude ? 'EXCLUDE' : 'INCLUDE';
    dim.value_ids = dimension.target_values.map(t => t.id);
    that.dimensions.push(dim);
  });
  return this;
};

StrategyTargetValues.prototype.addTargetValues = function addTargetValues(code, restriction,
  operator, values) {
  const dimension = {
    code,
    restriction,
    operation: operator,
    value_ids: values,
  };

  this.dimensions.push(dimension);
};

StrategyTargetValues.prototype.generateForm = function generateForm() {
  const that = this;
  return SchemaProcessing.getSchema('strategy_target_values_form')
    .then((schema) => {
      const verification = SchemaProcessing.validateJson(that, schema);
      if (verification.length !== 0) {
        throw new Error(verification);
      } else {
        const form = {};

        that.dimensions.forEach((dimension, target_index) => {
          target_index += 1;
          form[`dimensions.${target_index}.code`] = dimension.code;
          form[`dimensions.${target_index}.operation`] = dimension.operation;
          form[`dimensions.${target_index}.restriction`] = dimension.restriction;
          form[`dimensions.${target_index}.value_ids`] = dimension.value_ids.join(',');
        });
        return form;
      }
    });
};


module.exports = StrategyTargetValues;
