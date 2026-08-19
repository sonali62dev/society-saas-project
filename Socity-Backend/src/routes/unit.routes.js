const express = require('express');
const router = express.Router();
const UnitController = require('../controllers/Unit.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router.use(authenticate);

// List all units
router.get('/', UnitController.list);

// Get single unit
router.get('/:id', UnitController.getById);

// Create unit (Admin only)
router.post('/', authorize(['ADMIN', 'SUPER_ADMIN']), UnitController.create);

// Update unit
router.patch('/:id', authorize(['ADMIN', 'SUPER_ADMIN']), UnitController.update);

// Delete unit
router.delete('/:id', authorize(['ADMIN', 'SUPER_ADMIN']), UnitController.delete);

// Unit Family Members
router.get('/:unitId/members', UnitController.getUnitMembers);
router.post('/:unitId/members', authorize(['ADMIN', 'SUPER_ADMIN', 'RESIDENT']), UnitController.addUnitMember);
router.delete('/:unitId/members/:memberId', authorize(['ADMIN', 'SUPER_ADMIN', 'RESIDENT']), UnitController.deleteUnitMember);

module.exports = router;

