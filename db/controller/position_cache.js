const {
  getPositions,
  updatePosition,
  deletePosition,
  addPosition,
} = require("./position_controller");

const { getRedisClient } = require("../../redisUtils");

async function getCachedPositions() {
  const redisClient = await getRedisClient();
  try {
    const curLength = await redisClient.LLEN("cache:positions"); //get the length of cached positions
    if (curLength < 10) {
      const newPositions = await getPositions(curLength); //get more from persistent storage
      await cachePositions(newPositions); //cache the newly got positions
    }
    const position_ids = await redisClient.lRange("cache:positions", 0, 9); //only show 10
    const positions = Promise.all(
      position_ids.map(async (position_id) => {
        return await getCachedPositionById(position_id);
      })
    );
    return positions;
  } catch (err) {
    console.error("Error:", err);
  }
}

async function cachePositions(positions) {
  const redisClient = await getRedisClient();
  try {
    await positions.forEach(async (position) => {
      await redisClient.rPush(
        "cache:positions",
        position.position_id.toString()
      ); //only when we get backup positions, we push to the right of the cache
      await cachePosition(position);
    });
  } catch (err) {
    console.error("Error:", err);
  }
}

async function cachePosition(position) {
  try {
    //transform the object to key-values
    await saveDetails(position.position_id, position);
    await saveSalary(position.position_id, position.salary);
  } catch (err) {
    console.error("Error:", err);
  }
}

async function saveDetails(position_id, position) {
  const redisClient = await getRedisClient();
  try {
    await redisClient.set(`position:${position_id}:title`, position.title);
    await redisClient.set(`position:${position_id}:company`, position.company);
    await redisClient.set(
      `position:${position_id}:job_catagory`,
      position.job_catagory
    );
  } catch (err) {
    console.error("Error:", err);
  }
}

async function saveSalary(position_id, salary) {
  const redisClient = await getRedisClient();
  try {
    await redisClient.hSet(`position:${position_id}:salary`, {
      base_salary: salary.base_salary,
      bonus: salary.bonus,
      equity: salary.equity,
    });
  } catch (err) {
    console.error("Error:", err);
  }
}

//get function for the cached positions
async function getCachedPositionById(position_id) {
  const redisClient = await getRedisClient();
  try {
    const position = {
      position_id,
      title: await redisClient.get(`position:${position_id}:title`),
      company: await redisClient.get(`position:${position_id}:company`),
      job_catagory: await redisClient.get(
        `position:${position_id}:job_catagory`
      ),
      salary: await redisClient.hGetAll(`position:${position_id}:salary`),
    };
    return position;
  } catch (err) {
    console.error("Error:", err);
  }
}

//update function for both the cache and persistant
async function updateCachedPositionById(position_id, position) {
  const redisClient = await getRedisClient();
  try {
    await redisClient.lRem("cache:positions", 1, position_id);
    await redisClient.lPush("cache:positions", position_id); //move the id to the front

    await saveDetails(position_id, position);
    await saveSalary(position_id, position);
    await updatePosition(position_id, position); //persist update
  } catch (err) {
    console.error("Error:", err);
  }
}

//delete a position by id
async function deleteCachedPositionById(position_id) {
  const redisClient = await getRedisClient();
  try {
    await redisClient.lRem("cache:positions", 1, position_id);
    await redisClient.del(`position:${position_id}:title`);
    await redisClient.del(`position:${position_id}:company`);
    await redisClient.del(`position:${position_id}:job_catagory`);
    await redisClient.del(`position:${position_id}:salary`);
    await deletePosition(position_id); //persist delete
  } catch (err) {
    console.error("Error:", err);
  }
}

async function addCachedPosition(position) {
  const redisClient = await getRedisClient();
  try {
    const position_id = position.id;
    await redisClient.lPush("cache:positions", position_id); //add to the front of the list

    await saveDetails(position_id, position);
    await saveSalary(position_id, position);
    await addPosition(position); //persist add
  } catch (err) {
    console.error("Error:", err);
  }
}

module.exports = {
  getCachedPositions,
  getCachedPositionById,
  updateCachedPositionById,
  deleteCachedPositionById,
  addCachedPosition,
};
