var entityMap = {
    'atomic_creative': 'atomic_creatives',
    'ad_server': 'ad_servers',
    'advertiser': 'advertisers',
    'audience_segment': 'audience_segments',
    'agency': 'agencies',
    'campaign': 'campaigns',
    'concept': 'concepts',
    'creative': 'creatives',
    'creative_approval': 'creative_approvals',
    "deal": 'deals',
    "organization": 'organizations',
    "pixel": 'pixels',
    "pixel_bundle": 'pixel_bundles',
    "pixel_provider": 'pixel_providers',
    "placement_slot": 'placement_slots',
    "publisher": 'publishers',
    "publisher_site": 'publisher_sites',
    "site_list": 'site_lists',
    "site_placement": 'site_placement',
    "strategy": 'strategies',
    "strategy_concept": 'strategy_concepts',
    "strategy_day_part": 'strategy_day_parts',
    "strategy_domain": 'strategy_domains',
    "strategy_supply_source": 'strategy_supply_sources',
    "target_dimension": 'target_dimensions',
    "target_value": 'target_values',
    "targeting_vendor": 'targeting_vendors',
    "user": 'users',
    "vendor": 'vendors',
    "vendor_contract": 'vendor_contracts',
    "vendor_domain": 'vendor_domains',
    "vendor_pixel": 'vendor_pixels',
    "vendor_pixel_domain": 'vendor_pixel_domains',
    "vertical": 'verticals'
};

function getEndpoint(entity) {
    return entityMap[entity];
}

exports.getEndpoint = getEndpoint;
