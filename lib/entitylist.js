var Q = require('q');
var T1Connection = require('./t1connection');
var Entity = require('./entity');
var config = require('./config');
var schemaProcessing = require('./schemaprocessing');

var EntityList = (function () {
    function EntityList(t1config) {
        console.log(schemaProcessing);
        this.t1connection = new T1Connection(t1config);
        var that = this;
        this.userParamsSchema = schemaProcessing.loadSchema('userparams')
            .then(function (results) {
                that.userParamsSchema = results.resolved;
            });
    }

    // accept an object with user parameters: {'page_limit':10}
    EntityList.prototype.get = function (baseUrl, userParams) {
        var that = this;
        var verification = schemaProcessing.validateJson(userParams, this.userParamsSchema);
        if (verification.length != 0) {
            return Q.resolve({
                then: function (onFulfill, onReject) {
                    onReject(verification);
                }
            })
        }
        var queryString = this.buildQueryString(baseUrl, userParams);
        return this.t1connection.get(queryString)
            .then(function (body) {
                return that.processEntityList(body);
            })
    };


    EntityList.prototype.processEntityList = function (body) {
        var content = JSON.parse(body);

        function* entityGenerator(stuff) {
            for (var entity of stuff.data) {
                var newEntity = new Entity(entity.entity_type);
                newEntity.data.name = entity.name;
                newEntity.data.id = entity.id;
                yield newEntity;
            }
        }

        return {
            entities: entityGenerator(content),
            meta: content.meta
        }
    };

    EntityList.prototype.getNextPage = function (retrieved) {
        var retrievedNext = retrieved.meta.next_page;
        if (typeof retrievedNext !== 'undefined') {

            var nextPage = retrievedNext.substring(config.apiUrl.length, retrievedNext.length);

            return this.get(nextPage)
        }
    };

    EntityList.prototype.buildQueryString = function (baseUrl, userParams) {

        var endpoint = baseUrl;
        if (userParams) {
            var str = [];
            for (var p in userParams)
                if (userParams.hasOwnProperty(p)) {
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(userParams[p]));
                }
            if (Object.keys(userParams).length > 0) {
                endpoint += '?' + str.join("&");

            }
        }
        console.log('Query String: ' + endpoint);
        return endpoint;
    };

    return EntityList;
})();

module.exports = EntityList;
