"use strict";
let expect = require('./chai_config').expect;
let t1 = require('../index');
require('dotenv').load();

describe("Get, and edit deals", function () {

    let t1conf = {
        user: process.env.T1_API_USERNAME,
        password: process.env.T1_API_PASSWORD,
        api_key: process.env.T1_API_KEY,
        client_secret: process.env.T1_SECRET,
        apiBaseUrl: process.env.T1_BASEURL,
        redirect_uri: process.env.T1_REDIRECTURL,
        advertiser_id: parseInt(process.env.T1_ADVERTISER)
        // Tests will return 403 if user does not have access to advertiser
    };
    let conn = new t1.T1Connection(t1conf);
    let testTimestamp = new Date().toISOString();
    let expectedName = "t1-node test deal" + testTimestamp;
    let campaignId, strategyId;

    describe("#get and update single deal", function () {
        let deal = new t1.Entity('deal');

        it("should get an existing deal", function () {
            let dealPromise = deal.get(195324, conn);
            return expect(dealPromise).to.eventually
                .have.property('id', 195324)
        });

        it("should update the name", function () {
            let expectedName = "t1-node test deal" + testTimestamp;
            deal.name = expectedName;
            let dealPromise = deal.save(conn);
            return expect(dealPromise).to.eventually
                .have.property('name', expectedName);
        });

    });

});