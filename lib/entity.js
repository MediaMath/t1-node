const EntityMap = require('./entitymap');
const SchemaProcessing = require('./schemaprocessing');
const EntityList = require('./entitylist');
require('dotenv').load();

const Entity = function Entity(type, connection, id) {
  this.entity_type = type;

  if (id && connection) {
    this.get(id, connection);
  }
};

Entity.prototype.get = function get(id, connection, userParams) {
  if (!connection) {
    throw new Error('connection object must be provided');
  }
  const that = this;
  return SchemaProcessing.getSchema('userparams')
    .then((schema) => {
      const verification = SchemaProcessing.validateJson(userParams, schema);
      if (verification.length !== 0) {
        // you may want to specify a custom error type here, and set the verification
        // results as a property of them.
        throw new Error(verification);
      }
      const queryString = connection.buildQueryString(`${EntityMap.getEndpoint(that.entity_type)}/${id}`, userParams);
      return connection.get(queryString);
    }).then((body) => {
      const content = JSON.parse(body);
      return that.processEntity(content.data, content.meta);
    });
};


// called on successful save of entity
Entity.prototype.processEntity = function processEntity(data, meta) {
  Object.keys(data).forEach((key) => {
    const value = data[key];
    if (
      value &&
      value.constructor === Array &&
      Object.prototype.hasOwnProperty.call(value[0], 'entity_type')) {
      data[key] = EntityList.processEntityList(value, {});
    } else if (
      value &&
      value.constructor === Object &&
      Object.prototype.hasOwnProperty.call(value, 'entity_type')) {
      const related = new Entity(value.entity_type);
      related.processEntity(value, {});
      data[key] = related;
    }
  });

  if (!meta) {
    data.meta = meta;
  }

  Object.assign(this, data);
  return this;
};

Entity.prototype.save = function save(connection) {
  const that = this;
  return SchemaProcessing.getSchema(that.entity_type)
    .then((schema) => {
      const verification = SchemaProcessing.validateJson(that, schema);
      if (verification.length !== 0) {
        throw new Error(verification);
      } else {
        let endpoint = EntityMap.getEndpoint(that.entity_type);
        const postFormat = EntityMap.getPostFormat(that.entity_type);


        if (typeof that.id !== 'undefined') {
          endpoint += `/${that.id}`;
        }
        if (postFormat === 'json') {
          return that.saveJson(endpoint, connection);
        } else if (postFormat === 'formdata') {
          return that.saveFormData(endpoint, connection);
        }
        throw new Error('No postformat defined');
      }
    });
};

Entity.prototype.saveJson = function saveJson(endpoint, connection) {
  const data = this.getJsonData();
  const that = this;
  return connection.postJson(endpoint, data).then((body) => {
    const content = JSON.parse(body);
    return that.processEntity(content.data, content.meta);
  });
};

Entity.prototype.saveFormData = function saveFormData(endpoint, connection) {
  const that = this;
  return that.getPostFormData()
    .then((form) => {
      let entityEndpoint = EntityMap.getEndpoint(that.entity_type);
      if (typeof that.id !== 'undefined') {
        entityEndpoint += `/${that.id}`;
      }
      return connection.postFormdata(entityEndpoint, form).then((body) => {
        const content = JSON.parse(body);
        return that.processEntity(content.data, content.meta);
      });
    });
};

Entity.prototype.getJsonData = function getJsonData() {
  const data = JSON.parse(JSON.stringify(this));

  // remove any null properties; the API doesn't support them.
  Object.keys(this).forEach((property) => {
    if (Object.prototype.hasOwnProperty.call(this, property) && !this[property]) {
      delete data[property];
    }
  });

  return JSON.stringify(data);
};

Entity.prototype.getPostFormData = function getPostFormData() {
  const that = this;
  return SchemaProcessing.getSchema(that.entity_type)
    .then((schema) => {
      const schemaAllOf = schema.allOf;

      function encodeForPost(key, value) {
        if (typeof value === 'boolean') {
          return Number(value);
        } else if (typeof value === 'function') {
          return undefined;
        }
        // flatten currency elements
        if (Array.isArray(value) &&
          Object.prototype.hasOwnProperty.call(value[0], 'currency_code')) {
          return that.getCurrencyValue(key);
        }
        return value;
      }

      const form = JSON.parse(JSON.stringify(that, encodeForPost));
      schemaAllOf.forEach((schemaComponent) => {
        Object.keys(schemaComponent.properties).forEach((key) => {
          if (schemaComponent.properties[key].readonly) {
            delete form[key];
          }
        });
      });

      return form;
    });
};


function getOrSetCurrencyValue(obj, fieldName, currencyName, setAmount) {
  let currencyValue = null;
  if (!currencyName) {
    currencyName = obj.currency_code || (process.env.CURRENCY_CODE || 'USD');
  }
  if (!obj[fieldName]) {
    obj[fieldName] = [];
  }
  const currencyValues = obj[fieldName];
  Object.values(currencyValues).forEach((currencyPair) => {
    if (currencyPair.currency_code === currencyName) {
      if (setAmount) {
        currencyPair.value = setAmount;
      }
      currencyValue = currencyPair.value;
    }
  });
  // if we are here it means it's not in the list
  if (setAmount) {
    const newEntry = {
      currency_code: currencyName,
      value: setAmount,
    };
    currencyValues.push(newEntry);
    currencyValue = newEntry.value;
  }
  return currencyValue;
}

Entity.prototype.getCurrencyValue = function getCurrencyValue(fieldName, currencyName) {
  return getOrSetCurrencyValue(this, fieldName, currencyName);
};

Entity.prototype.setCurrencyValue = function setCurrencyValue(fieldName, amount, currencyName) {
  return getOrSetCurrencyValue(this, fieldName, currencyName, amount);
};


module.exports = Entity;
