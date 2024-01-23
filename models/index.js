const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize("postgres", "postgres", "postgresql", {
  host: "localhost",
  dialect: "postgres",
});

// Define User model
const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Define Product model
const Product = sequelize.define("Product", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

User.hasMany(Product, { as: "cart", foreignKey: "id" });
Product.belongsTo(User, { foreignKey: "id" });

// Synchronize the models with the database
sequelize.sync().then(() => {
  console.log("Database synchronized");
});

module.exports = {
  User,
  Product,
  sequelize,
};
