const express = require("express");
const router = express.Router();

const { catchErrors } = require("../utils/errors/errors");
const authentication = require("./../middlewares/authentication");
const userController = require("./../controllers/userController");

router.post("/api/v1/user", catchErrors(userController.createUser));

router.get(
    "/api/v1/user/:id",
    authentication.isLoggedIn(),
    catchErrors(userController.getUser)
);

router.get(
    "/api/v1/my-user",
    authentication.isLoggedIn(),
    catchErrors(userController.getMyUser)
);

router.put("/api/v1/user/:id", (req, res) => {
    return res.status(405).json({
        message: "The method you are using is not allowed for that object."
    });
});

router.patch(
    "/api/v1/user/:id",
    authentication.isLoggedIn(),
    catchErrors(userController.updateUser)
);

router.delete(
    "/api/v1/user/:id",
    authentication.isLoggedIn(),
    catchErrors(userController.deleteUser)
);

router.get(
    "/api/v1/users",
    authentication.isLoggedIn(["ADMIN"]),
    catchErrors(userController.getUsers)
);

module.exports = router;
