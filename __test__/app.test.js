const db = require("../db/connection");
const endpointsJson = require("../endpoints.json");
const { userData, storeData, reviewData } = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");

beforeEach(() => {
  return seed({ userData, storeData, reviewData });
});

afterAll(() => db.end());

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
  test("creates new review with required properties", () => {
    const newReview = {
      fruit: "Lime",
      body: "limey",
      rating: 5,
      store_id: "1",
      uid: "1",
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
  });
});

describe("GET /api", () => {
  test("200: Responds with an object detailing all the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/users", () => {
  test("200: Responds with an object with a key of users and a value of an array of user objects, each of which should have a uid, username and avatar_url", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users.length).toBe(5);
        users.forEach((user) => {
          expect(typeof user.uid).toBe("string");
          expect(typeof user.username).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
});

describe("GET /api/users/:uid", () => {
  test("200: Responds with an object with a key of user and a value of the requested user object which whould have the following properties, uid, username, avatar_url", () => {
    return request(app)
      .get("/api/users/1")
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user.uid).toBe("1");
        expect(user.username).toBe("LemonLover1977");
        expect(user.avatar_url).toBe(
          "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
        );
      });
  });
});

describe("GET /api/users/:uid/reviews", () => {
  test("200: Responds with all the reviews for a given user", () => {
    return request(app)
      .get("/api/users/1/reviews")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews.length).toBe(2);
        expect(reviews[0].review_id).toBe(2);
        expect(reviews[1].review_id).toBe(3);
        reviews.forEach((review) => {
          expect(typeof review.uid).toBe("string");
          expect(typeof review.fruit).toBe("string");
          expect(typeof review.rating).toBe("number");
        });
      });
  });
});
