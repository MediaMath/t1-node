"use strict";

// base prototype for targeting
var Targeting = function (targetingQueryString, targetingPostString, id) {

    this.targetingQueryString = targetingQueryString;
    this.targetingPostString = targetingPostString;
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

    console.warn('updateTargeting should be implemented by a derived class');
    return this;
};


Targeting.prototype.save = function (connection) {
    var that = this;
    return that._generateForm()
        .then(function (form) {
            var endpoint = "strategies/" +
                that.strategy_id + "/" + 
                that.targetingPostString;

            return connection.post(endpoint, form).then(function (body) {
                var content = JSON.parse(body);
                return that.updateTargeting(content.data, content.meta);
            });
        });
};

Targeting.prototype._generateForm = function () {
    console.error('_generateForm is not implemented!');
};


module.exports = Targeting;
