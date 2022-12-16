"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genericServerErrorHandler = exports.conflictHandler = exports.notFoundHandler = exports.forbiddenHandler = exports.unauthorizedHandler = exports.badRequestHandler = void 0;
const badRequestHandler = (err, req, res, next) => {
    if (err.status === 400 || err.name === "ValidationError") {
        console.log(err);
        res.status(400).send({ message: err.message });
    }
    else {
        next(err);
    }
};
exports.badRequestHandler = badRequestHandler;
const unauthorizedHandler = (err, req, res, next) => {
    if (err.status === 401) {
        console.log(err);
        res.status(401).send({ message: err.message });
    }
    else {
        next(err);
    }
};
exports.unauthorizedHandler = unauthorizedHandler;
const forbiddenHandler = (err, req, res, next) => {
    if (err.status === 403) {
        console.log(err);
        res.status(403).send({ message: err.message });
    }
    else {
        next(err);
    }
};
exports.forbiddenHandler = forbiddenHandler;
const notFoundHandler = (err, req, res, next) => {
    if (err.status === 404 || err.name === "CastError") {
        console.log(err);
        res.status(404).send({ message: err.message });
    }
    else {
        next(err);
    }
};
exports.notFoundHandler = notFoundHandler;
const conflictHandler = (err, req, res, next) => {
    if (err.status === 409) {
        console.log(err);
        res.status(409).send({ message: err.message });
    }
    else {
        next(err);
    }
};
exports.conflictHandler = conflictHandler;
const genericServerErrorHandler = (err, req, res, next) => {
    console.log(err);
    res.status(500).send({ message: "Generic server error." });
};
exports.genericServerErrorHandler = genericServerErrorHandler;
