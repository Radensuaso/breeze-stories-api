"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genericServerErrorHandler = exports.conflictHandler = exports.notFoundHandler = exports.forbiddenHandler = exports.unauthorizedHandler = exports.badRequestHandler = void 0;
var badRequestHandler = function (err, req, res, next) {
    if (err.status === 400 || err.name === "ValidationError") {
        console.log(err);
        res.status(400).send({ message: err.message });
    }
    else {
        next(err);
    }
};
exports.badRequestHandler = badRequestHandler;
var unauthorizedHandler = function (err, req, res, next) {
    if (err.status === 401) {
        console.log(err);
        res.status(401).send({ message: err.message });
    }
    else {
        next(err);
    }
};
exports.unauthorizedHandler = unauthorizedHandler;
var forbiddenHandler = function (err, req, res, next) {
    if (err.status === 403) {
        console.log(err);
        res.status(403).send({ message: err.message });
    }
    else {
        next(err);
    }
};
exports.forbiddenHandler = forbiddenHandler;
var notFoundHandler = function (err, req, res, next) {
    if (err.status === 404 || err.name === "CastError") {
        console.log(err);
        res.status(404).send({ message: err.message });
    }
    else {
        next(err);
    }
};
exports.notFoundHandler = notFoundHandler;
var conflictHandler = function (err, req, res, next) {
    if (err.status === 409) {
        console.log(err);
        res.status(409).send({ message: err.message });
    }
    else {
        next(err);
    }
};
exports.conflictHandler = conflictHandler;
var genericServerErrorHandler = function (err, req, res, next) {
    console.log(err);
    res.status(500).send({ message: "Generic server error." });
};
exports.genericServerErrorHandler = genericServerErrorHandler;
