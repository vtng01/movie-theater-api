const request = require("supertest");
const seed = require("../src/db/seed");
const { Show } = require("../src/models");
const app = require("../src/server");

describe("testing /shows router", () => {
  beforeEach(async () => {
    await seed();
  });
  test("health endpoint returns code 200", async () => {
    const res = await request(app).get("/shows/health");
    expect(res.statusCode).toBe(200);
  });

  test("/shows get request gets list of shows", async () => {
    const res = await request(app).get("/shows");
    expect(res._body.length).toBe(11);
    expect(res.statusCode).toBe(200);
  });

  test("/shows/1 get request returns the show record with id 1", async () => {
    const res = await request(app).get("/shows/1");

    expect(res._body.id).toBe(1);
    expect(res._body.title).toEqual("King of Queens");
  });

  test("/shows/not a valid id get request returns the code 404", async () => {
    const res = await request(app).get("/shows/not a valid id");

    expect(res.statusCode).toBe(404);
  });

  test("/shows/genres/Comedy get request will return the of all shows with genre Comedy", async () => {
    const res = await request(app).get("/shows/genres/Comedy");

    expect(res._body.length).toBe(4);
  });

  test("/shows/genres/genreWithNoShows get request will return code 404", async () => {
    const res = await request(app).get("/shows/genres/genreWithNoShows");

    expect(res.statusCode).toBe(404);
  });

  test("/shows/1/watched put request can update rating of the show with id 1", async () => {
    let show = await Show.findByPk(1);
    const ratingBefore = await show.rating;

    await request(app).put("/shows/1/watched").send({
      rating: 10,
    });
    show = await Show.findByPk(1);

    expect(show.rating).not.toBe(ratingBefore);
    expect(show.rating).toBe(10);
  });

  test("/shows/1/watched will result in status code 400 due to invalid rating input", async () => {
    let show = await Show.findByPk(1);
    const ratingBefore = await show.rating;

    const result = await request(app).put("/shows/1/watched").send({
      rating: 100,
    });

    expect(result.statusCode).toBe(400);
  });

  test("/shows/notashowid/watched will result in code 404 as no show is found to update", async () => {
    const result = await request(app).put("/shows/notashowid/watched").send({
      rating: 7,
    });

    expect(result.statusCode).toBe(404);
  });

  test("/shows/1/updates can update status of a movie", async () => {
    let show = await Show.findByPk(1);
    const statusBefore = await show.status;

    await request(app).put("/shows/1/updates").send({
      status: "cancelled",
    });

    show = await Show.findByPk(1);

    expect(show.status).not.toEqual(statusBefore);
    expect(show.status).toEqual("cancelled");
  });

  test("/shows/1/updates results in status code 400 due to invalid status input", async () => {
    let show = await Show.findByPk(1);

    const result = await request(app).put("/shows/1/updates").send({
      status: "not a valid status input",
    });

    expect(result.statusCode).toBe(400);
  });

  test('/shows/1/updates will result in code 400 when the status is not "on-going" or "cancelled" ', async () => {
    const result = await request(app).put("/shows/1/updates").send({
      status: "noneoftheabove",
    });

    expect(result.statusCode).toBe(400);
  });

  test("/shows/1 can delete show with id 1 from db", async () => {
    const show1Before = await Show.findByPk(1);

    await request(app).delete("/shows/1");

    const show1After = await Show.findByPk(1);

    expect(show1Before).not.toBeNull();
    expect(show1Before).not.toBe(show1After);
    expect(show1After).toBeNull();
  });
});
