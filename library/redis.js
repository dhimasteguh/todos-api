const redis = require("redis");
const redisClient = redis.createClient({
  socket: {
    host: "localhost",
    port: 6379,
  },
});

redisClient.on("error", (error) => console.error(`Error : ${error}`));
redisClient.on("connect", () => console.error(`Redis Ready`));
redisClient.connect();
async function get(key) {
  const data = await redisClient.get(key);
  // console.log("Success get cache", key, data);
  return data;
}
function set(key, value) {
  // console.log("Success set cache", key, value);
  redisClient.setEx(key, 60, value);
}
function del(key) {
  redisClient.del(key);
}
async function redisHandler(key, cb) {
  var reply = await get(key);
  if (reply) return JSON.parse(reply);
  const result = await cb;
  if (result[0] >= 200 && result[0] <= 300) set(key, JSON.stringify(result));
  return result;
}
module.exports.get = get;
module.exports.set = set;
module.exports.del = del;
module.exports.redisHandler = redisHandler;
