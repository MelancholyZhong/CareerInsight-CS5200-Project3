const { MongoClient } = require("mongodb");

// Connection URI
const uri = "mongodb://localhost:27017";

// Database Name
const dbName = "career_insight";

const connectToClient = () => {
  const client = new MongoClient(uri);
  return client;
};

const getDB = (client) => {
  return client.db(dbName);
};

const closeClient = (client) => {
  client.close();
};

module.exports = {
  connectToClient,
  closeClient,
  getDB,
};
