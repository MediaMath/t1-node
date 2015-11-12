var Promise = require('bluebird');
var expect = require('./chai_config').expect;
var sinon = require('sinon');

var t1 = require('../index');


var loadFixture = function (fixtureName) {
    var fs = require("fs");
    return fs.readFileSync(__dirname + '/fixtures' + '/' + fixtureName + ".json", "utf8");
};

describe("entityList", function () {

    var connectionStub = {};
    connectionStub.get = function () {
    };
    connectionStub.post = function () {
    };
    var sandbox, getStub, postStub;
    var parsedResult = "aisdaiusd";

    var service = t1.EntityList.prototype;
    service.t1connection = connectionStub;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();

        postStub = sandbox.stub(connectionStub, "post")
            .returns(Promise.try(function() {return parsedResult}));
    });

    afterEach(function () {
        sandbox.restore();
    });

    describe("#get with count", function () {
        var userParams = {'page_limit': 10};

        it("should have 10 entities", function () {
            parsedResult = loadFixture('campaigns-10');

            getStub = sandbox.stub(connectionStub, "get")
                .returns(Promise.try(function() {return parsedResult}));
            var campaigns = service.get('campaigns', userParams);

            return expect(campaigns).to.eventually
                .have.property('entities') &&

            expect(campaigns).to.eventually
                .have.property('meta')
                .and.have.property('count', userParams.page_limit);


        });
    });

    describe("#get first page", function () {
        const expectedEntityCount = 100;
        var userParams = {};


        it("should have 100 entities", function () {
            parsedResult = loadFixture('campaigns-100');

            getStub = sandbox.stub(connectionStub, "get")
                .returns(Promise.try(function() {return parsedResult}));
            var campaigns = service.get('campaigns', userParams);

            return expect(campaigns).to.eventually
                .have.property('entities') &&
            expect(campaigns).to.eventually
                .have.property('meta').and.have.property('next_page');
        });

    });
});

