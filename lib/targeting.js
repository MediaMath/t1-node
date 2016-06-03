"use strict";

// base prototype for targeting
var Targeting = function (targetingString, id) {

    this.targetingQueryString = targetingString;
    this.strategy_id = id;

};

Targeting.prototype.get = function (strategy_id, connection) {
    if (connection) {
        var that = this;
        var endpoint = "strategies/" + strategy_id + "/" + that.targetingQueryString;
        return connection.get(endpoint)
            .then(function (body) {
                that.strategy_id = strategy_id;
                var content = JSON.parse(body);
                return that.updateTargeting(content.data, content.meta);
            });
    }
};


// called on successful get/save
Targeting.prototype.updateTargeting = function (data, meta) {
    this.data = data;
    this.meta = meta;

    return this;
};


Targeting.prototype.save = function (connection) {
    var that = this;
    return that._generateForm()
        .then(function (form) {
            var endpoint = "strategies/" +
                that.strategy_id + "/" + 
                that.targetingQueryString;

            return connection.post(endpoint, form).then(function (body) {
                var content = JSON.parse(body);
                return that.updateTargeting(content.data, content.meta);
            });
        });
};

Targeting.prototype._generateForm = function () {
    return {};
};


module.exports = Targeting;
