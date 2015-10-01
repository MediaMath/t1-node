var entitymap = {
    'agency': 'agencies'
};

export function get_endpoint(entity:string) {
    return entitymap[entity];
}
