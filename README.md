t1-node
=======

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/1ed36fa05e24460490ac44b3ff1e3307)](https://www.codacy.com/app/fsargent/t1-node?utm_source=github.com&utm_medium=referral&utm_content=MediaMath/t1-node&utm_campaign=badger)

Node implementation of a T1 API Library. Uses [Bluebird](http://bluebirdjs.com/docs/getting-started.html) for fast, simple callback handling via promises.

### Compilation/Installation
#### From npm
` npm install @mediamath/terminalone `
#### From source
Checkout, then `npm install .`

# Usage

T1 Node uses dotenv for easy management of environment variables. Copy .env.template to .env and fill in your details. 

To get an API key, see https://apidocs.mediamath.com

# Cookie Authentication (default):

Required Env variables:
`T1_API_USERNAME`
`T1_API_PASSWORD`
`T1_API_KEY`

``` js
var t1 = require('@mediamath/terminalone');
var config = {
  preferCookieAuth: true,
  user: process.env.T1_API_USERNAME,
  password: process.env.T1_API_PASSWORD,
  api_key: process.env.T1_API_KEY
  };
var connection = new t1.T1Connection(config);
```

## OAuth2 (Password - Resource Owner flow):

T1 Node is designed to be used for scripts. If you wish to make a UI for 3rd parties, we recommend use use the Application Code flow, which may require a little more engineering than what's covered here.
Note: As of 2017-06-29 OAuth2 is not available everywhere within the MediaMath environment. Until then, for production, we recommend using the Cookie flow. This message will be updated with more services as the rollout completes.

```
t1conf = {
    preferCookieAuth: false,
    user: process.env.T1_API_USERNAME,
    password: process.env.T1_API_PASSWORD,
    client_id: process.env.T1_CLIENT_ID,
    client_secret: process.env.T1_CLIENT_SECRET,
};
var connection = new t1.T1Connection(config);
```



#### Single Entities

Retrieve, edit and save a single entity

``` js
var agencyPromise = new t1.Entity('agency')
  .get(1234, connection)
  .then(function(agency) {
    agency = agency;
    agency.name = 'new name';
    return agency.save(connection)
    })
    .then(function () {
      console.log('saved')})
    .catch(error => console.log(error));
```

##### Entity Lists

Returns a generator to entities

``` js
var userParams = {
  'page_limit':10
  };
var that = this;
t1.EntityList.get('campaigns', connection,  userParams)
.then(function(list) {
  that.pg1 = list;
  return t1.EntityList.getNextPage(pg1, connection)
  })
    .then(function(list) {
    that.pg2 = list;
    for (var entity of list.entities) {console.log(entity)}});
  
```


###### Related entities
It's possible to include related entities by including in a 'with' property in userParams.

``` js
var userParams = {
  'page_limit':10,
  'with':['strategies']
  };
var that = this;
t1.EntityList.get('campaigns', connection,  userParams).then(function(list) {
  that.pg1 = list;
  for (var entity of list.entities) {console.log(entity)}});
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
targetingSegments.save(connection).then(function () { console.log('saved') });
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
targetValues.save(connection).then(function () { console.log('saved') });
```

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
targetingSegments.save(connection).then(function () { console.log('saved') });
```

#### Basic Reporting

To get a list of all reports provided by the MediaMath Reports API:

``` js
var metaReport = new t1.Report('meta');
metaReport.getMeta(conn).then(
    function(report) {
        console.log(report)
    },
    function(error) {
        console.log(error.message)
    });
```

To get a report with parameters:

``` js
var performanceReport = new t1.Report('performance');
performanceReport.get(conn, {
    time_window: 'yesterday',
    time_rollup: 'by_day',
    dimensions: 'advertiser_id',
    filter: 'organization_id=???'
}).then(
    function(report) {
        console.log(report)
    },
    function(error) {
        console.log(error.message)
    });
```

To get a report's metadata, which specifies fields and parameters:

``` js
performanceReport.getMeta(conn).then(
    function(report) {
        console.log(report)
    },
    function(error) {
        console.log(error.message)
    });
```

## Tests

`npm test` will run local tests.

To run integration tests, copy `.env.template` to `.env` and fill in the required values.

`npm run integration` will run integration tests with Mocha.