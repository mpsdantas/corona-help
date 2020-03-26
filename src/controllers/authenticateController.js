const mongoose = require("mongoose");
const User = mongoose.model("User");
const Session = mongoose.model("Session");
const sha512 = require("js-sha512").sha512;
const jwt = require("jsonwebtoken");
const config = require("../../config/config");
const uid = require("uid");
const authenticateValidators = require("./../validators/authenticate");

exports.createLogin = async (req, res, next) => {
    const { body } = req;

    await authenticateValidators.validateCreateLogin(body);

    const user = await User.findOne({
        email: body.email,
    })

    if (!user){
        throw new AppError({
            status: 400,
            message: "User does not exist."
        });
    }

    if (user.password != sha512(body.password)){
        throw new AppError({
            status: 401,
            message: "Invalid email or password."
        });
    }

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
        { expiresIn: '30d' }
    );

    return res.status(200).json({
        token: token,
        user: user.toObject()
    });
}

exports.createLogout = async (req, res, next) => {
    const {context} = req;
    console.log(context)
    await Session.updateOne({_id: context.sessionId}, {$set: {
        deletedAt: new Date(),
    }})

    return res.status(200).json({
        message: "Successful logout"
    });
}