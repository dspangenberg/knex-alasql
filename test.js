var Knex = require('knex');
var client = require('./lib');

var knexClient = Knex({
  client: client,
  rqliteConnection: 'http://localhost:4001',
  useNullAsDefault: true
})

knexClient('contacts').where('gender', 1).then(data => {
  // console.log(data)
})

