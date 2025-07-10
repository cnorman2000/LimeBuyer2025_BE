const endpointsJson = require("../endpoints.json");
const db = require("../db/connection");
const { reviewData, storeData, userData } = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
