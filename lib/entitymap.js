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
    "pixel_bundle": 'pixel_bundles'
};

function get_endpoint(entity) {
    return entitymap[entity];
}

exports.get_endpoint = get_endpoint;
