var Q = require('q');
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
        getStub = sandbox.stub(connectionStub, "get").returns(Q(parsedResult));
        postStub = sandbox.stub(connectionStub, "post").returns(Q(parsedResult));
    });

    afterEach(function () {
        sandbox.restore();
    });

    describe("#get with count", function () {
        var userParams = {'page_limit': 10};

        parsedResult = loadFixture('campaigns-10');

        it("should have 10 entities", function () {
            var campaigns = service.get('campaigns', userParams);
            expect(getStub.callCount).to.eventually.be.equal(1);

            expect(campaigns).to.eventually
                .have.property('entities')
                .and.have.length(userParams.page_limit);
            expect(campaigns).to.eventually
                .have.property('entityCount', userParams.page_limit);
            expect(campaigns).to.eventually.have.property('next_page')
        });
    });

    describe("#get first page", function () {
        var userParams = {};
        const expectedEntityCount = 100;
        parsedResult = loadFixture('campaigns-100');


        it("should have 100 entities", function () {
            var campaigns = service.get('campaigns', userParams);
            expect(getStub.callCount).to.be.equal(1);

            expect(campaigns).to.eventually
                .have.property('entities')
                .and.have.length(expectedEntityCount);
            expect(campaigns).to.eventually
                .have.property('entityCount', expectedEntityCount);
            expect(campaigns).to.eventually.have.property('next_page')
        });

    });
});

