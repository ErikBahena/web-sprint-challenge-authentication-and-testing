const server = require("../api/server");
const request = require("supertest");
const db = require("../data/dbConfig");

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

beforeEach(async () => {
  await db.seed.run();
});

afterAll(async () => {
  await db.destroy();
});

describe("sanity check", () => {
  test("environment is correct", () => {
    expect(process.env.NODE_ENV).toBe("testing");
  });
});

describe("api/auth endpoints", () => {
  describe("api/auth/register", () => {
    test("[POST] missing username or password returns the proper error in the res.body", async () => {
      const res = await request(server)
        .post("/api/auth/register")
        .send({ username: "" });

      expect(res.body).toMatchObject({
        message: "username and password required",
      });
    });

    test("[POST] returns newly created user with encrypted password", async () => {
      const res = await request(server)
        .post("/api/auth/register")
        .send({ username: "erik", password: "1234" });

      const passwordsAreDifferent = res.body.password !== "1234";

      expect(passwordsAreDifferent).toBeTruthy();

      expect(res.body).toMatchObject({
        id: 1,
        username: "erik",
      });
    });

    test("[POST] if user already exists, returns correct error message", async () => {
      await request(server)
        .post("/api/auth/register")
        .send({ username: "erik", password: "1234" });

      const res = await request(server)
        .post("/api/auth/register")
        .send({ username: "erik", password: "1234" });

      expect(res.body).toMatchObject({
        message: "username taken",
      });
    });
  });

  describe("api/auth/login", () => {
    test("[POST] login: if username is not found in database, proper error message is returned", async () => {
      const res = await request(server)
        .post("/api/auth/login")
        .send({ username: "erk", password: "1234" });

      expect(res.body).toMatchObject({
        message: "invalid credentials",
      });
    });

    test("[POST] login: if the username or password are not the same as those related to a user, the proper error message is returned", async () => {
      await request(server)
        .post("/api/auth/register")
        .send({ username: "erik", password: "1234" });

      const res = await request(server)
        .post("/api/auth/login")
        .send({ username: "erk", password: "1234" });

      expect(res.body).toMatchObject({
        message: "invalid credentials",
      });
    });
    test("[POST] login: if the username and password match, a welcome message is returned, along with a json web token", async () => {
      await request(server)
        .post("/api/auth/register")
        .send({ username: "erik", password: "1234" });

      const res = await request(server)
        .post("/api/auth/login")
        .send({ username: "erik", password: "1234" });

      expect(res.body).toMatchObject({
        message: "welcome, erik",
      });
      expect(res.body).toHaveProperty("token");
    });
  });
});

describe("api/jokes endpoint", () => {
  test("[GET] if missing a token, responds with the proper message", async () => {
    const res = await request(server).get("/api/jokes");

    expect(res.body).toMatchObject({
      message: "token required",
    });
  });

  test("[GET] if token is invalid, responds with the proper message", async () => {
    const res = await request(server)
      .get("/api/jokes")
      .set("authorization", "aosdfpoijp2o3isdf32");

    expect(res.body).toMatchObject({
      message: "token invalid",
    });
  });

  test("[GET] if token is valid, responds with jokes", async () => {
    await request(server)
      .post("/api/auth/register")
      .send({ username: "erik", password: "1234" });

    const loginRes = await request(server)
      .post("/api/auth/login")
      .send({ username: "erik", password: "1234" });

    const jokesRes = await request(server)
      .get("/api/jokes")
      .set("authorization", loginRes.body.token);

    expect(jokesRes.body).toMatchSnapshot();
  });
});
