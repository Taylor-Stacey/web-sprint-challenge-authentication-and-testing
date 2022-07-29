const db = require('../../data/dbConfig')

module.exports = {
    add,
    findById
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