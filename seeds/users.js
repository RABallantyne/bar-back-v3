exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("users").insert([
        { username: "Joe", email: "joe@mail.com", password: "123456" },
        { username: "Bob", email: "bob@mail.com", password: "123456" },
        { username: "Julia", email: "julia@mail.com", password: "123456" }
      ]);
    });
};
