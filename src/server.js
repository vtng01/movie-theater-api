const express = require("express");
const usersRouter = require("./routes/users");
const seed = require("./db/seed");
const showsRouter = require("./routes/shows");
const app = express();
const port = 3000;

app.use(express.json());
app.use("/users", usersRouter);
app.use("/shows", showsRouter);

// app.listen(port, async () => {
//   console.log(`listening to port: ${port}`);
//   await seed();
// });

module.exports = app;
