import { getError, toPlainJs } from 'rqlite-js/lib/api/results';

import Promise from 'bluebird';
import connect from 'rqlite-js/lib/api/data/client';

export default class rqliteAdapter {
  static get connectionString() {
    return this.connectionString;
  }

  static set connectionString(connectionString) {
    this.connectionString = connectionString;
  }

  static connect(connectionString) {
    return new Promise((resolve, reject) => {
      connect(connectionString).then(api => {
        this.api = api
        return resolve(api)
      }).catch(error => {
        reject(error)
      })
    })
  }

  static getMethod(sql) {
    const api = this.api;
    const lowerSql = sql.toLowerCase();
    if (lowerSql.startsWith('insert')) {
      return api.insert;
    }
    if (lowerSql.startsWith('update')) {
      return api.update;
    }
    if (lowerSql.startsWith('delete')) {
      return api.delete;
    }
    if (lowerSql.startsWith('create')) {
      return api.table.create;
    }
    if (lowerSql.startsWith('drop')) {
      return api.table.drop;
    }
    return api.select;
  }

  static exec(connectionString, sql) {
    return new Promise((resolve, reject) => {
      this.connect(connectionString).then(api => {
        const method = this.getMethod(sql);
          const res = method(sql).then(res => {
          const results = res.body.results;
          const error = getError(results);
          if (error) {
            return reject(error);
          }
          const data = toPlainJs(results);
          return resolve(data)
        }).catch(err => {
          return reject(err)
        })
      })
    })
  }
}
