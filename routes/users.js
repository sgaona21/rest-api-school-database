'use strict';

const express = require('express');
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/authorize');
const { User } = require('../models');

const bcrypt = require('bcryptjs');

const router = express.Router();

router.get('/', authenticateUser, asyncHandler(async (req, res) => {
  const user = req.currentUser;

  res.json({
    id: user.id,
    name: user.firstName,
    lastName: user.lastName,
    emailAddress: user.emailAddress
  });
}));


router.post('/', asyncHandler(async (req, res) => {
  try {
    const user = req.body;

    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }
    await User.create(user);

    res.location('/');
    res.status(201).json({ "message": "Account successfully created!" });
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });   
    } else {
      throw error;
    }
  }
}));


module.exports = router;


