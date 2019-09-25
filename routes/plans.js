const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Plan = require("../models/Plan");
const Comment = require("../models/Comment");

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

  .populate("creatorId")
    .populate("comment")
    .then(plan => {
      return Comment.populate(plan, {
        path: "comment.authorId",
        model: User
      });
    })
    
  .then(plan => {
    res.render("plans/detail", { plan });
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

router.get("/plans", (req, res, next) => {
  Plan.find({ creatorId: req.user._id })
  .then(plans => {
    res.render("plans/plans", { plans })
  })
  .catch(error => next(error));
})

module.exports = router;
