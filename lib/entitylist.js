

const Entity = require('./entity');
const EntityMap = require('./entitymap');
const SchemaProcessing = require('./schemaprocessing');

const EntityList = function () {
};

// accept an object with user parameters: {'page_limit':10}
EntityList.get = function (base, connection, userParams) {
  if (!connection) {
    throw new Error('connection object must be provided');
  }

  return SchemaProcessing.getSchema('userparams')
    .then((schema) => {
      const verification = SchemaProcessing.validateJson(userParams, schema);

      if (verification.length !== 0) {
        // you may want to specify a custom error type here, and set the verification
        // results as a property of them.
        throw new Error(verification);
      }

      // if it looks like a full path just use that; we're here from getNextPage.
      const queryString = /^[a-z_]*$/.test(base) ?
        connection.buildQueryString(EntityMap.getEndpoint(base), userParams) : base;

      return connection.get(queryString);
    })
    .then((body) => {
      const content = JSON.parse(body);
      return EntityList.processEntityList(content.data, content.meta);
    });
};

EntityList.processEntityList = function (entities, meta) {
  function* EntityGenerator(entities) {
    for (const entity of entities) {
      const newEntity = new Entity(entity.entity_type);
      newEntity.processEntity(entity);
      yield newEntity;
    }
  }

  return {
    entities: EntityGenerator(entities),
    meta,
  };
};

EntityList.getNextPage = function (retrieved, connection) {
  const retrievedNext = retrieved.meta.next_page;
  if (typeof retrievedNext !== 'undefined') {
    return this.get(retrievedNext, connection);
  }
};

module.exports = EntityList;
