const request = require("supertest");
const seed = require("../src/db/seed");
const { User, Show } = require("../src/models");
const app = require("../src/server");

describe("testing /users router", () => {
  beforeEach(async () => {
    await seed();
  });

  test("health endpoint returns code 200", async () => {
    const res = await request(app).get("/users/health");
    expect(res.statusCode).toBe(200);
  });

  test("/users get request gets list of users", async () => {
    const res = await request(app).get("/users");
    expect(res._body.length).toBe(2);
    expect(res.statusCode).toBe(200);
  });

  test("/users/1 get request returns the user record with id 1", async () => {
    const res = await request(app).get("/users/1");

    expect(res._body.id).toBe(1);
    expect(res._body.username).toEqual("testUser@gmail.com");
  });

  test("/users/1/shows get request returns the shows of user record with id 1", async () => {
    const user = await User.findByPk(1);
    const resBefore = await request(app).get("/users/1/shows");
    await user.addShow(await Show.findByPk(1));

    const resAfter = await request(app).get("/users/1/shows");

    expect(resBefore.statusCode).toBe(404);
    expect(resAfter._body.length).toBe(1);
  });

  test("/users/2/shows get request returns code 404 as no shows are found", async () => {
    const res = await request(app).get("/users/2/shows");
    expect(res.statusCode).toBe(404);
  });

  test("/users/2/shows/1 will add the show with id 1 to user with id 2", async () => {
    const showsBefore = await Show.findAll({
      where: {
        UserId: 2,
      },
    });

    await request(app).put("/users/2/shows/1");

    const showsAfter = await Show.findAll({
      where: {
        UserId: 2,
      },
    });

    expect(showsBefore.length).toBe(0);
    expect(showsAfter.length).toBe(showsBefore.length + 1);
    expect(showsAfter[0].dataValues.id).toBe(1);
  });

  test("/users/notavalidid/shows/1 will result code 400", async () => {
    const res = await request(app).put("/users/notavalidid/shows/1");
    expect(res.statusCode).toBe(400);
  });
});
