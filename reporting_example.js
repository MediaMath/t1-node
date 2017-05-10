var t1 = require('./index');
require('dotenv').load();

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

var performanceReport = new t1.Report('performance');
performanceReport.get(conn, {
    time_window: 'yesterday',
    time_rollup: 'by_day',
    dimensions: 'advertiser_id',
    filter: 'organization_id=100048'
}).then(
    function(report) {
        console.log(report)
    },
    function(error) {
        console.log(error.message)
    });

performanceReport.getMeta(conn).then(
    function(report) {
        console.log(report)
    },
    function(error) {
        console.log(error.message)
    });

var metaReport = new t1.Report('meta');
metaReport.getMeta(conn).then(
    function(report) {
        console.log(report)
    },
    function(error) {
        console.log(error.message)
    });
