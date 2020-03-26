const mongoose = require("mongoose");
const Tracker = mongoose.model("Tracker");
const User = mongoose.model("User");
const uid = require("uid");
const { status } = require("./../models/tracker");
const trackerValidator = require("./../validators/tracker");
const { removeUndefinedFields } = require("./../utils/mongo/mongo");
const { AppError} = require("./../utils/errors/errors");

exports.createTracker = async (req, res, next) => {
    const { body, context } = req;

    await trackerValidator.validateTracker(body);

    await Tracker.updateOne(
        {
            userId: context.userId,
            status: status.active
        },
        {
            $set: {
                status: status.disabled
            }
        }
    );

    const user = await User.findById(context.userId);
    const tracker = await Tracker.create({
        _id: `tr_${uid(32)}`,
        status: status.active,
        userId: context.userId,
        name: user.name,
        documentRedacted: `*********${user.document.substr(
            user.document.length - 3
        )}`,
        age: user.age,
        healthCondition: body.healthCondition,
        location: {
            type: "Point",
            coordinates: body.location.coordinates
        }
    });

    return res.status(200).json(tracker.toObject());
};

exports.updateTracker = async (req, res, next) => {
    const id = req.params.id;
    const context = req.context;
    const { body } = req;

    await trackerValidator.validateUpdateTracker({
        id,
        ...body
    })

    const tracker = await Tracker.findById(id);

    if (tracker.userId != context.userId) {
        throw new AppError({
            status: 401,
            message: "You are not authorized to edit this tracker"
        });
    }

    const updateData = {
        location: {
            type: "Point",
            coordinates: body.location.coordinates
        }
    };

    const updatedTracker = await Tracker.findOneAndUpdate(
        { _id: id },
        {
            $set: removeUndefinedFields(updateData)
        },
        { new: true, useFindAndModify: false }
    );

    return res.status(200).json(updatedTracker.toObject());
};

exports.getTrackers = async (req, res, next) => {
    const { body } = req;
    
    await trackerValidator.validateGetTrackers(body);

    const distances = {
        min: 0,
        max: 30000
    };
    distances.min =
        body.minDistance != undefined ? body.minDistance : distances.min;
    distances.max =
        body.maxDistance != undefined ? body.maxDistance : distances.max;
        
    const trackers = await Tracker.find({
        status: status.active,
        location: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: body.location.coordinates
                },
                $minDistance: distances.min,
                $maxDistance: distances.max
            }
        }
    });

    return res.status(200).json(trackers.map(tracker => tracker.toObject()));
};

exports.getTracker = async (req, res, next) => {
    const id = req.params.id;

    const tracker = await Tracker.findOne({
        _id: id
    });

    return res.status(200).json(tracker.toObject());
};
