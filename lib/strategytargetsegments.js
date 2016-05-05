"use strict";

var SchemaProcessing = require('./schemaprocessing');

var StrategyTargetSegments = function (connection, id) {

    this.include = [];
    this.exclude = [];
    this.include_op = '';
    this.exclude_op = '';
    this.strategy_id = id;

    if (connection) {
        this.get(id, connection);
    }
};

StrategyTargetSegments.prototype.get = function (strategy_id, connection) {
    if (connection) {
        var that = this;
        var endpoint = "strategies/" + strategy_id + "?with=strategy_targeting_segments&full=strategy_targeting_segment";
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
    var that = this;

    return that._generateForm()
        .then(function (form) {
            var endpoint = "strategies/" + that.strategy_id + "/targeting_segments/cpm";

            that.price_estimate = connection.post(endpoint, form).then(function (body) {
                that.price_estimate = JSON.parse(body).data.prop;
            });
            return that.price_estimate;
        });
};

StrategyTargetSegments.prototype.save = function (connection) {
    var that = this;
    return that._generateForm()
        .then(function (form) {
            var endpoint = "strategies/" + that.strategy_id + "/targeting_segments?full=*";

            return connection.post(endpoint, form).then(function (body) {
                var content = JSON.parse(body);
                return that.updateTargeting(content.data, content.meta);
            });
        });
};

StrategyTargetSegments.prototype._generateForm = function () {
    var that = this;
    return SchemaProcessing.getSchema('strategy_targeting_segment_form')
        .then(function (schema) {
            var verification = SchemaProcessing.validateJson(that, schema);
            if (verification.length !== 0) {
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
