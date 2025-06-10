const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Charger = require('../models/Charger');

/**
 * @swagger
 * components:
 *   schemas:
 *     Charger:
 *       type: object
 *       required:
 *         - name
 *         - location
 *         - powerOutput
 *         - connectorType
 *       properties:
 *         name:
 *           type: string
 *         location:
 *           type: object
 *           properties:
 *             latitude:
 *               type: number
 *             longitude:
 *               type: number
 *         status:
 *           type: string
 *           enum: [Active, Inactive]
 *         powerOutput:
 *           type: number
 *         connectorType:
 *           type: string
 */

/**
 * @swagger
 * /api/chargers:
 *   get:
 *     summary: Get all charging stations
 *     tags: [Chargers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of charging stations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Charger'
 */
router.get('/', auth, async (req, res) => {
  try {
    const chargers = await Charger.find();
    res.json(chargers);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /api/chargers:
 *   post:
 *     summary: Create a new charging station
 *     tags: [Chargers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Charger'
 *     responses:
 *       201:
 *         description: Charging station created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Charger'
 */
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

/**
 * @swagger
 * /api/chargers/{id}:
 *   put:
 *     summary: Update a charging station
 *     tags: [Chargers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Charger'
 *     responses:
 *       200:
 *         description: Charging station updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Charger'
 *       404:
 *         description: Charging station not found
 */
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

/**
 * @swagger
 * /api/chargers/{id}:
 *   delete:
 *     summary: Delete a charging station
 *     tags: [Chargers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Charging station deleted successfully
 *       404:
 *         description: Charging station not found
 */
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