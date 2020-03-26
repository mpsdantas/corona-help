exports.toObject = {
    transform: function(doc, ret) {
        var obj = ret;

        //Rename fields
        var id = obj._id;
        delete obj._id;
        delete obj["__v"];

        return {
            id: id,
            ...obj
        };
    }
};

exports.getPagination = body => {
    return {
        skip: body.skip != undefined ? body.skip : 0,
        limit:
            body.limit != undefined
                ? body.limit > 100
                    ? 100
                    : body.limit
                : 100
    };
};

exports.removeUndefinedFields = obj => {
    return Object.keys(obj).reduce((acc, key) => {
        const _acc = acc;
        if (obj[key] !== undefined) _acc[key] = obj[key];
        return _acc;
    }, {});
};
