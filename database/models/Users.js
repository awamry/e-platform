const Sequelize = require('sequelize')
const db = require('../config/database')

const Users = db.define(
  'users',
  {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  {
    timestamps: false
  }
)

module.exports = Users
