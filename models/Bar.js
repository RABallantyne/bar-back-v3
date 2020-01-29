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
    const Product = require("./Product");
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "bars.users_id",
          to: "users.id"
        }
      },
      products: {
        relation: Model.HasManyRelation,
        modelClass: Product,
        join: {
          from: "bars.id",
          to: "products.bars_id"
        }
      }
    };
  }
}

module.exports = Bar;
