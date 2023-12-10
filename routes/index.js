let express = require("express");
let router = express.Router();

const { getCachedPositions } = require("../db/controller/position_cache");

//home page displays all the positions
router.get("/", async function (req, res) {
  const positions = await getCachedPositions();
  res.render("index", { title: "All postions (10 of them)", positions });
});

module.exports = router;
