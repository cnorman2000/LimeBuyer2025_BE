jest.mock("../firebase/firebaseAdmin", () => ({
  auth: () => ({
    verifyIdToken: jest.fn(() => Promise.resolve({ uid: "test-uid" })),
  }),
}));

const db = require("../db/connection");
const endpointsJson = require("../endpoints.json");
const { userData, storeData, reviewData } = require("../db/data/test-data");
const request = require("supertest");
const seed = require("../db/seeds/seed");
let app;

beforeAll(() => {
  app = require("../app");
});

beforeEach(() => {
  return seed({ userData, storeData, reviewData });
});

afterAll(() => db.end());

describe("POST - /api/reviews creates new review with required properties", () => {
  test("creates new review with required properties", () => {
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
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("review");
        expect(res.body.review).toMatchObject(newReview);
        expect(res.body.review).toHaveProperty("review_id");
      });
  });
  test("POST 400: Responds with 'bad request' if review body is missing", () => {
    const attemptedReview = {
      review_id: 8,
      fruit: "Lime",
      body: "",
      rating: "1",
      store_id: "4",
      uid: "5",
      published: "2025-11-16",
    };
    return request(app)
      .post("/api/reviews")
      .set("Authorization", "Bearer faketoken")
      .send(attemptedReview)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request - user must leave a comment");
      });
  });
  test("POST 400: Responds with 'bad request' if review is missing a fruit", () => {
    const attemptedReview = {
      review_id: 8,
      fruit: "",
      body: "Comment",
      rating: "1",
      store_id: "4",
      uid: "5",
      published: "2025-11-16",
    };
    return request(app)
      .post("/api/reviews")
      .set("Authorization", "Bearer faketoken")
      .send(attemptedReview)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Bad request - fruit selection must be specified in order to leave a comment"
        );
      });
  });
  test("POST 400: Responds with 'bad request' if a review is missing a rating", () => {
    const attemptedReview = {
      review_id: 8,
      fruit: "Lemon",
      body: "Comment",
      rating: "",
      store_id: "4",
      uid: "5",
      published: "2025-11-16",
    };
    return request(app)
      .post("/api/reviews")
      .set("Authorization", "Bearer faketoken")
      .send(attemptedReview)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Bad request - rating must be added in order to post review"
        );
      });
  });
  test("POST 401: Responds with 'unauthorised, when no authorisation token has been provided", () => {
    const attemptedReview = {
      fruit: "Lime",
      body: "Comment",
      rating: 1,
      store_id: "3",
      published: "2025-11-16",
    };

    return request(app)
      .post("/api/reviews")
      .send(attemptedReview)
      .expect(401)
      .then(({ body }) => {
        expect(body).toEqual({ error: "No token provided" });
      });
  });
});

describe("Postgres errors", () => {
  test("POST 404: Responds with bad request when rating is not a number", () => {
    const attemptedReview = {
      fruit: "Grapefruit",
      body: "Comment",
      rating: "Not a num",
      store_id: "3",
      uid: "2",
      published: "2025-11-16",
    };

    return request(app)
      .post("/api/reviews")
      .set("Authorization", "Bearer faketoken")
      .send(attemptedReview)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("POST 404: Responds with foreign key violation, when the store_id within the review doesn't exist in the store database", () => {
    const nonExistentStore = "asjdnasd";

    const attemptedReview = {
      fruit: "Lime",
      body: "Comment",
      rating: 1,
      store_id: nonExistentStore,
      uid: "2",
      published: "2025-11-16",
    };

    return request(app)
      .post("/api/reviews")
      .set("Authorization", "Bearer faketoken")
      .send(attemptedReview)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Error - store not found");
      });
  });

  test("POST 400: Responds with a not null violation when store_id has been omitted from the review", () => {
    const attemptedReview = {
      fruit: "Lime",
      body: "Comment",
      rating: 1,
      uid: "2",
      published: "2025-11-16",
    };
    
    return request(app)
    .post("/api/reviews")
    .set("Authorization", "Bearer faketoken")
    .send(attemptedReview)
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("Store must not be missing")
    })
  })
});
