const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Charger = require('../models/Charger');

// Get all chargers
router.get('/', auth, async (req, res) => {
  try {
    const chargers = await Charger.find();
    res.json(chargers);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new charger
router.post('/',
  auth,
  [
    body('name').notEmpty().trim(),
    body('location.latitude').isNumeric(),
    body('location.longitude').isNumeric(),
    body('powerOutput').isNumeric().isFloat({ min: 0 }),
    body('connectorType').notEmpty().trim()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const charger = new Charger(req.body);
      await charger.save();
      res.status(201).json(charger);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update a charger
router.put('/:id',
  auth,
  [
    body('name').optional().notEmpty().trim(),
    body('location.latitude').optional().isNumeric(),
    body('location.longitude').optional().isNumeric(),
    body('status').optional().isIn(['Active', 'Inactive']),
    body('powerOutput').optional().isNumeric().isFloat({ min: 0 }),
    body('connectorType').optional().notEmpty().trim()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const charger = await Charger.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!charger) {
        return res.status(404).json({ message: 'Charger not found' });
      }

      res.json(charger);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Delete a charger
router.delete('/:id', auth, async (req, res) => {
  try {
    const charger = await Charger.findByIdAndDelete(req.params.id);
    
    if (!charger) {
      return res.status(404).json({ message: 'Charger not found' });
    }

    res.json({ message: 'Charger deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 