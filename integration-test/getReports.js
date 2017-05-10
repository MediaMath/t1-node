var expect = require('./chai_config').expect;
var t1 = require('../index');
require('dotenv').load();

describe('Get, create and save Entities', function() {

    t1conf = {
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

    describe('# Reports', function() {

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
            return expect(reportPromise).to.eventually.have.property('errors').to.be.empty // Technically this are CSV parse errors.
            expect(reportPromise).to.eventually.have.deep.property('data.start_date');
        });
    });
});
