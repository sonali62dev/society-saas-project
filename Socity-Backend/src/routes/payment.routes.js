const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/Payment.controller');

router.post('/create-order', PaymentController.createOrder);
router.post('/verify-checkout', PaymentController.verifyCheckout);

module.exports = router;
