const { Router } = require("express");
const { User, Show } = require("../models");

const usersRouter = Router();

usersRouter.get("/health", (req, res) => {
  res.sendStatus(200);
});

usersRouter.get("/", async (req, res) => {
  res.json(await User.findAll());
});

usersRouter.get("/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id);

  if (user) {
    res.json(user);
  } else {
    res.sendStatus(404);
  }
});

usersRouter.get("/:id/shows", async (req, res) => {
  let shows = await Show.findAll({
    where: {
      UserId: req.params.id,
    },
  });

  if (shows.length > 0) {
    res.json(shows);
  } else {
    res.sendStatus(404);
  }
});

usersRouter.put("/:id/shows/:showId", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    const show = await Show.findByPk(req.params.showId);

    await user.addShow(show);

    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(400);
  }
});

module.exports = usersRouter;
