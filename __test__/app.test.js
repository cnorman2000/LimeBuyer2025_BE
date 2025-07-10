const db = require("../db/connection");

const { userData, storeData, reviewData } = require("../db/data/test-data");

const request = require("supertest");
const app = require("../app");

const seed = require("../db/seeds/seed");

beforeEach(() => seed({ userData, storeData, reviewData }));

afterAll(() => db.end());

describe('GET /api', () => {
    test('200: Responds with an object detailing all the documentation for each endpoint', () => {
        return request(app)
        .get('/api') 
        .expect(200)
        .then(({body: {endpoints}}) => {
            expect(endpoints).toEqual(endpointsJson)
        })
    })
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

