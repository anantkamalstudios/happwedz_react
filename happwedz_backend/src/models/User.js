
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: true },
    weddingVenue: { type: DataTypes.STRING, allowNull: true },
    country: { type: DataTypes.STRING, allowNull: true },
    city: { type: DataTypes.STRING, allowNull: true },
    weddingDate: { type: DataTypes.DATEONLY, allowNull: true },
}, {
    tableName: "Users",
    timestamps: true,
});

module.exports = User; // ✅ Must export the model
