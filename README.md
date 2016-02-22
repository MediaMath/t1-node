t1-node
=======

Node implementation of a T1 API Library

### Compilation/Installation
Checkout, then `npm install .`

### Usage
``` js
var t1 = require('mmt1');
var config = {
  'user': t1_username,
  'password': t1_user_password,
  'api_key': application_mashery_key
  };
```

#### Single Entities

Retrieve, edit and save a single entity

``` js
var connection = t1.T1Connection(config);
var agencyPromise = new t1.Entity('agency')
  .get(1234, connection)
  .then(function(agency) {this.agency = agency});
agency.data.name = 'new name';
agency.save(conn).done(console.log('saved');
```

##### Entity Lists

Returns a generator to entities

``` js
var mm = new t1.EntityList(t1conf);
var userParams = {
  'page_limit':10
  };
mm.get('campaigns',  userParams).then(function(list) {this.pg1 = list});
mm.getNextPage(pg1).then(function(list) {this.pg2 = list});

for (var entity of pg1.entities) {console.log(entity)}
```

#### Targeting

##### Strategy Target Segments
To get a strategy's targeting segments:
``` js
var targetingSegmentsPromise = new t1.StrategyTargetSegments()
  .get(strategy_id, connection)
  .then(function(targetingSegments) {this.targetingSegments = targetingSegments});
```  

To edit strategy targeting segments:
``` js
targetingSegments.include = [[1, 'OR']];
targetingSegments.exclude = [[119, 'OR']];
targetingSegments.include_op = 'OR';
targetingSegments.exclude_op = 'OR';
targetingSegments.save(connection).done(console.log('saved');
```