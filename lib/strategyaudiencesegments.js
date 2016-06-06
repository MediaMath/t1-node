"use strict";

var SchemaProcessing = require('./schemaprocessing');
var Targeting = require('./targeting');

var StrategyAudienceSegments = function (connection, id) {
    Targeting.call(this, 
        "?with=strategy_audience_segments&full=strategy_audience_segments",
        "audience_segments",
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
    var that = this;

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
    var that = this;

    return that._generateForm()
        .then(function (form) {
            var endpoint = "strategies/" + that.strategy_id + "/audience_segments/cpm";

            return connection.post(endpoint, form).then(function (body) {
                that.price_estimate = JSON.parse(body).data.prop[0];
                return that;
            });
        });
};

StrategyAudienceSegments.prototype._generateForm = function () {
    var that = this;
    return SchemaProcessing.getSchema('strategy_audience_segment_form')
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
