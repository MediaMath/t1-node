'use strict';
let expect = require('./chai_config').expect;
let t1 = require('../index');
require('dotenv').load();

describe('Get Reports', function () {
  this.timeout(10000);
  let t1conf = {
    // To run these test, set the dotenv variables by copying .env.template and filling in the parameters.
    user: process.env.T1_API_USERNAME,
    password: process.env.T1_API_PASSWORD,
    api_key: process.env.T1_API_KEY,
  };
  let conn = new t1.T1Connection(t1conf);


  it('should retrieve reports endpoint metadata', function () {
    let Report = new t1.Report('meta');
    let reportPromise = Report.getMeta(conn);
    return expect(reportPromise).to.eventually.have.property('reports');
  });
  it('should retrieve performance report metadata', function () {
    let Report = new t1.Report('performance');
    let reportPromise = Report.getMeta(conn);
    return expect(reportPromise).to.eventually.have.property('Name', 'Performance Report in Campaign Currency');
  });
  it('should retrieve performance report', function () {
    let Report = new t1.Report('performance');
    let reportPromise = Report.get(conn, {
      time_window: 'yesterday',
      time_rollup: 'by_day',
      dimensions: 'advertiser_id',
      filter: 'advertiser_id=' + parseInt(process.env.T1_ADVERTISER),
    });
    return expect(reportPromise).to.eventually.have.property('errors').to.be.empty;
  });
});
