

const entityMap = {
  atomic_creative: {
    path: '/api/v2.0/atomic_creatives',
    postformat: 'formdata',
  },
  atomic_creatives: {
    path: '/api/v2.0/atomic_creatives',
    postformat: 'formdata',
  },
  ad_server: {
    path: '/api/v2.0/ad_servers',
    postformat: 'formdata',
  },
  ad_servers: {
    path: '/api/v2.0/ad_servers',
    postformat: 'formdata',
  },
  advertiser: {
    path: '/api/v2.0/advertisers',
    postformat: 'formdata',
  },
  advertisers: {
    path: '/api/v2.0/advertisers',
    postformat: 'formdata',
  },
  audience_segment: {
    path: '/api/v2.0/audience_segments',
    postformat: 'formdata',
  },
  audience_segments: {
    path: '/api/v2.0/audience_segments',
    postformat: 'formdata',
  },
  agency: {
    path: '/api/v2.0/agencies',
    postformat: 'formdata',
  },
  agencies: {
    path: '/api/v2.0/agencies',
    postformat: 'formdata',
  },
  campaign: {
    path: '/api/v2.0/campaigns',
    postformat: 'formdata',
  },
  campaigns: {
    path: '/api/v2.0/campaigns',
    postformat: 'formdata',
  },
  concept: {
    path: '/api/v2.0/concepts',
    postformat: 'formdata',
  },
  concepts: {
    path: '/api/v2.0/concepts',
    postformat: 'formdata',
  },
  creative: {
    path: '/api/v2.0/creatives',
    postformat: 'formdata',
  },
  creatives: {
    path: '/api/v2.0/creatives',
    postformat: 'formdata',
  },
  creative_approval: {
    path: '/api/v2.0/creative_approvals',
    postformat: 'formdata',
  },
  creative_approvals: {
    path: '/api/v2.0/creative_approvals',
    postformat: 'formdata',
  },
  deal: {
    path: '/media/v1.0/deals',
    postformat: 'json',
  },
  deals: {
    path: '/media/v1.0/deals',
    postformat: 'json',
  },
  organization: {
    path: '/api/v2.0/organizations',
    postformat: 'formdata',
  },
  organizations: {
    path: '/api/v2.0/organizations',
    postformat: 'formdata',
  },
  pixel: {
    path: '/api/v2.0/pixels',
    postformat: 'formdata',
  },
  pixels: {
    path: '/api/v2.0/pixels',
    postformat: 'formdata',
  },
  pixel_bundle: {
    path: '/api/v2.0/pixel_bundles',
    postformat: 'formdata',
  },
  pixel_bundles: {
    path: '/api/v2.0/pixel_bundles',
    postformat: 'formdata',
  },
  pixel_provider: {
    path: '/api/v2.0/pixel_providers',
    postformat: 'formdata',
  },
  pixel_providers: {
    path: '/api/v2.0/pixel_providers',
    postformat: 'formdata',
  },
  placement_slot: {
    path: '/api/v2.0/placement_slots',
    postformat: 'formdata',
  },
  placement_slots: {
    path: '/api/v2.0/placement_slots',
    postformat: 'formdata',
  },
  publisher: {
    path: '/api/v2.0/publishers',
    postformat: 'formdata',
  },
  publishers: {
    path: '/api/v2.0/publishers',
    postformat: 'formdata',
  },
  publisher_site: {
    path: '/api/v2.0/publisher_sites',
    postformat: 'formdata',
  },
  publisher_sites: {
    path: '/api/v2.0/publisher_sites',
    postformat: 'formdata',
  },
  site_list: {
    path: '/api/v2.0/site_lists',
    postformat: 'formdata',
  },
  site_lists: {
    path: '/api/v2.0/site_lists',
    postformat: 'formdata',
  },
  site_placement: {
    path: '/api/v2.0/site_placement',
    postformat: 'formdata',
  },
  site_placements: {
    path: '/api/v2.0/site_placement',
    postformat: 'formdata',
  },
  strategy: {
    path: '/api/v2.0/strategies',
    postformat: 'formdata',
  },
  strategies: {
    path: '/api/v2.0/strategies',
    postformat: 'formdata',
  },
  strategy_concept: {
    path: '/api/v2.0/strategy_concepts',
    postformat: 'formdata',
  },
  strategy_concepts: {
    path: '/api/v2.0/strategy_concepts',
    postformat: 'formdata',
  },
  strategy_day_part: {
    path: '/api/v2.0/strategy_day_parts',
    postformat: 'formdata',
  },
  strategy_day_parts: {
    path: '/api/v2.0/strategy_day_parts',
    postformat: 'formdata',
  },
  strategy_domain: {
    path: '/api/v2.0/strategy_domains',
    postformat: 'formdata',
  },
  strategy_domains: {
    path: '/api/v2.0/strategy_domains',
    postformat: 'formdata',
  },
  strategy_supply_source: {
    path: '/api/v2.0/strategy_supply_sources',
    postformat: 'formdata',
  },
  strategy_supply_sources: {
    path: '/api/v2.0/strategy_supply_sources',
    postformat: 'formdata',
  },
  target_dimension: {
    path: '/api/v2.0/target_dimensions',
    postformat: 'formdata',
  },
  target_dimensions: {
    path: '/api/v2.0/target_dimensions',
    postformat: 'formdata',
  },
  target_value: {
    path: '/api/v2.0/target_values',
    postformat: 'formdata',
  },
  target_values: {
    path: '/api/v2.0/target_values',
    postformat: 'formdata',
  },
  targeting_vendor: {
    path: '/api/v2.0/targeting_vendors',
    postformat: 'formdata',
  },
  targeting_vendors: {
    path: '/api/v2.0/targeting_vendors',
    postformat: 'formdata',
  },
  user: {
    path: '/api/v2.0/users',
    postformat: 'formdata',
  },
  users: {
    path: '/api/v2.0/users',
    postformat: 'formdata',
  },
  vendor: {
    path: '/api/v2.0/vendors',
    postformat: 'formdata',
  },
  vendors: {
    path: '/api/v2.0/vendors',
    postformat: 'formdata',
  },
  vendor_contract: {
    path: '/api/v2.0/vendor_contracts',
    postformat: 'formdata',
  },
  vendor_contracts: {
    path: '/api/v2.0/vendor_contracts',
    postformat: 'formdata',
  },
  vendor_domain: {
    path: '/api/v2.0/vendor_domains',
    postformat: 'formdata',
  },
  vendor_domains: {
    path: '/api/v2.0/vendor_domains',
    postformat: 'formdata',
  },
  vendor_pixel: {
    path: '/api/v2.0/vendor_pixels',
    postformat: 'formdata',
  },
  vendor_pixels: {
    path: '/api/v2.0/vendor_pixels',
    postformat: 'formdata',
  },
  vendor_pixel_domain: {
    path: '/api/v2.0/vendor_pixel_domains',
    postformat: 'formdata',
  },
  vendor_pixel_domains: {
    path: '/api/v2.0/vendor_pixel_domains',
    postformat: 'formdata',
  },
  vertical: {
    path: '/api/v2.0/verticals',
    postformat: 'formdata',
  },
  verticals: {
    path: '/api/v2.0/verticals',
    postformat: 'formdata',
  },
};

function getEndpoint(entity) {
  return entityMap[entity].path;
}

function getPostFormat(entity) {
  return entityMap[entity].postformat;
}

exports.getEndpoint = getEndpoint;
exports.getPostFormat = getPostFormat;
