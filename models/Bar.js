const Knex = require("knex");
const connection = require("../knexfile");
const { Model } = require("objection");

const knexConnection = Knex(connection);

Model.knex(knexConnection);

class Bar extends Model {
  static get tableName() {
    return "bars";
  }
  static get relationMappings() {
    const User = require("./User");
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "bars.users_id",
          to: "users.id"
        }
      }
    };
  }
}

module.exports = Bar;
