require('dotenv').config();
const sendEmail = require('./src/utils/sendEmail');
const { generatePlanCredentialsEmailHtml } = require('./src/utils/planEmailTemplate');

const emailHtml = generatePlanCredentialsEmailHtml({
  adminName: 'Sonali Admin',
  adminEmail: 'sonalipandey1821@gmail.com',
  societyName: 'Sharlow Bay Community',
  societyCode: 'SOC9482',
  password: 'Admin@Pass2026',
  planName: '7-Day Free Trial',
  amount: 0,
  expiryDateStr: '25 Aug 2026',
  purchaseDateStr: '18 Aug 2026, 11:28 am',
  loginUrl: 'http://localhost:3000/auth/login?email=sonalipandey1821%40gmail.com',
  isSuperAdminCopy: false
});

sendEmail({
  to: 'sonalipandey1821@gmail.com',
  name: 'Sonali Admin',
  subject: '💳 New Plan Purchased – Sharlow Bay Community (7-Day Free Trial)',
  htmlContent: emailHtml
}).then(res => console.log('Test Script Result:', res));
