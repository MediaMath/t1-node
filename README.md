t1-node
=======

Node implementation of a T1 API Library

### Compilation/Installation
Checkout, then `npm install .`

### Usage
``` js
var t1 = require('mmt1');
var config = {
  'username': t1_username,
  'password': t1_user_password,
  'api_key': application_mashery_key
};
var api = t1.T1Connection(config, console.log);
var agency = t1.Entity('agency', api, 1234);
agency.data.name = 'new name';
agency.save();
```