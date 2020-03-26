const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { toObject } = require("../utils/mongo/mongo");

const sessionSchema = new Schema(
    {
        _id: String,
        userId: String,
        permission: String,
        createdAt: Date,
        updatedAt: Date,
        deletedAt: Date,
    },
    { timestamps: true, toObject }
);

mongoose.model("Session", sessionSchema);
