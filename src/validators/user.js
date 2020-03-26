const yup = require("yup");
const cpf = require("cpf-check");

exports.validateCreateUser = async user => {
    return yup
        .object()
        .shape({
            name: yup
                .string()
                .min(5)
                .max(120)
                .required(),
            email: yup
                .string()
                .email()
                .required(),
            age: yup
                .number()
                .required()
                .positive()
                .integer(),
            document: yup
                .string()
                .required()
                .test("document", "must be a valid document", val => {
                    return cpf.validate(val);
                }),
            password: yup
                .string()
                .min(5)
                .max(64)
                .required()
        })
        .validate(user, { abortEarly: false });
};

exports.validateGetuser = async getUser => {
    return yup
        .object()
        .shape({
            id: yup.string().required()
        })
        .validate(getUser, { abortEarly: false });
};

exports.validateUpdateUser = async user => {
    return yup
        .object()
        .shape({
            name: yup
                .string()
                .min(5)
                .max(120),
            email: yup.string().email(),
            age: yup
                .number()
                .positive()
                .integer(),
            document: yup
                .string()
                .test("document", "must be a valid document", val => {
                    if (val == undefined){
                        return true
                    }
                    
                    return cpf.validate(val);
                })
        })
        .validate(user, { abortEarly: false });
};

exports.validateDeleteUser = async getUser => {
    return yup
        .object()
        .shape({
            id: yup.string().required(),
            password: yup
                .string()
                .min(5)
                .max(64)
                .required()
        })
        .validate(getUser, { abortEarly: false });
};
