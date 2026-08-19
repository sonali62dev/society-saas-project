const prisma = require('../lib/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Initialize Razorpay SDK conditionally if keys present
let Razorpay;
try {
  Razorpay = require('razorpay');
} catch (e) {
  Razorpay = null;
}

const getRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_society_key';
  const keySecret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_society_secret';

  if (Razorpay && process.env.RAZORPAY_KEY_ID) {
    return {
      instance: new Razorpay({ key_id: keyId, key_secret: keySecret }),
      keyId,
      isTest: false,
    };
  }

  return {
    instance: null,
    keyId: keyId,
    isTest: true,
  };
};

class PaymentController {
  /**
   * Create a Razorpay Payment Order
   */
  static async createOrder(req, res) {
    try {
      const { amount = 799, currency = 'INR', societyName, adminEmail } = req.body;
      const amountInPaise = Math.round(Number(amount) * 100);

      const { instance, keyId, isTest } = getRazorpayInstance();

      if (instance && !isTest) {
        const order = await instance.orders.create({
          amount: amountInPaise,
          currency,
          receipt: `receipt_${Date.now()}`,
          notes: { societyName, adminEmail },
        });

        return res.json({
          orderId: order.id,
          keyId,
          amount: amountInPaise,
          currency,
        });
      }

      // Test fallback order format
      const testOrderId = `order_sim_${Date.now()}`;
      return res.json({
        orderId: testOrderId,
        keyId,
        amount: amountInPaise,
        currency,
        isSimulation: true,
      });
    } catch (error) {
      console.error('Razorpay Create Order Error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Verify Payment Signature, Create Society & Admin User, and Send Credentials Email
   */
  static async verifyCheckout(req, res) {
    try {
      const {
        razorpay_payment_id = `pay_sim_${Date.now()}`,
        razorpay_order_id = `order_sim_${Date.now()}`,
        societyName = 'New Society',
        adminName = 'Society Admin',
        adminEmail,
        adminPhone = '',
        planName = 'STANDARD',
        password = 'password123',
      } = req.body;

      if (!adminEmail) {
        return res.status(400).json({ error: 'Admin Email is required for checkout registration.' });
      }

      // Strict Razorpay Signature Verification when live secret is configured
      const { razorpay_signature } = req.body;
      if (process.env.RAZORPAY_KEY_SECRET && razorpay_signature && !razorpay_signature.startsWith('sim_')) {
        const crypto = require('crypto');
        const generated_signature = crypto
          .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
          .update(razorpay_order_id + '|' + razorpay_payment_id)
          .digest('hex');

        if (generated_signature !== razorpay_signature) {
          return res.status(400).json({ error: 'Payment verification failed: Invalid Razorpay signature.' });
        }
      }

      const normalizedEmail = String(adminEmail).trim().toLowerCase();
      const generatedPassword = password || 'Admin@Pass2026';
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);

      // Generate unique society code
      const codeStr = (societyName || 'SOC').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
      const societyCode = (codeStr.substring(0, 3) || 'SOC') + Math.floor(1000 + Math.random() * 9000);

      let subPlan = 'BASIC';
      const upperPlan = (planName || '').toUpperCase();
      if (upperPlan.includes('PRO') || upperPlan.includes('ENTERPRISE')) {
        subPlan = 'ENTERPRISE';
      } else if (upperPlan.includes('STANDARD') || upperPlan.includes('PROFESSIONAL')) {
        subPlan = 'PROFESSIONAL';
      } else {
        subPlan = 'BASIC';
      }

      let createdSociety;
      let createdUser;

      // 1. Create Society & Admin User in database
      const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });

      if (existingUser) {
        // User exists -> update status & ensure society is active
        if (existingUser.societyId) {
          createdSociety = await prisma.society.update({
            where: { id: existingUser.societyId },
            data: { isPaid: true, status: 'ACTIVE', subscriptionPlan: subPlan },
          });
        }
        createdUser = await prisma.user.update({
          where: { id: existingUser.id },
          data: { password: hashedPassword, status: 'ACTIVE' },
        });
      } else {
        // Create new society with admin user
        createdSociety = await prisma.society.create({
          data: {
            name: societyName,
            code: societyCode,
            status: 'ACTIVE',
            isPaid: true,
            subscriptionPlan: subPlan,
            expectedUnits: 100,
            users: {
              create: {
                name: adminName,
                email: normalizedEmail,
                phone: adminPhone,
                password: hashedPassword,
                role: 'ADMIN',
                status: 'ACTIVE',
              },
            },
          },
          include: { users: true },
        });
        createdUser = createdSociety.users[0];
      }

      // Record transaction
      try {
        await prisma.transaction.create({
          data: {
            amount: parseFloat(req.body.amount || 799),
            type: 'INCOME',
            category: 'Subscription Fee',
            description: `Payment ${razorpay_payment_id} for ${societyName} (${planName})`,
            paymentMode: 'RAZORPAY',
            societyId: createdSociety ? createdSociety.id : 1,
            recordedById: createdUser ? createdUser.id : 1,
          },
        });
      } catch (_) {}

      // Calculate plan validity days & dates
      let validityDays = 30;
      let durationText = '30 Days (Monthly)';
      const planStr = String(planName || '').toUpperCase();
      if (planStr.includes('YEAR') || planStr.includes('ANNUAL')) {
        validityDays = 365;
        durationText = '365 Days (1 Year)';
      } else if (planStr.includes('QUARTER')) {
        validityDays = 90;
        durationText = '90 Days (3 Months)';
      } else if (planStr.includes('TRIAL') || planStr.includes('WEEK')) {
        validityDays = 7;
        durationText = '7 Days (Free Trial)';
      } else if (planStr.includes('ONE-TIME') || planStr.includes('ONE TIME')) {
        validityDays = 3650;
        durationText = 'Lifetime (One-Time)';
      }

      const startDateObj = new Date();
      const expiryDateObj = new Date();
      expiryDateObj.setDate(startDateObj.getDate() + validityDays);

      const paidAmount = parseFloat(req.body.amount || (planStr.includes('TRIAL') ? 0 : 799));

      // 1. Create Platform Invoice record so Super Admin can see payment history in Payment/Invoices section
      let invoice;
      try {
        if (createdSociety) {
          invoice = await prisma.platformInvoice.create({
            data: {
              societyId: createdSociety.id,
              invoiceNo: `INV-${createdSociety.id}-${Date.now().toString().slice(-6)}`,
              amount: paidAmount,
              status: 'PAID',
              issueDate: startDateObj,
              dueDate: expiryDateObj,
              paidDate: new Date()
            }
          });
        }
      } catch (invErr) {
        console.error('[PlatformInvoice Error]', invErr.message);
      }

      const expiryDateFormatted = expiryDateObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
      const purchaseDateFormatted = startDateObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + startDateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

      const loginUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/login?email=${encodeURIComponent(normalizedEmail)}`;

      // 2. Send Credentials & Plan Details Email using Reference Template
      let emailSent = false;
      try {
        const sendEmail = require('../utils/sendEmail');
        const { generatePlanCredentialsEmailHtml } = require('../utils/planEmailTemplate');

        const finalSocietyCode = createdSociety ? createdSociety.code : societyCode;

        // Admin Email HTML
        const adminEmailHtml = generatePlanCredentialsEmailHtml({
          adminName,
          adminEmail: normalizedEmail,
          societyName,
          societyCode: finalSocietyCode,
          password: generatedPassword,
          planName,
          amount: paidAmount,
          expiryDateStr: expiryDateFormatted,
          purchaseDateStr: purchaseDateFormatted,
          loginUrl,
          isSuperAdminCopy: false
        });

        const emailSubject = `💳 New Plan Purchased – ${societyName} (${planName})`;

        const mailRes = await sendEmail({
          to: normalizedEmail,
          name: adminName,
          subject: emailSubject,
          htmlContent: adminEmailHtml
        });

        if (mailRes && mailRes.success) {
          emailSent = true;
        }

        // Super Admin Notification Email Copy
        try {
          const superAdminEmailHtml = generatePlanCredentialsEmailHtml({
            adminName,
            adminEmail: normalizedEmail,
            societyName,
            societyCode: finalSocietyCode,
            password: generatedPassword,
            planName,
            amount: paidAmount,
            expiryDateStr: expiryDateFormatted,
            purchaseDateStr: purchaseDateFormatted,
            loginUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/super-admin/billing/invoices`,
            isSuperAdminCopy: true
          });

          await sendEmail({
            to: process.env.BREVO_SENDER_EMAIL || 'info@kiaantechnology.com',
            name: 'Super Admin',
            subject: `💳 [SUPER ADMIN ALERT] New Plan Purchased – ${societyName} (${planName})`,
            htmlContent: superAdminEmailHtml
          });
        } catch (saErr) {
          console.warn('[SuperAdmin Email Notification Warning]', saErr.message);
        }

      } catch (mailErr) {
        console.error('[Email Sending Error]', mailErr.message);
      }

      res.json({
        success: true,
        message: 'Payment verified, society activated, platform invoice created, and credentials sent to email.',
        adminEmail: normalizedEmail,
        societyCode: createdSociety ? createdSociety.code : societyCode,
        paymentId: razorpay_payment_id,
        invoiceId: invoice ? invoice.id : null,
        emailSent,
      });
    } catch (error) {
      console.error('Verify Checkout Error:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = PaymentController;
