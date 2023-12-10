let express = require("express");
let router = express.Router();

const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  addUser,
} = require("../db/controller/user_controller");

//getting all users to display
router.get("/", async function (req, res) {
  const users = await getUsers();
  res.render("userDisplay", { title: "All users (10 of them)", users });
});

//display user form
router.get("/:user_id/edit", async function (req, res) {
  const user_id = req.params.user_id;
  const user = await getUser(user_id);
  res.render("userForm", { title: "User details", user });
});

//post the changes
router.post("/:user_id/edit", async function (req, res) {
  const user_id = req.params.user_id;
  const user = req.body;
  const result = await updateUser(user_id, user);
  res.redirect("/users");
});

//delete route
router.get("/:user_id/delete", async function (req, res) {
  const user_id = req.params.user_id;
  const result = await deleteUser(user_id);
  res.redirect("/users");
});

//display the form
router.get("/add", async function (req, res) {
  res.render("userForm", { title: "Add a User", user: null });
});

//add the new user
router.post("/add", async function (req, res) {
  const user = req.body;
  const result = await addUser(user);
  res.redirect("/users");
});

module.exports = router;
