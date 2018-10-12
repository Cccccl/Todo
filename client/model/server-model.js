const config = require('../../config/app.config.js')
const createDb = require('../../server/db/db')

const db = createDb(config.db.appId, config.db.appKey)

export default {
  getAllTodos () {
    return db.getAllTodos()
  }
}
