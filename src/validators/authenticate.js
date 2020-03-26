const yup = require("yup");

exports.validateCreateLogin = async user => {
    return yup
        .object()
        .shape({
            email: yup
                .string()
                .email()
                .required(),
            password: yup
                .string()
                .min(5)
                .max(64)
                .required()
        })
        .validate(user, { abortEarly: false });
};
