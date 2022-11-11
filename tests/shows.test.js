const request = require("supertest");
const seed = require("../src/db/seed");
const { Show } = require("../src/models");
const app = require("../src/server");

describe("testing /shows router", () => {
  beforeAll(async () => {
    await seed();
  });
  test("GET /shows/health endpoint returns code 200", async () => {
    const res = await request(app).get("/shows/health");
    expect(res.statusCode).toBe(200);
  });

  test("GET /shows get request gets list of shows", async () => {
    const res = await request(app).get("/shows");
    expect(res._body.length).toBe(11);
    expect(res.statusCode).toBe(200);
  });

  test("GET /shows/1 get request returns the show record with id 1", async () => {
    const res = await request(app).get("/shows/1");

    expect(res._body.id).toBe(1);
    expect(res._body.title).toEqual("King of Queens");
  });

  test("GET /shows/not a valid id get request returns the code 404", async () => {
    const res = await request(app).get("/shows/not a valid id");

    expect(res.statusCode).toBe(404);
  });

  test("GET /shows/genres/Comedy get request will return the of all shows with genre Comedy", async () => {
    const res = await request(app).get("/shows/genres/Comedy");

    expect(res._body.length).toBe(4);
  });

  test("GET /shows/genres/genreWithNoShows get request will return code 404", async () => {
    const res = await request(app).get("/shows/genres/genreWithNoShows");

    expect(res.statusCode).toBe(404);
  });

  test("GET /shows/genres get request will return list of genres", async () => {
    const res = await request(app).get("/shows/genres");

    expect(res._body).toEqual(Show.getAttributes().genre.values);
  });

  test("PUT /shows/1/watched put request can update rating of the show with id 1", async () => {
    let show = await Show.findByPk(1);
    const ratingBefore = await show.rating;

    await request(app).put("/shows/1/watched").send({
      rating: 10,
    });
    show = await Show.findByPk(1);

    expect(show.rating).not.toBe(ratingBefore);
    expect(show.rating).toBe(10);
  });

  test("PUT /shows/1/watched will result in status code 400 due to invalid rating input", async () => {
    let show = await Show.findByPk(1);
    const ratingBefore = await show.rating;

    const result = await request(app).put("/shows/1/watched").send({
      rating: 100,
    });

    expect(result.statusCode).toBe(400);
  });

  test("PUT /shows/notashowid/watched will result in code 404 as no show is found to update", async () => {
    const result = await request(app).put("/shows/notashowid/watched").send({
      rating: 7,
    });

    expect(result.statusCode).toBe(404);
  });

  test("PUT /shows/1/updates can update status of a movie", async () => {
    let show = await Show.findByPk(1);
    const statusBefore = await show.status;

    await request(app).put("/shows/1/updates").send({
      status: "cancelled",
    });

    show = await Show.findByPk(1);

    expect(show.status).not.toEqual(statusBefore);
    expect(show.status).toEqual("cancelled");
  });

  test("PUT /shows/1/updates results in status code 400 due to invalid status input", async () => {
    let show = await Show.findByPk(1);

    const result = await request(app).put("/shows/1/updates").send({
      status: "not a valid status input",
    });

    expect(result.statusCode).toBe(400);
  });

  test('PUT /shows/1/updates will result in code 400 when the status is not "on-going" or "cancelled" ', async () => {
    const result = await request(app).put("/shows/1/updates").send({
      status: "noneoftheabove",
    });

    expect(result.statusCode).toBe(400);
  });

  test("DELETE /shows/1 can delete show with id 1 from db", async () => {
    const show1Before = await Show.findByPk(1);

    await request(app).delete("/shows/1");

    const show1After = await Show.findByPk(1);

    expect(show1Before).not.toBeNull();
    expect(show1Before).not.toBe(show1After);
    expect(show1After).toBeNull();
  });

  test("DELETE /shows/9001 will return code 404 when show id not found in system", async () => {
    const result = await request(app).delete("/shows/9001");
    expect(result.statusCode).toBe(404);
  });
});
