const express = require('express');
const SocietyController = require('../controllers/Society.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/units', authenticate, SocietyController.getUnits);
router.patch('/units/:id/ownership', authenticate, authorize(['ADMIN']), SocietyController.updateOwnership);
router.post('/notices', authenticate, authorize(['ADMIN']), SocietyController.postNotice);
router.get('/admin-dashboard-stats', authenticate, authorize(['ADMIN', 'SUPER_ADMIN']), SocietyController.getAdminDashboardStats);
router.get('/members', authenticate, SocietyController.getMembers);
router.get('/my-society/details', authenticate, SocietyController.getMySocietyDetails);
router.post('/members', authenticate, authorize(['ADMIN']), SocietyController.addMember);
router.put('/members/:id', authenticate, authorize(['ADMIN']), SocietyController.updateMember);
router.delete('/members/:id', authenticate, authorize(['ADMIN']), SocietyController.removeMember);

// Super Admin
router.get('/stats', authenticate, authorize(['SUPER_ADMIN']), SocietyController.getStats);
router.get('/all', authenticate, authorize(['SUPER_ADMIN']), SocietyController.getAllSocieties);
router.get('/', authenticate, SocietyController.getAllSocieties);
router.get('/:id', authenticate, SocietyController.getSocietyById);
router.post('/', authenticate, authorize(['SUPER_ADMIN']), SocietyController.createSociety);
router.put('/:id', authenticate, authorize(['SUPER_ADMIN', 'ADMIN']), SocietyController.updateSociety);
router.patch('/:id/status', authenticate, authorize(['SUPER_ADMIN']), SocietyController.updateSocietyStatus);
router.delete('/:id', authenticate, authorize(['SUPER_ADMIN']), SocietyController.deleteSociety);
router.post('/:id/pay', authenticate, authorize(['ADMIN', 'SUPER_ADMIN']), SocietyController.processSocietyPayment);

// Guidelines: for-me is for any authenticated user (Admin/Resident/Individual/Vendor)
router.get('/guidelines/for-me', authenticate, SocietyController.getGuidelinesForMe);
// Guidelines Management
router.get('/guidelines', authenticate, SocietyController.getGuidelines);
router.post('/guidelines', authenticate, SocietyController.createGuideline);
router.put('/guidelines/:id', authenticate, SocietyController.updateGuideline);
router.delete('/guidelines/:id', authenticate, SocietyController.deleteGuideline);

module.exports = router;
