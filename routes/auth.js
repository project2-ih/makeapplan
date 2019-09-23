const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
const uploadCloud = require("../configs/cloudinary");

const transporter = require("../modules/nodemailer/nodemailer");
const template = require("../modules/nodemailer/email-template");
const htmlToText = require("html-to-text");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// Crypto
const crypto = require("crypto");

router.get("/auth/login", (req, res, next) => {
  res.render("auth/login", { message: req.flash("error") });
});

router.post(
  "/auth/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

router.get("/auth/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post(
  "/auth/signup",
  uploadCloud.single("profilePhoto"),
  (req, res, next) => {
    const { username, password, email } = req.body;
    const { url } = req.file || "";

    if (username === "" || password === "") {
      res.render("auth/signup", { message: "Indicate username and password" });
      return;
    }

    User.findOne({ username }, "username", (err, user) => {
      if (user !== null) {
        res.render("auth/signup", { message: "The username already exists" });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashedPassword = bcrypt.hashSync(password, salt);
      const confirmationCode = crypto.randomBytes(20).toString("hex");

      User.create({
        username,
        password: hashedPassword,
        email,
        profilePhoto: url,
        confirmationCode
      })
        // .then(() => {
        //   res.redirect("/");
        // })
        // .catch(err => {
        //   res.render("auth/signup", { message: "Something went wrong" });
        // });

        .then(data => {
          const text = htmlToText.fromString(
            template.emailTemplate(confirmationCode, data),
            { wordwrap: 130 }
          );

          transporter
            .sendMail({
              from: `Makeapplan | Don't be bored again!`,
              to: data.email,
              subject: "Email confirmation",
              text: text,
              html: template.emailTemplate(confirmationCode, data)
            })
            .then(() => {
              res.redirect("/");
            })
            .catch(err => {
              res.render("auth/signup", { message: "Something went wrong" });
            });
        });
    });
  }
);

router.get("/auth/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// Account confirmation

router.get("/auth/confirmation/:confirmationCode", (req, res) => {
  const confirmationCode = req.params.confirmationCode;

  User.findOne({ confirmationCode: confirmationCode })
    .then(user => {
      user.status = "Active";
      user.save();
      res.redirect("/auth/confirmation-success");
    })
    .catch(error => {
      console.log(error);
      res.redirect("/auth/confirmation-failed");
    });
});

router.get("/auth/confirmation-success", (req, res) => {
  res.render("email/confirmation-success");
});

// Social

router.get("/auth/facebook", passport.authenticate("facebook"));

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "auth/login" }),
  function(req, res) {
    res.redirect("/");
  }
);

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email"
    ]
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/" // here you would redirect to the login page using traditional login approach
  })
);

module.exports = router;
