const { Router } = require("express");
const { Show } = require("../models");
const showsRouter = Router();

showsRouter.get("/", async (req, res) => {
  res.json(await Show.findAll());
});

showsRouter.get("/:id", async (req, res) => {
  const result = await Show.findByPk(req.params.id);

  if (result) {
    res.json(result);
  } else {
    res.sendStatus(404);
  }
});

showsRouter.get("/genres/:category", async (req, res) => {
  const result = await Show.findAll({
    where: {
      genre: req.params.category,
    },
  });

  if (result.length > 0) {
    res.json(result);
  } else {
    res.sendStatus(404);
  }
});

showsRouter.put("/:id/watched", async (req, res) => {
  const result = await Show.findByPk(req.params.id);
  console.log(req.body);
  if (result) {
    await result.update({
      rating: req.body.rating,
    });

    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

showsRouter.put("/:id/updates", async (req, res) => {
  const show = await Show.findByPk(req.params.id);
  if (["on-going", "cancelled"].indexOf(req.body.status) >= 0) {
    await show.update({
      status: req.body.status,
    });
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
});

showsRouter.delete("/:id", async (req, res) => {
  const show = await Show.findByPk(req.params.id);

  if (show) {
    await show.destroy();
  }

  res.sendStatus(200);
});
module.exports = showsRouter;
