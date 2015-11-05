var Q = require('q');
var expect = require('./chai_config').expect;
var sinon = require('sinon');


var t1 = require('../index');
userParams = {'endpoint': 'campaigns', 'count': 10};
t1conf = {
    'user': process.env.T1_API_USERNAME,
    'password': process.env.T1_API_PASSWORD,
    'api_key': process.env.T1_API_KEY
};

describe("entityList", function () {
    describe("#get with count", function () {
        var userParams = {'page_limit': 10};

        var service = new t1.EntityList(t1conf);

        var campaigns = service.get('campaigns', userParams);

        it("should have 10 entities", function () {
            return expect(campaigns).to.eventually
                    .have.property('entities')
                    .and.have.length(userParams.page_limit) &&
                expect(campaigns).to.eventually
                    .have.property('entityCount', userParams.page_limit) &&
                expect(campaigns).to.eventually.have.property('next_page')
        });

    });
    describe("#get first page", function () {
        var userParams = {};
        const expectedEntityCount = 100;

        var service = new t1.EntityList(t1conf);

        var campaigns = service.get('campaigns', userParams);

        it("should have 100 entities", function () {
            return expect(campaigns).to.eventually
                    .have.property('entities')
                    .and.have.length(expectedEntityCount) &&
                expect(campaigns).to.eventually
                    .have.property('entityCount', expectedEntityCount) &&
                expect(campaigns).to.eventually.have.property('next_page')
        });

    });
});


