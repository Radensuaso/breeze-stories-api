"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const express_list_endpoints_1 = __importDefault(require("express-list-endpoints"));
const express_1 = __importDefault(require("express")); // import express from express
const cors_1 = __importDefault(require("cors")); // will enable the frontend to communicate with the backend
const errorHandlers_1 = require("./errorHandlers");
const authors_1 = __importDefault(require("./services/authors"));
const stories_1 = __importDefault(require("./services/stories"));
const comments_1 = __importDefault(require("./services/comments"));
require("dotenv/config");
if (!process.env.PORT) {
    throw new Error('No Port defined');
}
const PORT = process.env.PORT || 9000;
if (!process.env.MONGO_CONNECTION) {
    throw new Error('No Mongo connection defined.');
}
const app = (0, express_1.default)(); //our server function initialized with express()
//=========== GLOBAL MIDDLEWARES ======================
app.use((0, cors_1.default)());
app.use(express_1.default.json()); // this will enable reading of the bodies of requests, THIS HAS TO BE BEFORE server.use("/authors", authorsRouter)
// ========== ROUTES =======================
app.use('/authors', authors_1.default);
app.use('/stories', stories_1.default);
app.use('/comments', comments_1.default);
// ============== ERROR HANDLING ==============
app.use(errorHandlers_1.badRequestHandler);
app.use(errorHandlers_1.unauthorizedHandler);
app.use(errorHandlers_1.forbiddenHandler);
app.use(errorHandlers_1.notFoundHandler);
app.use(errorHandlers_1.conflictHandler);
app.use(errorHandlers_1.genericServerErrorHandler);
mongoose_1.default.set('debug', true);
mongoose_1.default.connect(process.env.MONGO_CONNECTION);
mongoose_1.default.connection.on('connected', () => {
    console.log('🍃Successfully connected to mongo!');
    app.listen(PORT, () => {
        console.table((0, express_list_endpoints_1.default)(app));
        console.log('🛩️ Server is running on port ', PORT);
    });
});
mongoose_1.default.connection.on('error', (err) => {
    console.log('MONGO ERROR: ', err);
});
