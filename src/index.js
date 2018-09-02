import Client_SQLite3 from 'knex/lib/dialects/sqlite3'
import Knex from 'knex'
import Promise from 'bluebird';
import RqliteAdapter from './rqlite'
const {uniqueId} = require('lodash');

export default class Client_RQLite extends Client_SQLite3 {
  constructor(config) {
    super(config)
    this.config = config
    this.connectionString = config.rqliteConnection
  }

  get dialect() { return 'reqlite' }
  get driverName() { return 'reqlite' }

  _driver() {
    return require('./rqlite')
  }


  acquireConnection() {
    return Promise.resolve()
        .then(() => {
            return {
              __knexUid: uniqueId('__knexUid')
            }
        });
}
  // Used to explicitly close a connection, called internally by the pool
  // when a connection times out or the pool is shutdown.
  releaseConnection() {
    return Promise.resolve()
  }

  // Runs the query on the specified connection,
  // providing the bindings and any other necessary prep work.
  _query(connection, obj) {
    const that = this
    return new Promise(function(resolver, rejecter) {
      const sql = Knex(that.config).raw(obj.sql, obj.bindings)
      RqliteAdapter.exec(that.connectionString, sql.toString()).then(response => {
        obj.response = response
        resolver(obj)
      }).catch(error => {
        rejecter(error)
      })
    })
  }
}
