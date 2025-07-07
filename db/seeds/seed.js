const db = require("../connection");
const format = require(`pg-format`);

const seed = ({ userData, storeData, reviewData }) => {
  return db
    .query(`DROP TABLE IF EXISTS users`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS stores`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS reviews`);
    })

    .then(() => {
      return db.query(`CREATE TABLE
        users(
        uid VARCHAR(100) PRIMARY KEY,
        username VARCHAR(300) NOT NULL,
        avatar_url VARCHAR(1000))`);
    })

    .then(() => {
      return db.query(`CREATE TABLE
        stores(
        store_id VARCHAR(100) PRIMARY KEY,
        store_name VARCHAR(100),
        description VARCHAR(300),
        lat INT NOT NULL,
        long INT NOT NULL,
        url VARCHAR(300))`);
    })

    .then(() => {
      return db.query(`CREATE TABLE
        reviews(
        review_id SERIAL PRIMARY KEY,
        fruit VARCHAR(20) NOT NULL,
        rating INT NOT NULL,
        store VARCHAR(50) REFERENCES stores(store_id) NOT NULL),
        author VARCHAR(100) REFERENCES users(uid) NOT NULL`);
    })

    .then(() => {
      const formattedUsersValue = userData.map(
        ({ uid, username, avatar_url }) => {
          return [uid, username, avatar_url];
        }
      );

      const sqlUsersString = format(
        `INSERT INTO users(uid, username, avatar_url) VALUES %L`,
        formattedUsersValue
      );
      return db.query(sqlUsersString);
    })

    .then(() => {
      const formattedStoresValue = storeData.map(
        ({ store_id, store_name, description, lat, long, url }) => {
          return [store_id, store_name, description, lat, long, url];
        }
      );

      const sqlStoresString = format(
        `INSERT INTO stores(store_id, store_name, description, lat, long, url) VALUES %L`,
        formattedStoresValue
      );
      return db.query(sqlStoresString);
    })

    .then(() => {
      const formattedReviewsValue = reviewData.map(
        ({ review_id, fruit, rating, store, author }) => {
          return [review_id, fruit, rating, store, author];
        }
      );

      const sqlReviewsString = format(
        `INSERT INTO reviews(review_id, fruit, rating, store, author) VALUES %L`,
        formattedReviewsValue
      );
      return db.query(sqlReviewsString);
    });
};

module.exports = seed;
