const { createClient } = require("redis");

let redisClient;

async function connectToRedisClient() {
  redisClient = await createClient()
    .on("error", (err) => console.log("Redis Client connection error " + err))
    .connect();
}

async function getRedisClient() {
  if (!redisClient) {
    await connectToRedisClient();
  }
  return redisClient;
}

module.exports = { getRedisClient };
