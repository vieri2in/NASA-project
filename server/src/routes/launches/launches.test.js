const request = require("supertest");
const app = require("../../app");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo");
beforeAll(async () => {
  await mongoConnect();
});
afterAll(async () => {
  await mongoDisconnect();
});
describe("Test GET /launches", () => {
  test("It should respond with 200 success", async () => {
    const response = await request(app)
      .get("/launches")
      .expect("Content-Type", /json/)
      .expect(200);
    // expect(response.statusCode).toBe(200);
  });
});
describe("Test POST /launches", () => {
  const completeLaunch = {
    mission: "Mission one",
    rocket: "Rocket one",
    target: "Kepler-1649 b",
    launchDate: "January 2, 2020",
  };
  const incompleteLaunch = {
    mission: "Mission one",
    rocket: "Rocket one",
    target: "Kepler-1649 b",
  };
  const launchWithInvailDate = {
    mission: "Mission one",
    rocket: "Rocket one",
    target: "Kepler-1649 b",
    launchDate: "hello world",
  };
  test("It should respond with 201 created", async () => {
    const response = await request(app)
      .post("/launches")
      .send(completeLaunch)
      .expect("Content-Type", /json/)
      .expect(201);
    const requestLaunchDate = new Date(completeLaunch.launchDate).valueOf();
    const responseLaunchDate = new Date(response.body.launchDate).valueOf();
    expect(responseLaunchDate).toBe(requestLaunchDate);
    expect(response.body).toMatchObject(incompleteLaunch);
  });
  test("It should catch missing required properties", async () => {
    const response = await request(app)
      .post("/launches")
      .send(incompleteLaunch)
      .expect("Content-Type", /json/)
      .expect(400);
    expect(response.body).toStrictEqual({
      error: "Missing required launch property",
    });
  });
  test("It should catch invalid dates", async () => {
    const response = await request(app)
      .post("/launches")
      .send(launchWithInvailDate)
      .expect("Content-Type", /json/)
      .expect(400);
    expect(response.body).toStrictEqual({
      error: "Invalid launch date",
    });
  });
});
