// Socity-Backend/src/routes/propertyLead.routes.js

const express = require('express');
const router = express.Router();
const PropertyLeadController = require('../controllers/PropertyLead.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.get('/', authenticate, PropertyLeadController.list);
router.post('/', authenticate, PropertyLeadController.create);
router.get('/:id', authenticate, PropertyLeadController.get);
router.put('/:id', authenticate, PropertyLeadController.update);
router.delete('/:id', authenticate, PropertyLeadController.remove);
router.patch('/:id/status', authenticate, PropertyLeadController.updateStatus);

module.exports = router;
