"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express")); // import express from express
var cors_1 = __importDefault(require("cors")); // will enable the frontend to communicate with the backend
var errorHandlers_1 = require("./errorHandlers");
var authors_1 = __importDefault(require("./services/authors"));
var stories_1 = __importDefault(require("./services/stories"));
var comments_1 = __importDefault(require("./services/comments"));
var app = (0, express_1.default)(); //our server function initialized with express()
//=========== GLOBAL MIDDLEWARES ======================
app.use((0, cors_1.default)());
app.use(express_1.default.json()); // this will enable reading of the bodies of requests, THIS HAS TO BE BEFORE server.use("/authors", authorsRouter)
// ========== ROUTES =======================
app.use("/authors", authors_1.default);
app.use("/stories", stories_1.default);
app.use("/comments", comments_1.default);
// ============== ERROR HANDLING ==============
app.use(errorHandlers_1.badRequestHandler);
app.use(errorHandlers_1.unauthorizedHandler);
app.use(errorHandlers_1.forbiddenHandler);
app.use(errorHandlers_1.notFoundHandler);
app.use(errorHandlers_1.conflictHandler);
app.use(errorHandlers_1.genericServerErrorHandler);
exports.default = app;
