const mongoose = require("mongoose");
const User = mongoose.model("User");
const Session = mongoose.model("Session");

const config = require("../../config/config");
const jwt = require("jsonwebtoken");

const response = {
    message:
        "You need to enter in your Authorization: Bearer XXX header to access this route, please inform and try again."
};

exports.isLoggedIn = permissions => {
   return async function(req, res, next) {
      const token = req.headers.authorization;

      if (!token) {
         return res.status(401).json(response);
      }

      if (!token.includes("Bearer ")) {
         return res.status(401).json(response);
      }

      const decoded = jwt.verify(token.replace("Bearer ", ""), config.secret);

      const session = await Session.findById(decoded.sessionId);

      if (!session || session.deletedAt != undefined){
         return res.status(401).json(response);
      }

      let hasPermission = permissions != undefined ? false : true;

      if (permissions != undefined) {
         permissions.map(permission => {
               if (permission == session.permission) {
                  hasPermission = true;
               }
         });
      }

      if (!hasPermission) {
         return res.status(401).json({
               message:
                  "You do not have permission to access this feature, contact the administrator"
         });
      }

      req.context = buildContext(session)

      next();
   };
};

const buildContext = session => {
   return {
      sessionId: session._id,
      userId: session.userId,
      permission: session.permission
   };
};
