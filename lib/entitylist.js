const Entity = require('./entity');
const EntityMap = require('./entitymap');
const SchemaProcessing = require('./schemaprocessing');


// accept an object with user parameters: {'page_limit':10}
module.exports.get = function get(base, connection, userParams) {
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
      return this.processEntityList(content.data, content.meta);
    });
};

function* EntityGenerator(list) {
  for (const entity of list) {
    const newEntity = new Entity(entity.entity_type);
    newEntity.processEntity(entity);
    yield newEntity;
  }
}
module.exports.processEntityList = function processEntityList(entities, meta) {
  return {
    entities: EntityGenerator(entities),
    meta,
  };
};

module.exports.getNextPage = function getNextPage(retrieved, connection) {
  const retrievedNext = retrieved.meta.next_page;
  if (typeof retrievedNext !== 'undefined') {
    return this.get(retrievedNext, connection);
  }
  throw new Error('no next page!');
};
