const dotenv = require("dotenv");
dotenv.config();
var JwtStrategy = require("passport-jwt").Strategy;
var ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/userModel");
module.exports = function (passport) {
  passport.use(
    new JwtStrategy(
      {
        secretOrKey: process.env.JWT_SECRET_KEY,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      },
      function (jwt_payload, next) {
        User.findById(jwt_payload.userID)
          .then((user) => {
            if (user) {
              next(null, user);
            } else {
              return next(null, false, {
                message: "You Don't have permission ",
                success: false,
              });
            }
          })
          .catch((error) => {
            return next(null, false, {
              message: "You Don't have permission ",
              success: false,
            });
          });
        // next(null, false);
      }
    )
  );
};
