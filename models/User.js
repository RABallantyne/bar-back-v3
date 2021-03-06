const Knex = require("knex");
const connection = require("../knexfile");
const { Model } = require("objection");

const knexConnection = Knex(connection);

Model.knex(knexConnection);

class User extends Model {
  static get tableName() {
    return "users";
  }
  static get relationMappings() {
    const Bar = require("./Bar");
    return {
      bars: {
        relation: Model.HasManyRelation,
        modelClass: Bar,
        join: {
          from: "users.id",
          to: "bars.users_id"
        }
      }
    };
  }
}

module.exports = User;
