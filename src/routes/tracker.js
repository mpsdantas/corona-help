const express = require("express");
const router = express.Router();

const { catchErrors } = require("../utils/errors/errors");
const authentication = require("./../middlewares/authentication");
const trackerController = require("./../controllers/trackerController");

router.post(
    "/api/v1/tracker",
    authentication.isLoggedIn(),
    catchErrors(trackerController.createTracker)
);

router.patch(
    "/api/v1/tracker/:id",
    authentication.isLoggedIn(),
    catchErrors(trackerController.updateTracker)
);

router.get(
    "/api/v1/trackers",
    authentication.isLoggedIn(),
    catchErrors(trackerController.getTrackers)
);

router.get(
    "/api/v1/tracker/:id",
    authentication.isLoggedIn(),
    catchErrors(trackerController.getTracker)
);

module.exports = router