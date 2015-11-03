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
``` js
var connection = t1.T1Connection(config, console.log);
var agencyPromise = t1.Entity('agency', connection, 1234).then(function(agency) {this.agency = agency});
agency.data.name = 'new name';
agency.save().done(console.log('saved');
```

##### Entity Lists
``` js
var service = new t1.Service(t1conf);
var userParams = {
  'endpoint': 'campaigns',
  'count':10
  };
service.get(userParams,  console.log);
```