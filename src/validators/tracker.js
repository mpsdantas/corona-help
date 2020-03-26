const yup = require("yup");

exports.validateTracker = async tracker => {
    return yup
        .object()
        .shape({
            location: yup
                .object({
                    coordinates: yup
                        .array()
                        .of(yup.number())
                        .required()
                        .test(
                            "len",
                            "'must be exactly longitude and latitude'",
                            val => val.length == 2
                        )
                })

                .required(),
            healthCondition: yup.object({
                corona: yup.boolean().required(),
                fever: yup.boolean().required(),
                coryza: yup.boolean().required(),
                stuffyNose: yup.boolean().required(),
                tiredness: yup.boolean().required(),
                headache: yup.boolean().required(),
                bodyPain: yup.boolean().required(),
                generalDiscomfort: yup.boolean().required(),
                soreThroat: yup.boolean().required()
            })
        })
        .required()
        .validate(tracker, { abortEarly: false });
};

exports.validateUpdateTracker = async tracker => {
    return yup
        .object()
        .shape({
            id: yup.string().required(),
            location: yup
                .object({
                    coordinates: yup
                        .array()
                        .of(yup.number())
                        .required()
                        .test(
                            "len",
                            "'must be exactly longitude and latitude'",
                            val => val.length == 2
                        )
                })

                .required()
        })
        .required()
        .validate(tracker, { abortEarly: false });
};

exports.validateGetTrackers = async tracker => {
    return yup
        .object()
        .shape({
            location: yup
                .object({
                    coordinates: yup
                        .array()
                        .of(yup.number()).required()
                        // .test(
                        //     "len",
                        //     "'must be exactly longitude and latitude'",
                        //     val => val.length == 2
                        // )
                }).required()
        })
        .required()
        .validate(tracker, { abortEarly: false });
};
