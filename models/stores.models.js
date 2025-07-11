const db = require('../db/connection')

const fetchAllStores = () => {
    console.log('hello from stores models')
    return db.query(`SELECT * FROM stores`).then(({rows}) => {
        return rows
    })
}

const fetchStoreById = (store_id) => {
    return db.query(`SELECT stores.store_id, stores.store_name, stores.type, stores.lat, stores.lon FROM stores WHERE stores.store_id = $1`, [store_id])
    .then(({rows}) => {
        const store=rows[0]
        return store
    })
}
module.exports = {fetchAllStores, fetchStoreById}