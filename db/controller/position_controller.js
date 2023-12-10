const { connectToClient, closeClient, getDB } = require("../../mongoUtils");

//get the positions (newest first so that we can see the newly inserted ones)
async function getPositions(start) {
  const client = connectToClient();
  try {
    const db = getDB(client);
    //Display 10 positions
    const positions = await db
      .collection("positions")
      .find({})
      .sort({ _id: -1 })
      .skip(start)
      .limit(10 - start)
      .toArray();
    return positions;
  } catch (err) {
    console.error("Error:", err);
  } finally {
    closeClient(client);
  }
}

//get position by id, used for edit
async function getPosition(position_id) {
  const client = connectToClient();
  try {
    const db = getDB(client);
    //get position by id
    const position = await db
      .collection("positions")
      .findOne({ position_id: +position_id });
    return position;
  } catch (err) {
    console.error("Error:", err);
  } finally {
    closeClient(client);
  }
}

//updatde a position
async function updatePosition(position_id, position) {
  const client = connectToClient();
  try {
    const db = getDB(client);
    const update = {
      $set: {
        title: position.title,
        company: position.company,
        job_catagory: position.job_catagory,
        "salary.base_salary": position.base_salary,
        "salary.bonus": position.bonus,
        "salary.equity": position.equity,
      },
    };
    //update position by id
    const result = await db
      .collection("positions")
      .updateOne({ position_id: +position_id }, update);
    return result;
  } catch (err) {
    console.error("Error:", err);
  } finally {
    closeClient(client);
  }
}

//delete a position by id
async function deletePosition(position_id) {
  const client = connectToClient();
  try {
    const db = getDB(client);
    //get position by id
    const result = await db
      .collection("positions")
      .deleteOne({ position_id: +position_id });
    return result;
  } catch (err) {
    console.error("Error:", err);
  } finally {
    closeClient(client);
  }
}

// add a position
async function addPosition(position) {
  const newPosition = {
    position_id: +position.id,
    title: position.title,
    company: position.company,
    job_catagory: position.job_catagory,
    salary: {
      base_salary: position.base_salary,
      bonus: position.bonus,
      equity: position.equity,
    },
  };
  const client = connectToClient();
  try {
    const db = getDB(client);
    const result = await db.collection("positions").insertOne(newPosition);
    return result;
  } catch (err) {
    console.error("Error:", err);
  } finally {
    closeClient(client);
  }
}

module.exports = {
  getPositions,
  getPosition,
  updatePosition,
  deletePosition,
  addPosition,
};
