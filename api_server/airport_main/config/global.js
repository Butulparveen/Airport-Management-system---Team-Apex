require('dotenv').config()
var G_CONFIG = {
    MONGO_URL: process.env.MONGO_URL,
    CACHE_SERVER_URL: process.env.CACHE_SERVER_URL,
    HTTP_PORT: process.env.HTTP_PORT,
    GATE_ALLOCATION_TIME: process.env.GATE_ALLOCATION_TIME,
    CAROUSEL_ALLOCATION_TIME: process.env.CAROUSEL_ALLOCATION_TIME,
    CURRENT_DATE: process.env.CURRENT_DATE,
    NUMBER_OF_GATES: process.env.NUMBER_OF_GATES
}
exports.G_CONFIG = G_CONFIG;


