"use strict";

var Entity = require('./entity');
var EntityMap = require('./entitymap');
var Config = require('./common/config');
var SchemaProcessing = require('./schemaprocessing');

var EntityList = function () {
};

// accept an object with user parameters: {'page_limit':10}
EntityList.get = function (base, connection, userParams) {
    if (!connection) {
        throw new Error("connection object must be provided");
    }

    return SchemaProcessing.getSchema('userparams')
        .then(function (schema) {
            let verification = SchemaProcessing.validateJson(userParams, schema);

            if (verification.length !== 0) {
                // you may want to specify a custom error type here, and set the verification
                // results as a property of them.
                throw new Error(verification);
            }

            // if it looks like a full path just use that; we're here from getNextPage.
            let queryString =  /^[a-z_]*$/.test(base) ?
                connection.buildQueryString(EntityMap.getEndpoint(base), userParams) : base;

            return connection.get(queryString);
        })
        .then(function (body) {
            let content = JSON.parse(body);
            return EntityList.processEntityList(content.data, content.meta);
        });
};

EntityList.processEntityList = function (entities, meta) {

    function* EntityGenerator(entities) {
        for (let entity of entities) {
            let newEntity = new Entity(entity.entity_type);
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
    let retrievedNext = retrieved.meta.next_page;
    if (typeof retrievedNext !== 'undefined') {
        let nextPage = retrievedNext.substring(Config.apiBaseUrl.length, retrievedNext.length).trim();
        return this.get(nextPage, connection);
    }
};

module.exports = EntityList;
