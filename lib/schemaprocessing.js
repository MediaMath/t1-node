

const jsonrefs = require('json-refs');

const _schemas = {
  ad_server: require('./schema/ad_server'),
  advertiser: require('./schema/advertiser'),
  agency: require('./schema/agency'),
  atomic_creative: require('./schema/atomic_creative'),
  audience_segment: require('./schema/audience_segment'),
  campaign: require('./schema/campaign'),
  common: require('./schema/common'),
  concept: require('./schema/concept'),
  container_single: require('./schema/container_single'),
  creative: require('./schema/creative'),
  creative_approval: require('./schema/creative_approval'),
  deal: require('./schema/deal'),
  organization: require('./schema/organization'),
  pixel: require('./schema/pixel'),
  pixel_bundle: require('./schema/pixel_bundle'),
  pixel_provider: require('./schema/pixel_provider'),
  placement_slot: require('./schema/placement_slot'),
  publisher: require('./schema/publisher'),
  publisher_site: require('./schema/publisher_site'),
  site_list: require('./schema/site_list'),
  site_placement: require('./schema/site_placement'),
  strategy: require('./schema/strategy'),
  strategy_audience_segment: require('./schema/strategy_audience_segment'),
  strategy_audience_segment_form: require('./schema/strategy_audience_segment_form'),
  strategy_concept: require('./schema/strategy_concept'),
  strategy_day_part: require('./schema/strategy_day_part'),
  strategy_domain: require('./schema/strategy_domain'),
  strategy_supply_source: require('./schema/strategy_supply_source'),
  strategy_targeting_segment: require('./schema/strategy_targeting_segment'),
  strategy_targeting_segment_form: require('./schema/strategy_targeting_segment_form'),
  strategy_target_values_form: require('./schema/strategy_target_values_form'),
  supply_source: require('./schema/supply_source'),
  target_dimension: require('./schema/target_dimension'),
  target_value: require('./schema/target_value'),
  targeting_vendor: require('./schema/targeting_vendor'),
  user: require('./schema/user'),
  userparams: require('./schema/userparams'),
  vendor: require('./schema/vendor'),
  vendor_contract: require('./schema/vendor_contract'),
  vendor_domain: require('./schema/vendor_domain'),
  vendor_pixel: require('./schema/vendor_pixel'),
  vendor_pixel_domain: require('./schema/vendor_pixel_domain'),
  vertical: require('./schema/vertical'),
};

function getSchema(schemaName) {
  const jsonRefsOptions = {
    depth: 2,
  };
  return jsonrefs.resolveRefs(_schemas[schemaName], jsonRefsOptions).then(schema => schema.resolved);
}

function validateJson(data, schema) {
  const Validator = require('jsonschema').Validator;
  // for some reason jsonschema doesn't like our date format
  Validator.prototype.customFormats.datetimezone = function (input) {
    return !input || !isNaN(Date.parse(input));
  };
  const v = new Validator();
  const results = (v.validate(data, schema));
  return results.errors.map(obj => obj.stack);
}

module.exports = {
  getSchema,
  validateJson,
};
