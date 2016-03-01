"use strict";

var T1Connection = require('./t1connection');
var Entity = require('./entity');
var config = require('./config');
var schemaProcessing = require('./schemaprocessing');

var EntityList = function() {
};

// accept an object with user parameters: {'page_limit':10}
EntityList.get = function (baseUrl, connection, userParams) {
    if (connection == null) {
        throw new Error("connection object must be provided")
    }

    return schemaProcessing.getSchema('userparams')
        .then(function (schema) {
            var verification = schemaProcessing.validateJson(userParams, schema);

            if (verification.length !== 0) {
                // you may want to specify a custom error type here, and set the verification
                // results as a property of them.
                throw new Error(verification);
            }

            var queryString = T1Connection.buildQueryString(baseUrl, userParams);

            return connection.get(queryString);
        })
        .then(function (body) {
            var content = JSON.parse(body);
            return EntityList.processEntityList(content.data, content.meta);
        });
};

EntityList.processEntityList = function (entities, meta) {

    function* entityGenerator(entities) {
        for (var entity of entities) {
            var newEntity = new Entity(entity.entity_type);
            newEntity.process_entity(entity);
            yield newEntity;
        }
    }

    return {
        entities: entityGenerator(entities),
        meta: meta
    }
};

EntityList.getNextPage = function (retrieved, connection) {
    var retrievedNext = retrieved.meta.next_page;
    if (typeof retrievedNext !== 'undefined') {
        var nextPage = retrievedNext.substring(config.apiUrl.length, retrievedNext.length);
        return this.get(nextPage, connection)
    }
};

module.exports = EntityList;
