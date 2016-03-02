"use strict";

var SchemaProcessing = require('./schemaprocessing');

var StrategyTargetSegments = function (connection, id) {

    this.include = [];
    this.exclude = [];
    this.include_op = '';
    this.exclude_op = '';
    this.strategy_id = id;

    if (connection != null) {
        this.get(id, connection)
    }
};

StrategyTargetSegments.prototype.get = function (strategy_id, connection) {
    if (connection != null) {
        var that = this;
        var endpoint = "strategies/" + strategy_id + "/targeting_segments?full=*";
        return connection.get(endpoint)
            .then(function (body) {
                that.strategy_id = strategy_id;
                var content = JSON.parse(body);
                return that.updateTargeting(content.data, content.meta);
            });
    }
};


// called on successful get/save
StrategyTargetSegments.prototype.updateTargeting = function (data, meta) {
    this.data = data;
    this.meta = meta;
    this.include = [];
    this.exclude = [];
    var that = this;
    for (var target in data)
        if (data.hasOwnProperty(target)) {
            that[data[target]['restriction'].toLowerCase()]
                .push([data[target]['targeting_segment_id'], data[target]['operator']])
        }
    return this;
};

StrategyTargetSegments.prototype.getCpmEstimate = function (connection) {
    var that = this;
    var form = that._generateForm();
    var endpoint = "strategies/" + that.strategy_id + "/targeting_segments/cpm";

    return connection.post(endpoint, form).then(function (body) {
        that.price_estimate = JSON.parse(body).data;
    });

};

StrategyTargetSegments.prototype.save = function (connection) {
    var that = this;
    var form = this._generateForm();
    var endpoint = "strategies/" + that.strategy_id + "/targeting_segments?full=*";

    return connection.post(endpoint, form).then(function (body) {
        var content = JSON.parse(body);
        return that.update_targeting(content.data, content.meta);
    });
};

StrategyTargetSegments.prototype._generateForm = function () {
    var that = this;
    return SchemaProcessing.getSchema('strategy_targeting_segment_form')
        .then(function (schema) {
            var verification = SchemaProcessing.validateJson(that, schema);
            if (verification.length != 0) {
                throw new Error(verification);
            }
            else {
                var form = {
                    include_op: that.include_op,
                    exclude_op: that.exclude_op
                };

                var target_index = 1;
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
