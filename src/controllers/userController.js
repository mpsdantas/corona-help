const mongoose = require("mongoose");
const User = mongoose.model("User");
const Session = mongoose.model("Session");
const uid = require("uid");
const jwt = require("jsonwebtoken");
const sha512 = require("js-sha512").sha512;
const config = require("../../config/config");
const userValidators = require("./../validators/user");
const { permissions } = require("../models/user");
const { AppError, NotFoundError } = require("./../utils/errors/errors");
const {
    getPagination,
    removeUndefinedFields
} = require("./../utils/mongo/mongo");
const numberPattern = /\d+/g;

exports.createUser = async (req, res, next) => {
    const { body } = req;

    await userValidators.validateCreateUser(body);

    await ensureUserCanBeCreated({
        email: body.email,
        document: body.document
    });

    const user = await User.create({
        _id: `user_${uid(32)}`,
        name: body.name,
        permission: permissions.common,
        email: body.email,
        age: body.age,
        document: body.document.match(numberPattern).join(""),
        password: sha512(body.password)
    });

    const session = await Session.create({
        _id: `se_${uid(32)}`,
        userId: user._id,
        permission: user.permission
    });

    const token = jwt.sign(
        {
            sessionId: session._id
        },
        config.secret,
        { expiresIn: "30d" }
    );

    return res.status(200).json({
        token: token,
        user: user.toObject()
    });
};

const ensureUserCanBeCreated = async ({ email, document }) => {
    const userSearchByEmail = await User.findOne({
        email: email
    });

    if (userSearchByEmail) {
        throw new AppError({
            status: 400,
            message: "The email has already been registered for another user."
        });
    }

    const userSearchByDocument = await User.findOne({
        document: document
    });

    if (userSearchByDocument) {
        throw new AppError({
            status: 400,
            message:
                "The document has already been registered for another user."
        });
    }
};

exports.getUsers = async (req, res, next) => {
    const { body } = req;
    const pagination = getPagination(body);

    const users = await User.find({
        deletedAt: null
    })
        .skip(pagination.skip)
        .limit(pagination.limit);

    return res.status(200).json(users.map(user => user.toObject()));
};

exports.getUser = async (req, res, next) => {
    const id = req.params.id;

    const user = await User.findOne({
        _id: id
    });

    if (!user) {
        throw new NotFoundError("user not found");
    }

    if (user._id != req.context.userId) {
        throw new AppError({
            status: 401,
            message: "You are not authorized to edit this user"
        });
    }

    return res.status(200).json(user.toObject());
};

exports.getMyUser = async (req, res, next) => {
    const id = req.context.userId;

    const user = await User.findOne({
        _id: id
    });

    if (!user) {
        throw new NotFoundError("user not found");
    }

    return res.status(200).json(user.toObject());
};

exports.updateUser = async (req, res, next) => {
    const id = req.params.id;
    const { body } = req;

    await userValidators.validateUpdateUser(body);

    await ensureUserCanBeUpdated({
        id: id,
        email: body.email,
        oldPassword: body.oldPassword,
        document: body.document,
        context: req.context
    });

    const updateData = {
        name: body.name,
        email: body.email,
        document: body.document,
        age: body.age
    };

    if (updateData.document != undefined) {
        updateData.document = updateData.document.match(numberPattern).join("");
    }

    const updateUser = await User.findOneAndUpdate(
        { _id: id },
        {
            $set: removeUndefinedFields(updateData)
        },
        { new: true, useFindAndModify: false }
    );

    return res.status(200).json(updateUser.toObject());
};

const ensureUserCanBeUpdated = async ({
    id,
    email,
    oldPassword,
    document,
    context
}) => {
    const user = await User.findById(id);

    if (!user) {
        throw new NotFoundError("user not found");
    }

    if (user.id != context.userId) {
        throw new AppError({
            status: 401,
            message: "You are not authorized to edit this user"
        });
    }

    if (user.deletedAt) {
        throw new NotFoundError("user not found");
    }

    if (email != undefined) {
        const userSearchByEmail = await User.findOne({
            email: email
        });

        if (userSearchByEmail) {
            throw new AppError({
                status: 400,
                message:
                    "The email has already been registered for another user."
            });
        }
    }

    if (document != undefined) {
        const userSearchByDocument = await User.findOne({
            document: document
        });

        if (userSearchByDocument) {
            throw new AppError({
                status: 400,
                message:
                    "The document has already been registered for another user."
            });
        }
    }
};

exports.deleteUser = async (req, res, next) => {
    const id = req.params.id;
    const { body } = req;

    await userValidators.validateDeleteUser({
        id: id,
        password: body.password
    });

    await ensureUserCanBeDeleted({
        id: id,
        password: body.password
    });

    const deletedUser = await User.findOneAndUpdate(
        { _id: id },
        {
            $set: {
                deletedAt: new Date()
            }
        },
        { new: true }
    );

    return res.status(200).json(deletedUser.toObject());
};

const ensureUserCanBeDeleted = async ({ id, password }) => {
    const user = await User.findById(id);

    if (!user) {
        throw new NotFoundError("user not found");
    }

    if (user.id != context.userId) {
        throw new AppError({
            status: 401,
            message: "You are not authorized to edit this user"
        });
    }

    if (user.deletedAt) {
        throw new NotFoundError("user not found");
    }

    if (user.password != sha512(password)) {
        throw new AppError({
            status: 400,
            message: "invalid password"
        });
    }
};
