var entitymap = {
    'atomic_creative': 'atomic_creatives',
    'ad_server': 'ad_server',
    'advertiser': 'advertisers',
    'agency': 'agencies',
    'campaign': 'campaigns',
    'concept': 'concepts',
    'creative': 'creatives'
};

function get_endpoint(entity) {
    return entitymap[entity];
}

exports.get_endpoint = get_endpoint