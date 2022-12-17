import type { ErrorRequestHandler } from "express";

export const badRequestHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (err.status === 400 || err.name === "ValidationError") {
        res.status(400).send({ message: err.message });
    } else {
        next(err);
    }
};

export const unauthorizedHandler: ErrorRequestHandler = (
    err,
    req,
    res,
    next
) => {
    if (err.status === 401) {
        res.status(401).send({ message: err.message });
    } else {
        next(err);
    }
};

export const forbiddenHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (err.status === 403) {
        res.status(403).send({ message: err.message });
    } else {
        next(err);
    }
};

export const notFoundHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (err.status === 404 || err.name === "CastError") {
        res.status(404).send({ message: err.message });
    } else {
        next(err);
    }
};

export const conflictHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (err.status === 409) {
        res.status(409).send({ message: err.message });
    } else {
        next(err);
    }
};

export const genericServerErrorHandler: ErrorRequestHandler = (
    err,
    req,
    res,
    next
) => {
    res.status(500).send({ message: "Generic server error." });
};
