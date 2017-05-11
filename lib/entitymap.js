var entityMap = {
    'atomic_creative': '/api/v2.0/atomic_creatives',
    'ad_server': '/api/v2.0/ad_servers',
    'advertiser': '/api/v2.0/advertisers',
    'audience_segment': '/api/v2.0/audience_segments',
    'agency': '/api/v2.0/agencies',
    'campaign': '/api/v2.0/campaigns',
    'concept': '/api/v2.0/concepts',
    'creative': '/api/v2.0/creatives',
    'creative_approval': '/api/v2.0/creative_approvals',
    "deal": '/api/v2.0/deals',
    "organization": '/api/v2.0/organizations',
    "pixel": '/api/v2.0/pixels',
    "pixel_bundle": '/api/v2.0/pixel_bundles',
    "pixel_provider": '/api/v2.0/pixel_providers',
    "placement_slot": '/api/v2.0/placement_slots',
    "publisher": '/api/v2.0/publishers',
    "publisher_site": '/api/v2.0/publisher_sites',
    "site_list": '/api/v2.0/site_lists',
    "site_placement": '/api/v2.0/site_placement',
    "strategy": '/api/v2.0/strategies',
    "strategy_concept": '/api/v2.0/strategy_concepts',
    "strategy_day_part": '/api/v2.0/strategy_day_parts',
    "strategy_domain": '/api/v2.0/strategy_domains',
    "strategy_supply_source": '/api/v2.0/strategy_supply_sources',
    "target_dimension": '/api/v2.0/target_dimensions',
    "target_value": '/api/v2.0/target_values',
    "targeting_vendor": '/api/v2.0/targeting_vendors',
    "user": '/api/v2.0/users',
    "vendor": '/api/v2.0/vendors',
    "vendor_contract": '/api/v2.0/vendor_contracts',
    "vendor_domain": '/api/v2.0/vendor_domains',
    "vendor_pixel": '/api/v2.0/vendor_pixels',
    "vendor_pixel_domain": '/api/v2.0/vendor_pixel_domains',
    "vertical": '/api/v2.0/verticals'
};

function getEndpoint(entity) {
    return entityMap[entity];
}

exports.getEndpoint = getEndpoint;
