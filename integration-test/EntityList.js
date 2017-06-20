var expect = require('./chai_config').expect;
var t1 = require('../index');
require('dotenv').load();

describe("Request an entity list and page through it", function () {

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


    describe("#request a list of ten campaigns", function () {
        var userParams = {
            'page_limit':10
        };


        it("should retrive 10 campaigns", function () {
            let listPromise = t1.EntityList.get('campaigns', conn,  userParams);

            return expect(listPromise).to.eventually
                .have.property('meta')
                .that.has.property('count', 10);
        });

    });

});
