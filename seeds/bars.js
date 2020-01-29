exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex("bars")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("bars").insert([
        { barname: "test bar 1", users_id: 1 },
        { barname: "test bar 2", users_id: 1 },
        { barname: "test bar 3", users_id: 2 },
        { barname: "test bar 4", users_id: 3 }
      ]);
    });
};
