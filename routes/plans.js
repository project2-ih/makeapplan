require('dotenv').config();

const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Plan = require("../models/Plan");
const Comment = require("../models/Comment");

const transporter = require("../modules/nodemailer/nodemailer");
const template = require("../modules/nodemailer/invitation-email-template");
const htmlToText = require("html-to-text");
const crypto = require("crypto");

router.get("/", (req, res, next) => {
  res.render("plans/index");
});

router.post("/plans", (req, res, next) => {
  const { activityForm, typeForm, participantsForm, linkForm } = req.body;

  Plan.create({
    creatorId: req.user._id,
    activity: activityForm,
    type: typeForm,
    participants: participantsForm,
    link: linkForm
  })
    .then(createdPlan => {
      res.redirect(`/plans/${createdPlan._id}`);
    })
    .catch(error => next(error));
});

router.get("/plans/:id", (req, res) => {
  Plan.findById(req.params.id)

    .populate("invitees")
    .populate("creatorId")
    .populate("comment")
    .then(plan => {
      return Comment.populate(plan, {
        path: "comment.authorId",
        model: User
      });
    })

    .then(plan => {
      res.render("plans/detail", { plan, host: process.env.HOST });
    })
    .catch(error => next(error));
});

router.post("/plans/:id/edit", (req, res) => {
  Comment.create({ comment: req.body.comment, authorId: req.user._id })
    .then(comment => {
      Plan.findByIdAndUpdate(
        req.params.id,
        { $push: { comment: comment._id } },
        { new: true }
      )
        .then(() => {
          res.redirect("back");
        })
        .catch(error => next(error));
    })
    .catch(error => next(error));
});

router.post("/plans/:id/edit-date", (req, res) => {
  const date = req.body.date;
  const time = req.body.time;
  const planDate = new Date(`${date} ${time}`).toLocaleString();

  if(date === "" || time === "") {
    res.redirect("back");
  }

  Plan.findByIdAndUpdate(req.params.id, { date: planDate }, { new: true })
    .then(() => {
      res.redirect("back");
    })
    .catch(error => res.send(500));
});

router.get("/plans", (req, res, next) => {
  Plan.find({ creatorId: req.user._id })
    .then(plans => {
      res.render("plans/plans", { plans });
    })
    .catch(error => next(error));
});

router.post("/plans/:id/delete", (req, res) => {
  Plan.findByIdAndDelete(req.params.id).then(() => {
    res.redirect("/plans");
  });
});

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

router.post("/plans/:id/invite/:userId", (req, res, next) => {
  const { invited } = req.body;
  const host = `${process.env.HOST}`
  const invitatesArray = "";
  //invitatesArray.toString();
  
  Plan.findById(req.params.id).then(plan => {
    const { invitees } = plan;

    const exists = invitees.includes(req.params.userId);
    if (!exists) {
      return Plan.findByIdAndUpdate(
        req.params.id,
        { $push: { invitees: req.params.userId } },
        { new: true }
      ).then(updatedPlan => {
        console.log('llego');
        console.log(updatedPlan);
        
        
        // console.log(updatedPlan.invitees)
        let eachInvitation = updatedPlan.invitees.filter(invited => invited == req.params.userId)
        return User.findById(eachInvitation[0])
          .then(invitedUser => {
            const text = htmlToText.fromString(
              template.emailTemplate(invitedUser),
              { wordwrap: 130 }
            )
            transporter
              .sendMail({
                from: `Makeapplan | An invitation for you!`,
                to: invitedUser.email,
                subject: "You have an invitation",
                text: text,
                html: template.emailTemplate(invitedUser)
              })
              .then(() => {
                console.log("Email Sent milf!!!");
                res.redirect("back");
              // TODO: Investigate how to redirect from here instead client side
              }).catch(e => {
                console.error(e);
                res.send(500);
              });
          }).catch(err => {
            // res.render("plans", { message: "Something went wrong" });
            console.log(err);
            res.send(500);

          });
      });
    } else {
      res.redirect("back");
    }
    
  }).catch(e => {
    console.log(e)
    res.send(500);
  });
});

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

router.post("/plans/:planId/deleteInvitee/:userId", (req, res) => {
  Plan.findByIdAndUpdate(req.params.planId, {
    $pull: { invitees: req.params.userId }
  })
  .then(() => {
    res.redirect("back");
  })
});


module.exports = router;
