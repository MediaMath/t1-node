const jsonrefs = require('json-refs');
const Validator = require('jsonschema').Validator;
const ad_server = require('./schema/ad_server');
const advertiser = require('./schema/advertiser');
const agency = require('./schema/agency');
const atomic_creative = require('./schema/atomic_creative');
const audience_segment = require('./schema/audience_segment');
const campaign = require('./schema/campaign');
const common = require('./schema/common');
const concept = require('./schema/concept');
const container_single = require('./schema/container_single');
const creative = require('./schema/creative');
const creative_approval = require('./schema/creative_approval');
const deal = require('./schema/deal');
const organization = require('./schema/organization');
const pixel = require('./schema/pixel');
const pixel_bundle = require('./schema/pixel_bundle');
const pixel_provider = require('./schema/pixel_provider');
const placement_slot = require('./schema/placement_slot');
const publisher = require('./schema/publisher');
const publisher_site = require('./schema/publisher_site');
const site_list = require('./schema/site_list');
const site_placement = require('./schema/site_placement');
const strategy = require('./schema/strategy');
const strategy_audience_segment = require('./schema/strategy_audience_segment');
const strategy_audience_segment_form = require('./schema/strategy_audience_segment_form');
const strategy_concept = require('./schema/strategy_concept');
const strategy_day_part = require('./schema/strategy_day_part');
const strategy_domain = require('./schema/strategy_domain');
const strategy_supply_source = require('./schema/strategy_supply_source');
const strategy_targeting_segment = require('./schema/strategy_targeting_segment');
const strategy_targeting_segment_form = require('./schema/strategy_targeting_segment_form');
const strategy_target_values_form = require('./schema/strategy_target_values_form');
const supply_source = require('./schema/supply_source');
const target_dimension = require('./schema/target_dimension');
const target_value = require('./schema/target_value');
const targeting_vendor = require('./schema/targeting_vendor');
const user = require('./schema/user');
const userparams = require('./schema/userparams');
const vendor = require('./schema/vendor');
const vendor_contract = require('./schema/vendor_contract');
const vendor_domain = require('./schema/vendor_domain');
const vendor_pixel = require('./schema/vendor_pixel');
const vendor_pixel_domain = require('./schema/vendor_pixel_domain');
const vertical = require('./schema/vertical');

const schemas = {
  ad_server,
  advertiser,
  agency,
  atomic_creative,
  audience_segment,
  campaign,
  common,
  concept,
  container_single,
  creative,
  creative_approval,
  deal,
  organization,
  pixel,
  pixel_bundle,
  pixel_provider,
  placement_slot,
  publisher,
  publisher_site,
  site_list,
  site_placement,
  strategy,
  strategy_audience_segment,
  strategy_audience_segment_form,
  strategy_concept,
  strategy_day_part,
  strategy_domain,
  strategy_supply_source,
  strategy_targeting_segment,
  strategy_targeting_segment_form,
  strategy_target_values_form,
  supply_source,
  target_dimension,
  target_value,
  targeting_vendor,
  user,
  userparams,
  vendor,
  vendor_contract,
  vendor_domain,
  vendor_pixel,
  vendor_pixel_domain,
  vertical,
};

function getSchema(schemaName) {
  const jsonRefsOptions = {
    depth: 2,
  };
  return jsonrefs.resolveRefs(schemas[schemaName], jsonRefsOptions).then(schema => schema.resolved);
}

function validateJson(data, schema) {
  // for some reason jsonschema doesn't like our date format
  Validator.prototype.customFormats.datetimezone = function datetimezone(input) {
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
