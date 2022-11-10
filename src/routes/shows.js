const { Router } = require("express");
const { Show } = require("../models");
const { body, validationResult } = require("express-validator");
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

showsRouter.put(
  "/:id/watched",
  body("rating")
    .exists()
    .withMessage("please give a rating value")
    .isInt({ min: 0, max: 10 })
    .withMessage(
      "please give an integer value rating between 0 and 10 (whole numbers 1,2,3... etc and no spaces)"
    ),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

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
  }
);

showsRouter.put(
  "/:id/updates",
  body("status")
    .isLength({ min: 5, max: 25 })
    .withMessage("status length needs to be between 5 and 25 characters")
    .custom((e) => e.indexOf(" ") === -1)
    .withMessage("status cannot have white spaces"),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    const show = await Show.findByPk(req.params.id);
    if (["on-going", "cancelled"].indexOf(req.body.status) >= 0) {
      await show.update({
        status: req.body.status,
      });
      res.sendStatus(200);
    } else {
      res.sendStatus(400);
    }
  }
);

showsRouter.delete("/:id", async (req, res) => {
  const show = await Show.findByPk(req.params.id);

  if (show) {
    await show.destroy();
  }

  res.sendStatus(200);
});
module.exports = showsRouter;
