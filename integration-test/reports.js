const expect = require('./chai_config').expect;
const t1 = require('../index');
require('dotenv').load();

describe('Get Reports', function getReports() {
  const t1conf = {
    user: process.env.T1_API_USERNAME,
    password: process.env.T1_API_PASSWORD,
    api_key: process.env.T1_API_KEY,
    baseUrl: process.env.T1_BASEURL,
  };
  this.timeout(10000);
  const conn = new t1.T1Connection(t1conf);


  it('should retrieve reports endpoint metadata', () => {
    const Report = new t1.Report('meta');
    const reportPromise = Report.getMeta(conn);
    return expect(reportPromise).to.eventually.have.property('reports');
  });
  it('should retrieve performance report metadata', () => {
    const Report = new t1.Report('performance');
    const reportPromise = Report.getMeta(conn);
    return expect(reportPromise).to.eventually.have.property('Name', 'Performance Report in Campaign Currency');
  });
  it('should retrieve performance report', () => {
    const Report = new t1.Report('performance');
    const reportPromise = Report.get(conn, {
      time_window: 'yesterday',
      time_rollup: 'by_day',
      dimensions: 'advertiser_id',
      filter: `advertiser_id=${parseInt(process.env.T1_ADVERTISER, 10)}`,
    });
    return expect(reportPromise).to.eventually.have.property('errors').to.be.empty;
  });
});
