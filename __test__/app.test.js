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
  test("200: Responds with an empty array when a store has no reviews", () => {
    const store_id = 5;
    return request(app)
      .get(`/api/reviews/${store_id}`)
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({ reviews: [] });
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

describe("GET /api/stores", () => {
  test("200: Responds with an object with a key of stores and a value of all stores objects in a single array", () => {
    return request(app)
      .get("/api/stores")
      .expect(200)
      .then(({ body }) => {
        const { stores } = body;
        stores.forEach((store) => {
          expect(typeof store.store_id).toBe("string");
          expect(typeof store.store_name).toBe("string");
          expect(typeof store.type).toBe("string");
          expect(typeof store.lat).toBe("number");
          expect(typeof store.lon).toBe("number");
        });
        expect(stores.length).not.toBe(0);
      });
  });
});

describe("GET /api/stores/:store_id", () => {
  test("200: Responds with an object with a key of store and the value of a store object", () => {
    const storeId = "4";
    return request(app)
      .get(`/api/stores/${storeId}`)
      .expect(200)
      .then(({ body }) => {
        const { store_id, store_name, type, lat, lon } = body.store;
        expect(store_id).toBe("4");
        expect(typeof store_name).toBe("string");
        expect(typeof type).toBe("string");
        expect(typeof lat).toBe("number");
        expect(typeof lon).toBe("number");
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
  test("200: Responds with an empty array if a user has made no reviews", () => {
    const uid = 5;
    return request(app)
      .get(`/api/users/${uid}/reviews`)
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({ reviews: [] });
      });
  });
});

describe("Postgres errors", () => {
  test("POST 404: Responds with foreign key violation, when the store_id within the review doesn't exist in the store database", () => {
    const nonExistentStore = "asjdnasd";

    const attemptedReview = {
      review_id: 8,
      fruit: "Lime",
      body: "Comment",
      rating: "1",
      store_id: nonExistentStore,
      uid: "2",
      published: "2025-11-16",
    };

    return request(app)
      .post("/api/reviews")
      .send(attemptedReview)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Error - store not found");
      });
  });

  test("POST 404: Responds with foreign key violation, when the uid within the review doesn't exist in the user database", () => {
    const nonExistentUser = "4hbkjgbkb4545";

    const attemptedReview = {
      review_id: 8,
      fruit: "Lime",
      body: "Comment",
      rating: "1",
      store_id: "3",
      uid: nonExistentUser,
      published: "2025-11-16",
    };

    return request(app)
      .post("/api/reviews")
      .send(attemptedReview)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Error - user not found");
      });
  });
});

describe("Custom errors", () => {
  test("404: Responds with 'path not found' when path does not exist", () => {
    return request(app)
      .get("/api/invalidPath")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Error - path not found");
      });
  });

  test("400: Responds with 'bad request' when uid contains invalid characters", () => {
    return request(app)
      .get("/api/users/uid!")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Error - bad request: invalid uid");
      });
  });

  test("404: Responds with 'store not found' when a store doesn't exist within the database", () => {
    return request(app)
      .get("/api/stores/store_id")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Error - store not found");
      });
  });

  test("404: Responds with 'store not found' when a store doesn't exist on this path", () => {
    const nonExistentStore = "dgfddfhdfruits";

    return request(app)
      .get(`/api/reviews/${nonExistentStore}`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Error - store not found");
      });
  });

  describe("PATCH /api/reviews/:review_id", () => {
    test("200: Updates the rating and body of a review", () => {
      return request(app)
        .patch("/api/reviews/1")
        .send({ body: "This is a new review", rating: 5 })
        .expect(200)
        .then(({ body: updatedReview }) => {
          expect(updatedReview.review.rating).toBe(5);
          expect(updatedReview.review.body).toBe("This is a new review");
        });
    });
  });

  describe("DELETE /api/reviews/:review_id", () => {
    test("200: Deletes a review after receiving its review_id", () => {
      return request(app).delete("/api/reviews/2").expect(200);
    });
    test("404: Responds 404 when review_id not found", () => {
      return request(app).delete("/api/reviews/10").expect(404);
    });
    test("400: Responds with 400 bad request when invalid request is made", () => {
      return request(app).delete("/api/reviews/limebuyer").expect(400);
    });
  });
});

describe.only("POST /api/users", () => {
  test("201: Posts a new user", () => {
    return request(app)
      .post("/api/users")
      .send({ uid: "938402384ABC", username: "TestUserName" })
      .expect(201)
      .then(({ body: newUser }) => {
        console.log(newUser);
        expect(newUser.user.uid).toBe("938402384ABC");
        expect(newUser.user.username).toBe("TestUserName");
      });
  });
});
