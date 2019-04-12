require("dotenv").config();
const express = require("express");
const session = require("express-session");
const massive = require("massive");
const bodyParser = require("body-parser");
const authController = require("./server/controllers/authController");
const treasureController = require("./server/controllers/treasureController");
const auth = require("./middleware/authMiddleware");

const PORT = 4000;

const { SESSION_SECRET, CONNECTION_STRING } = process.env;

const app = express();

app.use(bodyParser.json());

massive(CONNECTION_STRING).then(db => {
  app.set("db", db);
  console.log("db connected");
});

app.use(session({
    resave: true,
    saveUninitialized: false,
    secret: SESSION_SECRET
  })
);
app.post("/auth/register", authController.register);
app.post("/auth/login", authController.login);
app.get("/auth/logout", authController.logout);

app.get("/api/treasure/dragon", treasureController.dragonTreasure);
app.get("/api/treasure/user", auth.usersOnly, treasureController.getUserTreasure);
app.post("/api/treasure/user", auth.usersOnly, treasureController.addUserTreasure);
app.get(
  "/api/treasure/all",
  auth.usersOnly,
  auth.adminsOnly,
  treasureController.getAllTreasure
);
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
