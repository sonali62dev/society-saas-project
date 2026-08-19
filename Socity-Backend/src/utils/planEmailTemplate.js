/**
 * Email template generator matching the requested reference image:
 * Soft green details card (#f0fdf4), dark banner header, bold Kiaan Technology branding,
 * formatted table with Admin details, credentials, society code, plan name, amount paid (₹),
 * expiry date, purchase timestamp, CTA button, and official footer.
 */

function generatePlanCredentialsEmailHtml({
  adminName = '',
  adminEmail = '',
  societyName = '',
  societyCode = '',
  password = '',
  planName = '',
  amount = 0,
  expiryDateStr = '',
  purchaseDateStr = '',
  loginUrl = '',
  isSuperAdminCopy = false
}) {
  const currentYear = new Date().getFullYear();
  const displayAmount = (amount !== undefined && amount !== null && amount !== '') ? amount : 0;
  
  const subtitleText = isSuperAdminCopy 
    ? 'An admin has successfully purchased a subscription plan.' 
    : 'Your society admin account and subscription plan have been successfully activated.';
    
  const bottomNoteText = isSuperAdminCopy 
    ? 'Login to the SuperAdmin panel to manage this subscription and monitor usage.' 
    : 'Login to the Admin panel to manage your society subscription and start using the platform.';

  return `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); overflow: hidden;">
  <!-- Header Banner -->
  <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 28px 24px; text-align: center;">
    <div style="font-size: 20px; font-weight: 800; color: #ffffff; letter-spacing: 0.5px;">🧺 Kiaan Technology</div>
    <div style="font-size: 12px; font-weight: 500; color: #94a3b8; margin-top: 4px;">Society Management SaaS Platform</div>
  </div>

  <!-- Main Body Content -->
  <div style="padding: 32px 28px 24px 28px; background-color: #ffffff;">
    <h2 style="font-size: 22px; font-weight: 800; color: #0f172a; margin: 0 0 6px 0;">New Plan Purchased! 🎉</h2>
    <p style="font-size: 14px; color: #64748b; margin: 0 0 24px 0;">${subtitleText}</p>

    <!-- Plan & Credentials Box (Soft Light Green) -->
    <div style="background-color: #f0fdf4; border: 1px solid #dcfce7; border-radius: 12px; padding: 20px 24px; margin-bottom: 24px;">
      <div style="font-size: 13px; font-weight: 800; color: #16a34a; letter-spacing: 0.5px; margin-bottom: 16px; text-transform: uppercase;">📋 PLAN DETAILS</div>
      
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr>
          <td style="padding: 8px 0; color: #64748b; width: 140px;">Admin Name</td>
          <td style="padding: 8px 0; font-weight: 700; color: #0f172a;">${adminName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b;">Admin Email</td>
          <td style="padding: 8px 0; font-weight: 700; color: #0284c7;"><a href="mailto:${adminEmail}" style="color: #0284c7; text-decoration: none;">${adminEmail}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b;">Branch</td>
          <td style="padding: 8px 0; font-weight: 700; color: #0f172a;">${societyName}</td>
        </tr>
        ${societyCode ? `
        <tr>
          <td style="padding: 8px 0; color: #64748b;">Society Code</td>
          <td style="padding: 8px 0;"><span style="background-color: #ffffff; border: 1px solid #16a34a; color: #16a34a; font-family: monospace; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 13px;">${societyCode}</span></td>
        </tr>
        ` : ''}
        ${password ? `
        <tr>
          <td style="padding: 8px 0; color: #64748b;">Password</td>
          <td style="padding: 8px 0;"><span style="background-color: #ffffff; border: 1px solid #d97706; color: #d97706; font-family: monospace; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 13px;">${password}</span></td>
        </tr>
        ` : ''}
        <tr>
          <td style="padding: 8px 0; color: #64748b;">Plan Name</td>
          <td style="padding: 8px 0; font-weight: 700; color: #0f172a;">${planName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b;">Amount Paid</td>
          <td style="padding: 8px 0; font-weight: 800; color: #16a34a;">₹${displayAmount}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b;">Plan Expiry</td>
          <td style="padding: 8px 0; font-weight: 700; color: #0f172a;">${expiryDateStr}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b;">Purchase Date</td>
          <td style="padding: 8px 0; color: #64748b;">${purchaseDateStr}</td>
        </tr>
      </table>
    </div>

    <p style="font-size: 13px; color: #64748b; text-align: center; margin-top: 16px; margin-bottom: 24px;">${bottomNoteText}</p>

    <!-- Login CTA Button -->
    <div style="text-align: center; margin-bottom: 28px;">
      <a href="${loginUrl}" style="background-color: #10b981; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 14px; padding: 14px 36px; border-radius: 8px; display: inline-block; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">LOGIN TO ADMIN DASHBOARD →</a>
    </div>
  </div>

  <!-- Footer -->
  <div style="background-color: #ffffff; padding: 20px 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9;">
    © ${currentYear} Kiaan Technology Private Limited | <a href="https://kiaantechnology.com" style="color: #0284c7; text-decoration: none;">kiaantechnology.com</a><br />
    This is an automated message. For help, contact <a href="mailto:support@kiaantechnology.com" style="color: #0284c7; text-decoration: none;">support@kiaantechnology.com</a>
  </div>
</div>
  `;
}

module.exports = { generatePlanCredentialsEmailHtml };
