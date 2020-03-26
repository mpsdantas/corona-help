const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { toObject } = require("../utils/mongo/mongo");

const userSchema = new Schema(
    {
        _id: String,
        name: String,
        email: String,
        permission: String,
        age: Number,
        document: String,
        password: String,
        createdAt: Date,
        updatedAt: Date,
        deletedAt: Date
    },
    { timestamps: true, toObject }
);

exports.permissions = {
    common: "COMMON",
    admin: "ADMIN"
};

mongoose.model("User", userSchema);
