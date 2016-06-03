"use strict";

var SchemaProcessing = require('./schemaprocessing');

var StrategyTargetValues = function (connection, id) {

    this.dimensions = [];

    if (connection) {
        this.get(id, connection);
    }
};

StrategyTargetValues.prototype.get = function (strategy_id, connection) {
    if (connection) {
        var that = this;
        var endpoint = "strategies/" + strategy_id + "/target_values?full=*";
        return connection.get(endpoint)
            .then(function (body) {
                that.strategy_id = strategy_id;
                var content = JSON.parse(body);
                return that.updateTargeting(content.data, content.meta);
            });
    }
};


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
        dim.restriction = dimension.exclude ? "EXCLUDE" : "INCLUDE";
        dim.value_ids = dimension.target_values.map(function (t) {return t.id;});
        that.dimensions.push(dim);
    });
    return this;
};

StrategyTargetValues.prototype.save = function (connection) {
    var that = this;
    var form = this._generateForm();
    var endpoint = "strategies/" + that.strategy_id + "/target_values";

    return connection.post(endpoint, form).then(function (body) {
        var content = JSON.parse(body);
        return that.updateTargeting(content.data, content.meta);
    });
};

StrategyTargetValues.prototype.addTargetValues = function (code, restriction,
                                                           operator, values) {
    var dimension = {
        code: code,
        restriction: restriction,
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
