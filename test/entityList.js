var Promise = require('bluebird');
var expect = require('./chai_config').expect;
var sinon = require('sinon');
var common = require('./test-common');
var t1 = require('../index');


describe("entityList", function () {

    var connectionStub = {};
    connectionStub.get = function () {
    };
    connectionStub.post = function () {
    };
    var sandbox, getStub, postStub;
    var parsedResult = "aisdaiusd";

    var service = t1.EntityList;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();

        postStub = sandbox.stub(connectionStub, "post")
            .returns(Promise.try(function () {
                return parsedResult
            }));
    });

    afterEach(function () {
        sandbox.restore();
    });

    describe("#get with count", function () {
        var userParams = {'page_limit': 10};

        it("should have 10 entities", function () {
            parsedResult = common.loadFixture('campaigns-10');

            getStub = sandbox.stub(connectionStub, "get")
                .returns(Promise.try(function () {
                    return parsedResult
                }));
            var campaigns = service.get('campaigns', connectionStub, userParams);

            return expect(campaigns).to.eventually
                    .have.property('entities') &&

                expect(campaigns).to.eventually
                    .have.property('meta')
                    .and.have.property('count', userParams.page_limit);

        });
    });

    describe("#get first page", function () {
        var userParams = {};

        it("should have 100 entities", function () {
            parsedResult = common.loadFixture('campaigns-100');

            getStub = sandbox.stub(connectionStub, "get")
                .returns(Promise.try(function () {
                    return parsedResult
                }));
            var campaigns = service.get('campaigns', connectionStub, userParams);

            return expect(campaigns).to.eventually
                    .have.property('entities') &&
                expect(campaigns).to.eventually
                    .have.property('meta').and.have.property('next_page');
        });

    });
});

