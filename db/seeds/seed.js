const db = require("../connection");
const format = require("pg-format");

const seed = ({ userData, storeData, reviewData }) => {
  return db
    .query(`DROP TABLE IF EXISTS reviews CASCADE`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS stores CASCADE`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users CASCADE`);
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
        store_id BIGINT PRIMARY KEY,
        store_name VARCHAR(100) NOT NULL,
        type VARCHAR(300) NOT NULL,
        lat FLOAT NOT NULL,
        lon FLOAT NOT NULL)`);
    })

    .then(() => {
      return db.query(`CREATE TABLE
        reviews(
        review_id SERIAL PRIMARY KEY,
        fruit VARCHAR(20) NOT NULL,
        body VARCHAR(1000),
        rating INT NOT NULL,
        store_id BIGINT REFERENCES stores(store_id) NOT NULL,
        uid VARCHAR(100) REFERENCES users(uid) NOT NULL,
        published DATE)`);
    })

    .then(() => {
      const formattedUsersValue = userData.map(
        ({ uid, username, avatar_url }) => {
          return [uid, username, avatar_url];
        }
      );

      const sqlUsersString = format(
        `INSERT INTO users(uid, username, avatar_url) VALUES %L RETURNING *`,
        formattedUsersValue
      );
      return db.query(sqlUsersString);
    })

    .then(() => {
      const formattedStoresValue = storeData.map(
        ({ store_id, store_name, type, lat, lon }) => {
          return [store_id, store_name, type, lat, lon];
        }
      );

      const sqlStoresString = format(
        `INSERT INTO stores(store_id, store_name, type, lat, lon) VALUES %L RETURNING *`,
        formattedStoresValue
      );
      return db.query(sqlStoresString);
    })

    .then(() => {
      const formattedReviewsValue = reviewData.map(
        ({  fruit, body, rating, store_id, uid, published }) => {
          return [ fruit, body, rating, store_id, uid, published];
        }
      );

      const sqlReviewsString = format(
        `INSERT INTO reviews(fruit, body, rating, store_id, uid, published) VALUES %L RETURNING *`,
        formattedReviewsValue
      );
      return db.query(sqlReviewsString);
    });
};

module.exports = seed;
