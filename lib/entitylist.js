var Promise = require('bluebird');
var T1Connection = require('./t1connection');
var Entity = require('./entity');
var config = require('./config');
var schemaProcessing = require('./schemaprocessing');

var EntityList = function (t1config) {
    this.t1connection = new T1Connection(t1config);
    this.paramSchemaLoaded = false;
};

// accept an object with user parameters: {'page_limit':10}
EntityList.prototype.get = function (baseUrl, userParams) {
    var that = this;

    return Promise.try(function () {
        if (!this.paramSchemaLoaded) {
            return Promise.try(function () {
                return schemaProcessing.loadSchema('userparams');
            }).then(function (results) {
                that.paramSchemaLoaded = true;
                that.userParamsSchema = results.resolved;
            });
        } else {
            return undefined;
        }
    }).then(function (schemaP) {
        var verification = schemaProcessing.validateJson(userParams, that.userParamsSchema);

        if (verification.length !== 0) {
            // you may want to specify a custom error type here, and set the verification
            // results as a property of them.
            throw new Error(verification);
        }

        var queryString = T1Connection.buildQueryString(baseUrl, userParams);

        return that.t1connection.get(queryString);
    }).then(function (body) {
        return that.processEntityList(body);
    });
};

EntityList.prototype.processEntityList = function (body) {
    var content = JSON.parse(body);

    function* entityGenerator(stuff) {
        for (var entity of stuff.data) {
            var newEntity = new Entity(entity.entity_type);
            newEntity.update_entity(entity, {});
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

module.exports = EntityList;
