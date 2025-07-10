const endpointsJson = require("../endpoints.json");
const db = require("../db/connection");
const {userData, storeData, reviewData  } = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");

beforeEach(() => {
    return seed({userData, storeData, reviewData})
});
afterAll(() => {
    return db.end()
})

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

