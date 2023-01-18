require('dotenv').config()
const NodeCache = require("node-cache"); //https://www.npmjs.com/package/node-cache/v/5.1.2

var G_CONFIG = {
    HTTP_PORT: process.env.HTTP_CACHE_PORT,
    AIRLINE_SERVER_URL: process.env.AIRLINE_SERVER_URL,
    assignedCarouselCache: new NodeCache({ checkperiod: 1 }),
    assignedGatesCache: new NodeCache({ checkperiod: 1 })
}
exports.G_CONFIG = G_CONFIG;