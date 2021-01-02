
const { Sequelize } = require("sequelize");
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sql'
  });

(async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
      } catch (error) {
        console.error("Unable to connect to the database:", error);
      }
})()

// export const getItems = function (status, callback) {
//   //db.all(...
//   //callback(err,data) // if err return callback(err, null) els return (err, null)
// };

// export const createItems = function (data, callback) {
//   // data = {...}
//   //db.run(...)
//   //callback(err,data) // if err return callback(err, null) els return (err, null)
// };

// export const updateItems = function (id, data, callback) {
//   //id = number
//   // data = {...}
//   //db.run(...)
//   //callback(err,data) // if err return callback(err, null) els return (err, null)
// };

// export const changeStatusItems = function (id, callback) {
//   //id = number
//   //db.run(...)
//   //callback(err,data) // if err return callback(err, null) els return (err, null)
// };

// export const deleteItems = function (id, callback) {
//   //id = number
//   //db.run(...)
//   //callback(err,data) // if err return callback(err, null) els return (err, null)
// };

// run this functions by test file
//import { deleteItems, changeStatusItems ,... } from '../services'
