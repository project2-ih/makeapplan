const express = require('express');
const router  = express.Router();

const authRoutes = require('./auth');
router.use('/', authRoutes);

const plansRoutes = require('./plans');
router.use('/', plansRoutes);


router.get('/', (req, res, next) => {
  res.render('index');
});

module.exports = router;
