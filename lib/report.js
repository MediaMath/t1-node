'use strict';
var csv = require('babyparse');

var Report = function(type, connection) {
    this.report_type = type;

    if (connection) {
        this.get(connection);
    }
};

Report.prototype.get = function(connection, userParams) {
    if (!connection) {
        throw new Error('connection object must be provided');
    }
    var that = this;
    // This prototype does no evaluation of required fields. 

    var queryString = connection.buildQueryString('/reporting/v1/std/' + this.report_type, userParams);
    return connection.get(queryString)
        .then(function(body) {
            var results = csv.parse(body.slice(0, -2), { header: true }); // Remove last \n to evenly parse the CSV.
            return results;
        });
};

Report.prototype.getMeta = function(connection) {
    if (!connection) {
        throw new Error('connection object must be provided');
    }
    var that = this;
    if (this.report_type != 'meta') {
        this.report_type = this.report_type + '/meta';
    }
    var queryString = connection.buildQueryString('/reporting/v1/std/' + this.report_type);
    return connection.get(queryString)
        .then(function(body) {
            var content = JSON.parse(body);
            return content;
        });
};

module.exports = Report;
