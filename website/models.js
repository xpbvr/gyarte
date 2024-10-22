const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('articleDB', 'root', '8ZO*!c8ua5V)', {
    host: '127.0.0.1',  // Use IPv4 loopback address instead of 'localhost'
    dialect: 'mariadb',
    port: 3306
});

const Article = sequelize.define('Article', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

module.exports = { Article };
