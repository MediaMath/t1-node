t1-node
=======

Node implementation of a T1 API Library. Uses [Bluebird](http://bluebirdjs.com/docs/getting-started.html) for fast, simple callback handling via promises.

### Compilation/Installation
#### From npm
` npm install terminalone `
#### From source
Checkout, then `npm install .`

### Usage
``` js
var t1 = require('terminalone');
var config = {
  'user': t1_username,
  'password': t1_user_password,
  'api_key': application_mashery_key
  };
```

#### Single Entities

Retrieve, edit and save a single entity

``` js
var connection = new t1.T1Connection(config);
var agencyPromise = new t1.Entity('agency')
  .get(1234, connection)
  .then(function(agency) {this.agency = agency});
agency.name = 'new name';
agency.save(conn).done(console.log('saved'));
```

##### Entity Lists

Returns a generator to entities

``` js
var userParams = {
  'page_limit':10
  };
t1.EntityList.get('campaigns', connection,  userParams).then(function(list) {this.pg1 = list});
t1.EntityList.getNextPage(pg1, conn).then(function(list) {this.pg2 = list});

for (var entity of pg1.entities) {console.log(entity)}
```


###### Related entities
It's possible to include related entities by including in a 'with' property in userParams.

``` js
var userParams = {
  'page_limit':10
  'with':['strategies']
  };
t1.EntityList.get('campaigns', connection,  userParams).then(function(list) {this.pg1 = list});
t1.EntityList.getNextPage(pg1, connection).then(function(list) {this.pg2 = list});

for (var entity of pg1.entities) {console.log(entity)}
```

#### Targeting

##### Strategy Target Segments
To get a strategy's targeting segments:
``` js
var targetingSegmentsPromise = new t1.StrategyTargetSegments()
  .get(strategyId, connection)
  .then(function(targetingSegments) {this.targetingSegments = targetingSegments});
```  

To edit strategy targeting segments:
``` js
targetingSegments.include = [[1, 'OR']];
targetingSegments.exclude = [[119, 'OR']];
targetingSegments.include_op = 'OR';
targetingSegments.exclude_op = 'OR';
targetingSegments.save(connection).done(console.log('saved'));
```

##### Strategy Target Dimensions/Values
To get a strategy's targeting values:
``` js
var targetValuesPromise = new t1.StrategyTargetValues()
  .get(strategyId, connection)
  .then(function(targetValues) {this.targetValues = targetValues});
```  

To edit strategy targeting segments:
``` js
targetValues.include = [[1, 'OR']];
targetValues.addTargetValues('REGN', 'INCLUDE', 'OR', [23, 251]);
targetValues.save(connection).done(console.log('saved'));
```
=======
##### Strategy Audience Segments
To get a strategy's audience segments:
``` js
var audienceSegmentsPromise = new t1.StrategyAudienceegments()
  .get(strategyId, connection)
  .then(function(audienceSegments) {this.targetingSegments = targetingSegments});
```  

To edit strategy audience segments:
``` js
audienceSegments.include = [1405158];
audienceSegments.exclude = [1405158];
targetingSegments.include_op = 'OR';
targetingSegments.exclude_op = 'OR';
targetingSegments.save(connection).done(console.log('saved'));
```
