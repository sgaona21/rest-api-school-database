

const express = require('express');
const { asyncHandler } = require('../middleware/async-handler');
const { Course } = require('../models');

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
    const courses = await Course.findAll()

    res.status(200).json(courses);
}));

router.get('/:id', asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);

    res.status(200).json(course);
}));

router.post('/', asyncHandler(async (req, res) => {
  try {
    await Course.create(req.body);
    res.location('/');
    res.status(201).json({ "message": "Course successfully created!" });
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });   
    } else {
      throw error;
    }
  }
}));

router.put('/:id', asyncHandler(async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);

    await course.update(req.body);
    res.status(204).json({ "message": "Course successfully updated!" });
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });   
    } else {
      throw error;
    }
  }
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);

    await course.destroy();
    res.status(204).json({ "message": "Course successfully updated!" });
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