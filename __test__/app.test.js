const endpointsJson = require("../endpoints.json");
const db = require("../db/connection");
const { userData, storeData, reviewData } = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const Test = require("supertest/lib/test");

beforeEach(() => {
  return seed({ userData, storeData, reviewData });
});

afterAll(() => {
  return db.end();
});

describe("GET /api/reviews", () => {
  test("returns all reviews", () => {
    return request(app)
      .get("/api/reviews")
      .then((res) => {
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.reviews)).toBe(true);
        if (res.body.reviews.length > 0) {
          const review = res.body.reviews[0];
          expect(review).toHaveProperty("review_id");
          expect(review).toHaveProperty("fruit");
          expect(review).toHaveProperty("body");
          expect(review).toHaveProperty("rating");
          expect(review).toHaveProperty("store_id");
          expect(review).toHaveProperty("uid");
        }
      });
  });
  test("returns reviews for a given store id", () => {
    return request(app)
      .get("/api/reviews/1")
      .then((res) => {
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.reviews)).toBe(true);
        if (res.body.reviews.length > 0) {
          const review = res.body.reviews[0];
          expect(review).toHaveProperty("review_id");
          expect(review).toHaveProperty("fruit");
          expect(review).toHaveProperty("body");
          expect(review).toHaveProperty("rating");
          expect(review).toHaveProperty("store_id");
          expect(review).toHaveProperty("uid");
        }
      });
  });
  /*test("creates new review with required properties", () => {
    const newReview = {
      fruit: "Lime",
      body: "limey",
      rating: 5,
      store_id: 1,
      uid: 1,
    };
    return request(app)
      .post("/api/reviews")
      .send(newReview)
      .then((res) => {
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("review");
        expect(res.body.review).toMatchObject(newReview);
        expect(res.body.review).toHaveProperty("review_id");
      });
  });*/
});
