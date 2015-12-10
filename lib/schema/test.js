var fs = require('fs');
var path = require('path');
var lol = path.resolve('.');
console.log(lol);
var agency = {
   "data" : {
      "organization_id" : 100048,
      "status" : true,
      "version" : 0,
      "dmp_enabled" : "inherits",
      "name" : ". B r a d e n",
      "allow_x_adv_pixels" : true,
      "updated_on" : "2015-10-06T04:12:53+0000",
      "created_on" : "2015-10-06T04:12:53+0000",
      "entity_type" : "agency",
      "id" : 110790,
      "allow_x_adv_optimization" : false
   },
   "meta" : {
      "etag" : "aafd131656ae283bfc53e3749c085189d0c396f6",
      "called_on" : "2015-10-20T13:03:00+0000",
      "status" : "ok"
   }
};

var Validator = require('uujsonschema').Validator;
var v = new Validator();

var schemaContent = fs.readFileSync("container_single.json", "utf8");
var schema = JSON.parse(schemaContent);
v.addSchema(schema);

console.log(v.unresolvedRefs);
