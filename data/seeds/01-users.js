exports.seed = function (knex, promise) {
  // Deletes ALL existing entries and resets ids
  return knex('users')
    .truncate()
    .then(function () {
      return knex('users').insert([
        { username: 'sam', password: '1234' },
      ]);
    });
};
