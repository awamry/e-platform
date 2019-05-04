const Sequelize = require('sequelize')
const db = require('../config/database')
const Games = require('../models/Games')

const Questions = db.define(
  'questions',
  {
    question: {
      type: Sequelize.STRING,
      allowNull: false
    },
    answer: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  {
    timestamps: false
  }
)

Games.hasMany(Questions)

module.exports = Questions
