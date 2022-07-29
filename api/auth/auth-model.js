const db = require('../../data/dbConfig')

module.exports = {
    add,
    findById,
    findBy
}
function findBy(filter) {
    return db("users")
      .select("users.id", "users.username", "users.password")
      .where(filter)
  }
async function add(user){
    const [id] = await db('users').insert(user)
    return findById(id)
}
function findById(id) {
    return db("users")
      .where("users.id", id)
      .first()
  }