const db = require("../db/connection");
const endpointsJson = require("../endpoints.json");
const { userData, storeData, reviewData } = require("../db/data/test-data");
const request = require("supertest");
const seed = require("../db/seeds/seed");

beforeEach(() => {
  return seed({ userData, storeData, reviewData });
});

afterAll(() => db.end());

describe("POST - /api/reviews creates new review with required properties", () => {
  let app;
  beforeAll(() => {
    jest.resetModules();
    jest.mock("firebase-admin", () => ({
      apps: [],
      initializeApp: jest.fn(),
      credential: {
        cert: jest.fn(() => ({})),
      },
      auth: () => ({
        verifyIdToken: jest.fn(() => Promise.resolve({ uid: "test-uid" }))
      })
    }));
    app = require('../app');
  })
  test('creates new review with required properties', () => {
    const newReview = {
      fruit: "Lime",
      body: "limey",
      rating: 5,
      store_id: "1",
    };
    return request(app)
      .post("/api/reviews")
      .set("Authorization", "Bearer faketoken")
      .send(newReview)
      .then((res) => {
        console.log(res.body);
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("review");
        expect(res.body.review).toMatchObject(newReview);
        expect(res.body.review).toHaveProperty("review_id");
      });

  })
  });