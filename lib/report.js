const csv = require('babyparse');

const Report = function Report(type, connection) {
  this.report_type = type;

  if (connection) {
    this.get(connection);
  }
};

Report.prototype.get = function get(connection, userParams) {
  if (!connection) {
    throw new Error('connection object must be provided');
  }
  // This prototype does no evaluation of required fields.

  const queryString = connection.buildQueryString(`/reporting/v1/std/${this.report_type}`, userParams);
  return connection.get(queryString)
    .then(body => csv.parse(body.slice(0, -2),
      { header: true })); // Remove last \n to evenly parse the CSV.
};

Report.prototype.getMeta = function getMeta(connection) {
  if (!connection) {
    throw new Error('connection object must be provided');
  }
  if (this.report_type !== 'meta') {
    this.report_type = `${this.report_type}/meta`;
  }
  const queryString = connection.buildQueryString(`/reporting/v1/std/${this.report_type}`);
  return connection.get(queryString)
    .then(body => JSON.parse(body));
};

module.exports = Report;
