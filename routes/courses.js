

const express = require('express');
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/authorize');
const { Course } = require('../models');

const router = express.Router();

// GET ALL courses
router.get('/', asyncHandler(async (req, res) => {
    const courses = await Course.findAll()

    res.status(200).json(courses);
}));

//GET a specific course
router.get('/:id', asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);

    res.status(200).json(course);
}));

// CREATE a course
router.post('/', authenticateUser, asyncHandler(async (req, res) => {
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

// UPDATE a course 
router.put('/:id', authenticateUser, asyncHandler(async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (course.userId === req.currentUser.id) {
      await course.update(req.body);
    res.status(204).json({ "message": "Course successfully updated!" });
    } else {
      res.status(403).json({ message: 'You do not have permission to change this course.' });
    }
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });   
    } else {
      throw error;
    }
  }
}));

// DELETE a course 
router.delete('/:id', authenticateUser, asyncHandler(async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (course.userId === req.currentUser.id) {
      await course.destroy();
      res.status(204).json({ "message": "Course successfully updated!" });
    } else {
      res.status(403).json({ message: 'You do not have permission to DELETE this course.' });
    }
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