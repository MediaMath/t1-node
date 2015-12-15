var entitymap = {
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
    "strategy_day_part": 'strategy_day_parts'
};

function get_endpoint(entity) {
    return entitymap[entity];
}

exports.get_endpoint = get_endpoint;
