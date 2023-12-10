let express = require("express");
let router = express.Router();

const {
  getCachedPositionById,
  updateCachedPositionById,
  deleteCachedPositionById,
  addCachedPosition,
} = require("../db/controller/position_cache");

//display edit form
router.get("/:position_id/edit", async function (req, res) {
  const position_id = req.params.position_id;
  const position = await getCachedPositionById(position_id);
  res.render("positionForm", { title: "Position details", position });
});

//post the edit result
router.post("/:position_id/edit", async function (req, res) {
  const position_id = req.params.position_id;
  const position = req.body;
  await updateCachedPositionById(position_id, position);
  res.redirect("/");
});

//delete by id
router.get("/:position_id/delete", async function (req, res) {
  const position_id = req.params.position_id;
  await deleteCachedPositionById(position_id);
  res.redirect("/");
});

//display add form
router.get("/add", async function (req, res) {
  res.render("positionForm", { title: "Add a position", position: null });
});

//add the new position
router.post("/add", async function (req, res) {
  const position = req.body;
  await addCachedPosition(position);
  res.redirect("/");
});

module.exports = router;
