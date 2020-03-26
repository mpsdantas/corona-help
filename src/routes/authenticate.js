const express = require("express");
const router = express.Router();

const { catchErrors } = require("../utils/errors/errors");
const authentication = require("./../middlewares/authentication");
const authenticateController = require("./../controllers/authenticateController");

router.post(
    "/api/v1/authenticate/login",
    catchErrors(authenticateController.createLogin)
);

router.post(
    "/api/v1/authenticate/logout",
    authentication.isLoggedIn(),
    catchErrors(authenticateController.createLogout)
);

module.exports = router