var expect = require('./chai_config').expect;
var t1 = require('../index');
require('dotenv').load();

describe('Get Reports', function() {
    this.timeout(10000);
    t1conf = {
        // To run these test, set the dotenv variables by copying .env.template and filling in the parameters.
        user: process.env.T1_API_USERNAME,
        password: process.env.T1_API_PASSWORD,
        api_key: process.env.T1_API_KEY,
        client_secret: process.env.T1_SECRET,
        apiBaseUrl: process.env.T1_BASEURL,
        redirect_uri: process.env.T1_REDIRECTURL,
        advertiser_id: parseInt(process.env.T1_ADVERTISER)
        // Tests will return 403 if user does not have access to advertiser
    };
    var conn = new t1.T1Connection(t1conf);


    it('should retrieve reports endpoint metadata', function() {
        var Report = new t1.Report('meta');
        var reportPromise = Report.getMeta(conn)
        return expect(reportPromise).to.eventually.have.property('reports')
    });
    it('should retrieve performance report metadata', function() {
        var Report = new t1.Report('performance');
        var reportPromise = Report.getMeta(conn)
        return expect(reportPromise).to.eventually.have.property('Name', 'Performance Report in Campaign Currency')
    });
    it('should retrieve performance report', function() {
        var Report = new t1.Report('performance');
        var reportPromise = Report.get(conn, {
            time_window: 'yesterday',
            time_rollup: 'by_day',
            dimensions: 'advertiser_id',
            filter: 'advertiser_id=' + t1conf.advertiser_id
        })
        return expect(reportPromise).to.eventually.have.property('errors').to.be.empty
        expect(reportPromise).to.eventually.have.deep.property('data.start_date');
    });
});
