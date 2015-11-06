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

var loadFixture = function(fixtureName) {
    var fs = require("fs");
    return fs.readFileSync(__dirname + '/fixtures' + '/' + fixtureName + ".json", "utf8");
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


describe("entity", function () {

    var connectionStub =  {};
    connectionStub.get = function() { };
    connectionStub.post = function() { };
    var sandbox, getStub, postStub;
    var parsedResult = "aisdaiusd";

    beforeEach(function() {
        console.log('BEFORE');

        getStub = sinon.stub(connectionStub, "get").returns(Q(parsedResult));
        postStub = sinon.stub(connectionStub, "post").returns(Q(parsedResult));
    });

    afterEach(function() {
        console.log('AFTER');
    });

    describe("#get single campaign", function () {
        //getStub = sinon.stub(connectionStub, "get").returns(Q(parsedResult));

        parsedResult = loadFixture('campaign');
        var campaign = new t1.Entity('campaign');
        console.log(connectionStub.get('lol'))
        campaign = campaign.get(220335, connectionStub);
        var refdata = require('./refdata/campaign').data;

        it("should have a populated campaign entity", function () {
            return expect(campaign).to.eventually
                .have.property('data')
                .and.be.eql(refdata)
                .done()
        });

    });
});





