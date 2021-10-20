import type { ErrorRequestHandler } from "express";

export const badRequestHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err.status === 400 || err.name === "ValidationError") {
    console.log(err);
    res.status(400).send(err.message);
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
    console.log(err);
    res.status(401).send(err.message);
  } else {
    next(err);
  }
};

export const forbiddenHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err.status === 403) {
    console.log(err);
    res.status(403).send(err.message);
  } else {
    next(err);
  }
};

export const notFoundHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err.status === 404 || err.name === "CastError") {
    console.log(err);
    res.status(404).send(err.message);
  } else {
    next(err);
  }
};

export const conflictHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err.code === 11000) {
    console.log(err);
    res.status(409).send("Email already in use");
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
  console.log(err);
  res.status(500).send("Generic server Error, contact support.");
};
