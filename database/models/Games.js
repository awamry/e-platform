const Sequelize = require('sequelize')
const db = require('../config/database')
const Users = require('../models/Users')
const Games = db.define(
  'games',
  {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  {
    timestamps: false
  }
)

Users.hasMany(Games)

module.exports = Games
