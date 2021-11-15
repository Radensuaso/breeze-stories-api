"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var app_1 = __importDefault(require("./app"));
var express_list_endpoints_1 = __importDefault(require("express-list-endpoints"));
process.env.TS_NODE_DEV && require("dotenv").config();
if (!process.env.PORT) {
    throw new Error("No Port defined");
}
var PORT = process.env.PORT || 3001;
if (!process.env.MONGO_CONNECTION) {
    throw new Error("No Mongo connection defined.");
}
mongoose_1.default.set("debug", true);
mongoose_1.default.connect(process.env.MONGO_CONNECTION);
mongoose_1.default.connection.on("connected", function () {
    console.log("🍃Successfully connected to mongo!");
    app_1.default.listen(PORT, function () {
        console.table((0, express_list_endpoints_1.default)(app_1.default));
        console.log("🛩️ Server is running on port ", PORT);
    });
});
mongoose_1.default.connection.on("error", function (err) {
    console.log("MONGO ERROR: ", err);
});
