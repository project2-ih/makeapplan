require("dotenv").config();

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

// Crypto
const crypto = require("crypto");

passport.use(
  new GoogleStrategy(
    {
      clientID: `${process.env.GOOGLE_ID}`,
      clientSecret: `${process.env.GOOGLE_SECRET}`,
      callbackURL: "/auth/google/callback"
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ googleID: profile.id })
        .then(user => {
          if (user) {
            done(null, user);
            return;
          }

          const confirmationCode = crypto.randomBytes(20).toString("hex");

          User.create({
            googleId: profile.id,
            username: profile.name.givenName,
            profilePhoto: profile.photos[0].value,
            email: profile.emails[0].value,
            confirmationCode
          })
            .then(newUser => {
              done(null, newUser);
            })
            .catch(err => done(err)); // closes User.create()
        })
        .catch(err => done(err)); // closes User.findOne()
    }
  )
);
