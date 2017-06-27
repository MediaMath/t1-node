"use strict";

var Entity = require('./entity');
var SchemaProcessing = require('./schemaprocessing');

var EntityList = function () {
};

// accept an object with user parameters: {'page_limit':10}
EntityList.get = function (baseUrl, connection, userParams) {
    if (!connection) {
        throw new Error("connection object must be provided");
    }

    return SchemaProcessing.getSchema('userparams')
        .then(function (schema) {
            var verification = SchemaProcessing.validateJson(userParams, schema);

            if (verification.length !== 0) {
                // you may want to specify a custom error type here, and set the verification
                // results as a property of them.
                throw new Error(verification);
            }

            var queryString = connection.buildQueryString(baseUrl, userParams);

            return connection.get(queryString);
        })
        .then(function (body) {
            var content = JSON.parse(body);
            return EntityList.processEntityList(content.data, content.meta);
        });
};

EntityList.processEntityList = function (entities, meta) {

    function* EntityGenerator(entities) {
        for (var entity of entities) {
            var newEntity = new Entity(entity.entity_type);
            newEntity.processEntity(entity);
            yield newEntity;
        }
    }

    return {
        entities: EntityGenerator(entities),
        meta: meta
    };
};

EntityList.getNextPage = function (retrieved, connection) {
    var retrievedNext = retrieved.meta.next_page;
    if (typeof retrievedNext !== 'undefined') {
        return this.get(retrievedNext, connection);
    }
};

module.exports = EntityList;
