const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { toObject } = require("../utils/mongo/mongo");

const trackerSchema = new Schema(
    {
        _id: String,
        userId: String,
        name: String,
        status: String,
        documentRedacted: String,
        age: Number,
        healthCondition:{
            corona: Boolean, // tem corona
            fever: Boolean, // teve febre
            coryza: Boolean, // coriza
            stuffyNose: Boolean, //nariz entupido
            tiredness: Boolean, // tosse
            headache: Boolean, // dor de cabeça
            bodyPain: Boolean, // dor no corpo
            generalDiscomfort: Boolean, // mal estar geral
            soreThroat: Boolean, // dor de garganta
        },
        location: {
            type: {
                type: String, // Don't do `{ location: { type: String } }`
                enum: ["Point"], // 'location.type' must be 'Point'
            },
            coordinates: {
                type: [Number],
            }
        },
        createdAt: Date,
        updatedAt: Date
    },
    { timestamps: true, toObject }
);

trackerSchema.index({location: '2dsphere'});

exports.status = {
    active: "ACTIVE",
    disabled: "DISABLED"
};

mongoose.model("Tracker", trackerSchema);
