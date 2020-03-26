const config = {
    secret: process.env.NODE_ENV !== "production" ? "secretDev" : process.env.SECRET
};

module.exports = config;