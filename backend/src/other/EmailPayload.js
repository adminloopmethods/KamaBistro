// Dynamic email payload templates for user-related actions

// User Account Creation Email
export const userAccountCreationPayload = ({ name, email, password, dashboardUrl }) => ({
  to: email,
  subject: "Your Account Details",
  text: `Hello ${name}, your account has been created successfully. Username: ${email}, Password: ${password}. Please change your password after logging in.`,
  html: `
    <div style="background: linear-gradient(135deg, #e0e7ff 0%, #f9fafb 100%); min-height: 100vh; padding: 40px 0;">
      <div style="
        max-width: 480px;
        margin: 40px auto;
        padding: 32px 28px;
        border-radius: 24px;
        background: rgba(255, 255, 255, 0.25);
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
        backdrop-filter: blur(12px) saturate(180%);
        -webkit-backdrop-filter: blur(12px) saturate(180%);
        border: 1px solid rgba(255, 255, 255, 0.25);
        position: relative;
        overflow: hidden;
        animation: fadeInCard 1.2s cubic-bezier(.39,.575,.56,1) both;
      ">
        <svg width="100%" height="100" viewBox="0 0 480 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="position:absolute;top:0;left:0;z-index:0;pointer-events:none;">
          <defs>
            <linearGradient id="paint0_linear" x1="0" y1="0" x2="480" y2="100" gradientUnits="userSpaceOnUse">
              <stop stop-color="#a5b4fc"/>
              <stop offset="1" stop-color="#f472b6"/>
            </linearGradient>
          </defs>
          <ellipse cx="240" cy="50" rx="220" ry="40" fill="url(#paint0_linear)" fill-opacity="0.18"/>
        </svg>
        <h2 style="text-align:center;color:#333;font-size:2rem;font-weight:700;margin-bottom:12px;letter-spacing:0.5px;">Welcome! <span style="font-size:1.5rem;">🎉</span></h2>
  <p style="font-size:1.1rem;color:#444;text-align:center;margin-bottom:24px;">Hello <strong>${name}</strong>,</p>
  <p style="font-size:1.05rem;color:#555;text-align:center;margin-bottom:24px;">
    Your account has been <span style="color:#6366f1;font-weight:600;">created for you by Shade Corporation's administrator</span>.<br>
    These credentials are system-generated and provided to you by our team. Here are your login details:
  </p>
  <div style="background: rgba(255,255,255,0.45);border-radius: 14px;box-shadow: 0 2px 12px 0 rgba(99,102,241,0.08);padding: 18px 20px;margin-bottom: 24px;border: 1px solid rgba(99,102,241,0.13);display: flex;flex-direction: column;align-items: center;animation: slideInUp 1.1s cubic-bezier(.39,.575,.56,1) 0.2s both;">
    <p style="font-size:1.08rem;margin:0 0 8px 0;"><strong>Username:</strong> <span style="color:#6366f1;">${email}</span></p>
    <p style="font-size:1.08rem;margin:0;"><strong>Password:</strong> <span style="color:#f472b6;">${password}</span></p>
  </div>
  <p style="font-size:1rem;color:#666;text-align:center;margin-bottom:24px;">Please change your password after logging in for security purposes.</p>
  <div style="text-align:center;margin-bottom:24px;">
    <a href="${dashboardUrl}" style="display:inline-block;background: linear-gradient(90deg, #6366f1 0%, #f472b6 100%);color:#fff;padding: 14px 32px;font-size:1.08rem;font-weight:600;text-decoration:none;border-radius: 8px;box-shadow: 0 2px 8px 0 rgba(99,102,241,0.13);transition: background 0.3s, box-shadow 0.3s;letter-spacing:0.5px;">Login Now</a>
  </div>
          <hr style="border:none;border-top:1px solid #e0e7ff;margin:24px 0 16px 0;">
          <p style="font-size:0.95rem;color:#b0b0b0;text-align:center;margin:0;">© 2025 Shade Corporation Ltd. All rights reserved.</p>
        </div>
      </div>
      <style>
        @keyframes fadeInCard {
          0% { opacity: 0; transform: translateY(40px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes slideInUp {
          0% { opacity: 0; transform: translateY(32px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      </style>
    </div>
  `,
});

// User Account Deactivation Email
export const userAccountDeactivatedPayload = ({ name, email, supportEmail }) => ({
  to: email,
  subject: "Your Account Has Been Deactivated",
  text: `Hello ${name}, your account on Shade Corporation has been deactivated by the administrator. If you believe this is a mistake, please contact support.`,
  html: `
    <div style="background: linear-gradient(135deg, #e0e7ff 0%, #f9fafb 100%); min-height: 100vh; padding: 40px 0;">
      <div style="
        max-width: 480px;
        margin: 40px auto;
        padding: 32px 28px;
        border-radius: 24px;
        background: rgba(255, 255, 255, 0.25);
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
        backdrop-filter: blur(12px) saturate(180%);
        -webkit-backdrop-filter: blur(12px) saturate(180%);
        border: 1px solid rgba(255, 255, 255, 0.25);
        position: relative;
        overflow: hidden;
        animation: fadeInCard 1.2s cubic-bezier(.39,.575,.56,1) both;
      ">
        <svg width="100%" height="100" viewBox="0 0 480 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="position:absolute;top:0;left:0;z-index:0;pointer-events:none;">
          <defs>
            <linearGradient id="paint2_linear" x1="0" y1="0" x2="480" y2="100" gradientUnits="userSpaceOnUse">
              <stop stop-color="#a5b4fc"/>
              <stop offset="1" stop-color="#f472b6"/>
            </linearGradient>
          </defs>
          <ellipse cx="240" cy="50" rx="220" ry="40" fill="url(#paint2_linear)" fill-opacity="0.18"/>
        </svg>
        <div style="position:relative;z-index:1;">
          <h2 style="text-align:center;color:#e11d48;font-size:2rem;font-weight:700;margin-bottom:12px;letter-spacing:0.5px;">Account Deactivated</h2>
          <p style="font-size:1.1rem;color:#444;text-align:center;margin-bottom:24px;">Hello <strong>${name}</strong>,</p>
          <p style="font-size:1.05rem;color:#e11d48;text-align:center;margin-bottom:24px;font-weight:600;">Your account has been deactivated by Shade Corporation's administrator.</p>
          <p style="font-size:1.05rem;color:#555;text-align:center;margin-bottom:24px;">If you believe this was a mistake or need further assistance, please contact our support team.</p>
          <div style="text-align:center;margin-bottom:24px;">
            <a href="mailto:${supportEmail}" style="
              display:inline-block;
              background: linear-gradient(90deg, #6366f1 0%, #f472b6 100%);
              color:#fff;
              padding: 14px 32px;
              font-size:1.08rem;
              font-weight:600;
              text-decoration:none;
              border-radius: 8px;
              box-shadow: 0 2px 8px 0 rgba(99,102,241,0.13);
              transition: background 0.3s, box-shadow 0.3s;
              letter-spacing:0.5px;
            ">Contact Support</a>
          </div>
          <hr style="border:none;border-top:1px solid #e0e7ff;margin:24px 0 16px 0;">
          <p style="font-size:0.95rem;color:#b0b0b0;text-align:center;margin:0;">© 2025 Shade Corporation Ltd. All rights reserved.</p>
        </div>
      </div>
      <style>
        @keyframes fadeInCard {
          0% { opacity: 0; transform: translateY(40px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      </style>
    </div>
  `,
});

// User Account Activation Email
export const userAccountActivatedPayload = ({ name, email, dashboardUrl }) => ({
  to: email,
  subject: "Your Account Has Been Activated",
  text: `Hello ${name}, your account on Shade Corporation has been activated by the administrator. You can now log in. If you have questions, please contact support.`,
  html: `
    <div style="background: linear-gradient(135deg, #e0e7ff 0%, #f9fafb 100%); min-height: 100vh; padding: 40px 0;">
      <div style="
        max-width: 480px;
        margin: 40px auto;
        padding: 32px 28px;
        border-radius: 24px;
        background: rgba(255, 255, 255, 0.25);
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
        backdrop-filter: blur(12px) saturate(180%);
        -webkit-backdrop-filter: blur(12px) saturate(180%);
        border: 1px solid rgba(255, 255, 255, 0.25);
        position: relative;
        overflow: hidden;
        animation: fadeInCard 1.2s cubic-bezier(.39,.575,.56,1) both;
      ">
        <svg width="100%" height="100" viewBox="0 0 480 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="position:absolute;top:0;left:0;z-index:0;pointer-events:none;">
          <defs>
            <linearGradient id="paint3_linear" x1="0" y1="0" x2="480" y2="100" gradientUnits="userSpaceOnUse">
              <stop stop-color="#a5b4fc"/>
              <stop offset="1" stop-color="#34d399"/>
            </linearGradient>
          </defs>
          <ellipse cx="240" cy="50" rx="220" ry="40" fill="url(#paint3_linear)" fill-opacity="0.18"/>
        </svg>
        <div style="position:relative;z-index:1;">
          <h2 style="text-align:center;color:#10b981;font-size:2rem;font-weight:700;margin-bottom:12px;letter-spacing:0.5px;">Account Activated</h2>
          <p style="font-size:1.1rem;color:#444;text-align:center;margin-bottom:24px;">Hello <strong>${name}</strong>,</p>
          <p style="font-size:1.05rem;color:#10b981;text-align:center;margin-bottom:24px;font-weight:600;">Your account has been activated by Shade Corporation's administrator.</p>
          <p style="font-size:1.05rem;color:#555;text-align:center;margin-bottom:24px;">You can now log in and access your account.</p>
          <div style="text-align:center;margin-bottom:24px;">
            <a href="${dashboardUrl}" style="
              display:inline-block;
              background: linear-gradient(90deg, #6366f1 0%, #34d399 100%);
              color:#fff;
              padding: 14px 32px;
              font-size:1.08rem;
              font-weight:600;
              text-decoration:none;
              border-radius: 8px;
              box-shadow: 0 2px 8px 0 rgba(99,102,241,0.13);
              transition: background 0.3s, box-shadow 0.3s;
              letter-spacing:0.5px;
            ">Login Now</a>
          </div>
          <hr style="border:none;border-top:1px solid #e0e7ff;margin:24px 0 16px 0;">
          <p style="font-size:0.95rem;color:#b0b0b0;text-align:center;margin:0;">© 2025 Shade Corporation Ltd. All rights reserved.</p>
        </div>
      </div>
      <style>
        @keyframes fadeInCard {
          0% { opacity: 0; transform: translateY(40px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      </style>
    </div>
  `,
});

// Resource Assignment Email
export const resourceAssignmentPayload = ({ name, email, role, resourceName, dashboardUrl }) => ({
  to: email,
  subject: `You have been assigned as ${role} on ${resourceName}`,
  text: `Hello ${name}, you have been assigned the role of ${role} on the resource "${resourceName}". You can now log in and perform your tasks.`,
  html: `
    <div style="background: linear-gradient(135deg, #e0e7ff 0%, #f9fafb 100%); min-height: 100vh; padding: 40px 0;">
      <div style="
        max-width: 480px;
        margin: 40px auto;
        padding: 32px 28px;
        border-radius: 24px;
        background: rgba(255, 255, 255, 0.25);
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
        backdrop-filter: blur(12px) saturate(180%);
        -webkit-backdrop-filter: blur(12px) saturate(180%);
        border: 1px solid rgba(255, 255, 255, 0.25);
        position: relative;
        overflow: hidden;
        animation: fadeInCard 1.2s cubic-bezier(.39,.575,.56,1) both;
      ">
        <svg width="100%" height="100" viewBox="0 0 480 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="position:absolute;top:0;left:0;z-index:0;pointer-events:none;">
          <defs>
            <linearGradient id="paint4_linear" x1="0" y1="0" x2="480" y2="100" gradientUnits="userSpaceOnUse">
              <stop stop-color="#a5b4fc"/>
              <stop offset="1" stop-color="#f472b6"/>
            </linearGradient>
          </defs>
          <ellipse cx="240" cy="50" rx="220" ry="40" fill="url(#paint4_linear)" fill-opacity="0.18"/>
        </svg>
        <div style="position:relative;z-index:1;">
          <h2 style="text-align:center;color:#6366f1;font-size:2rem;font-weight:700;margin-bottom:12px;letter-spacing:0.5px;">Role Assigned</h2>
          <p style="font-size:1.1rem;color:#444;text-align:center;margin-bottom:24px;">Hello <strong>${name}</strong>,</p>
          <p style="font-size:1.05rem;color:#6366f1;text-align:center;margin-bottom:24px;font-weight:600;">You have been assigned the role of <span style='color:#f472b6;'>${role}</span> on the resource <span style='color:#6366f1;'>${resourceName}</span>.</p>
          <p style="font-size:1.05rem;color:#555;text-align:center;margin-bottom:24px;">You can now log in and perform your tasks for this resource.</p>
          <div style="text-align:center;margin-bottom:24px;">
            <a href="${dashboardUrl}" style="
              display:inline-block;
              background: linear-gradient(90deg, #6366f1 0%, #f472b6 100%);
              color:#fff;
              padding: 14px 32px;
              font-size:1.08rem;
              font-weight:600;
              text-decoration:none;
              border-radius: 8px;
              box-shadow: 0 2px 8px 0 rgba(99,102,241,0.13);
              transition: background 0.3s, box-shadow 0.3s;
              letter-spacing:0.5px;
            ">Login Now</a>
          </div>
          <hr style="border:none;border-top:1px solid #e0e7ff;margin:24px 0 16px 0;">
          <p style="font-size:0.95rem;color:#b0b0b0;text-align:center;margin:0;">© 2025 Shade Corporation Ltd. All rights reserved.</p>
        </div>
      </div>
      <style>
        @keyframes fadeInCard {
          0% { opacity: 0; transform: translateY(40px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      </style>
    </div>
  `,
});

// Resource Access Removed Email
export const resourceAccessRemovedPayload = ({ name, email, resourceName, supportEmail }) => ({
  to: email,
  subject: `Your access to ${resourceName} has been removed` ,
  text: `Hello ${name}, your access to the resource "${resourceName}" has been removed. You no longer have permissions to view or edit this resource.` ,
  html: `
    <div style="background: linear-gradient(135deg, #e0e7ff 0%, #f9fafb 100%); min-height: 100vh; padding: 40px 0;">
      <div style="
        max-width: 480px;
        margin: 40px auto;
        padding: 32px 28px;
        border-radius: 24px;
        background: rgba(255, 255, 255, 0.25);
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
        backdrop-filter: blur(12px) saturate(180%);
        -webkit-backdrop-filter: blur(12px) saturate(180%);
        border: 1px solid rgba(255, 255, 255, 0.25);
        position: relative;
        overflow: hidden;
        animation: fadeInCard 1.2s cubic-bezier(.39,.575,.56,1) both;
      ">
        <svg width="100%" height="100" viewBox="0 0 480 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="position:absolute;top:0;left:0;z-index:0;pointer-events:none;">
          <defs>
            <linearGradient id="paint5_linear" x1="0" y1="0" x2="480" y2="100" gradientUnits="userSpaceOnUse">
              <stop stop-color="#a5b4fc"/>
              <stop offset="1" stop-color="#e11d48"/>
            </linearGradient>
          </defs>
          <ellipse cx="240" cy="50" rx="220" ry="40" fill="url(#paint5_linear)" fill-opacity="0.18"/>
        </svg>
        <div style="position:relative;z-index:1;">
          <h2 style="text-align:center;color:#e11d48;font-size:2rem;font-weight:700;margin-bottom:12px;letter-spacing:0.5px;">Access Removed</h2>
          <p style="font-size:1.1rem;color:#444;text-align:center;margin-bottom:24px;">Hello <strong>${name}</strong>,</p>
          <p style="font-size:1.05rem;color:#e11d48;text-align:center;margin-bottom:24px;font-weight:600;">Your access to the resource <span style='color:#6366f1;'>${resourceName}</span> has been removed.</p>
          <p style="font-size:1.05rem;color:#555;text-align:center;margin-bottom:24px;">You no longer have permissions to view or edit this resource. If you believe this was a mistake, please contact support.</p>
          <div style="text-align:center;margin-bottom:24px;">
            <a href="mailto:${supportEmail}" style="
              display:inline-block;
              background: linear-gradient(90deg, #6366f1 0%, #e11d48 100%);
              color:#fff;
              padding: 14px 32px;
              font-size:1.08rem;
              font-weight:600;
              text-decoration:none;
              border-radius: 8px;
              box-shadow: 0 2px 8px 0 rgba(99,102,241,0.13);
              transition: background 0.3s, box-shadow 0.3s;
              letter-spacing:0.5px;
            ">Contact Support</a>
          </div>
          <hr style="border:none;border-top:1px solid #e0e7ff;margin:24px 0 16px 0;">
          <p style="font-size:0.95rem;color:#b0b0b0;text-align:center;margin:0;">© 2025 Shade Corporation Ltd. All rights reserved.</p>
        </div>
      </div>
      <style>
        @keyframes fadeInCard {
          0% { opacity: 0; transform: translateY(40px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      </style>
    </div>
  `,
});

// 1. Notify Verifier of New Request
export const notifyVerifierRequest = ({ name, email, resourceName, dashboardUrl }) => ({
  to: email,
  subject: `New Request to Verify: ${resourceName}`,
  text: `Hello ${name}, you have a new request to verify for "${resourceName}". Please check your dashboard and review it.`,
  html: `<div style="background: linear-gradient(135deg, #e0e7ff 0%, #f9fafb 100%); min-height: 100vh; padding: 40px 0;"><div style="max-width: 480px; margin: 40px auto; padding: 32px 28px; border-radius: 24px; background: rgba(255, 255, 255, 0.25); box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18); backdrop-filter: blur(12px) saturate(180%); -webkit-backdrop-filter: blur(12px) saturate(180%); border: 1px solid rgba(255, 255, 255, 0.25); position: relative; overflow: hidden; animation: fadeInCard 1.2s cubic-bezier(.39,.575,.56,1) both;"><h2 style="text-align:center;color:#6366f1;font-size:2rem;font-weight:700;margin-bottom:12px;letter-spacing:0.5px;">New Request to Verify</h2><p style="font-size:1.1rem;color:#444;text-align:center;margin-bottom:24px;">Hello <strong>${name}</strong>,</p><p style="font-size:1.05rem;color:#6366f1;text-align:center;margin-bottom:24px;font-weight:600;">You have a new request to verify for <span style='color:#f472b6;'>${resourceName}</span>.</p><p style="font-size:1.05rem;color:#555;text-align:center;margin-bottom:24px;">Please check your dashboard and review it.</p><div style="text-align:center;margin-bottom:24px;"><a href="${dashboardUrl}" style="display:inline-block;background: linear-gradient(90deg, #6366f1 0%, #f472b6 100%);color:#fff;padding: 14px 32px;font-size:1.08rem;font-weight:600;text-decoration:none;border-radius: 8px;box-shadow: 0 2px 8px 0 rgba(99,102,241,0.13);transition: background 0.3s, box-shadow 0.3s;letter-spacing:0.5px;">Go to Dashboard</a></div><hr style="border:none;border-top:1px solid #e0e7ff;margin:24px 0 16px 0;"><p style="font-size:0.95rem;color:#b0b0b0;text-align:center;margin:0;">© 2025 Shade Corporation Ltd. All rights reserved.</p></div></div>`
});

// 2. Notify Editor of Rejection
export const notifyEditorRejected = ({ name, email, resourceName, rejectedBy, stage, reason, dashboardUrl }) => ({
  to: email,
  subject: `Request Rejected: ${resourceName}`,
  text: `Hello ${name}, your request for "${resourceName}" has been rejected by ${rejectedBy} (${stage}). Reason: ${reason}`,
  html: `<div style="background: linear-gradient(135deg, #e0e7ff 0%, #f9fafb 100%); min-height: 100vh; padding: 40px 0;"><div style="max-width: 480px; margin: 40px auto; padding: 32px 28px; border-radius: 24px; background: rgba(255, 255, 255, 0.25); box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18); backdrop-filter: blur(12px) saturate(180%); -webkit-backdrop-filter: blur(12px) saturate(180%); border: 1px solid rgba(255, 255, 255, 0.25); position: relative; overflow: hidden; animation: fadeInCard 1.2s cubic-bezier(.39,.575,.56,1) both;"><h2 style="text-align:center;color:#e11d48;font-size:2rem;font-weight:700;margin-bottom:12px;letter-spacing:0.5px;">Request Rejected</h2><p style="font-size:1.1rem;color:#444;text-align:center;margin-bottom:24px;">Hello <strong>${name}</strong>,</p><p style="font-size:1.05rem;color:#e11d48;text-align:center;margin-bottom:24px;font-weight:600;">Your request for <span style='color:#6366f1;'>${resourceName}</span> has been rejected by <strong>${rejectedBy}</strong> (${stage}).</p><p style="font-size:1.05rem;color:#555;text-align:center;margin-bottom:24px;">Reason: <span style='color:#e11d48;'>${reason}</span></p><div style="text-align:center;margin-bottom:24px;"><a href="${dashboardUrl}" style="display:inline-block;background: linear-gradient(90deg, #6366f1 0%, #e11d48 100%);color:#fff;padding: 14px 32px;font-size:1.08rem;font-weight:600;text-decoration:none;border-radius: 8px;box-shadow: 0 2px 8px 0 rgba(99,102,241,0.13);transition: background 0.3s, box-shadow 0.3s;letter-spacing:0.5px;">Go to Dashboard</a></div><hr style="border:none;border-top:1px solid #e0e7ff;margin:24px 0 16px 0;"><p style="font-size:0.95rem;color:#b0b0b0;text-align:center;margin:0;">© 2025 Shade Corporation Ltd. All rights reserved.</p></div></div>`
});

// 3. Notify Verifier/Publisher of Resubmission
export const notifyVerifierResubmission = ({ name, email, resourceName, dashboardUrl }) => ({
  to: email,
  subject: `Resubmission: ${resourceName} is Ready for Review Again` ,
  text: `Hello ${name}, the page you previously rejected has been updated and is ready for your review again.` ,
  html: `<div style="background: linear-gradient(135deg, #e0e7ff 0%, #f9fafb 100%); min-height: 100vh; padding: 40px 0;"><div style="max-width: 480px; margin: 40px auto; padding: 32px 28px; border-radius: 24px; background: rgba(255, 255, 255, 0.25); box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18); backdrop-filter: blur(12px) saturate(180%); -webkit-backdrop-filter: blur(12px) saturate(180%); border: 1px solid rgba(255, 255, 255, 0.25); position: relative; overflow: hidden; animation: fadeInCard 1.2s cubic-bezier(.39,.575,.56,1) both;"><h2 style="text-align:center;color:#6366f1;font-size:2rem;font-weight:700;margin-bottom:12px;letter-spacing:0.5px;">Resubmission Ready for Review</h2><p style="font-size:1.1rem;color:#444;text-align:center;margin-bottom:24px;">Hello <strong>${name}</strong>,</p><p style="font-size:1.05rem;color:#6366f1;text-align:center;margin-bottom:24px;font-weight:600;">The page you previously rejected (<span style='color:#f472b6;'>${resourceName}</span>) has been updated and is ready for your review again.</p><div style="text-align:center;margin-bottom:24px;"><a href="${dashboardUrl}" style="display:inline-block;background: linear-gradient(90deg, #6366f1 0%, #f472b6 100%);color:#fff;padding: 14px 32px;font-size:1.08rem;font-weight:600;text-decoration:none;border-radius: 8px;box-shadow: 0 2px 8px 0 rgba(99,102,241,0.13);transition: background 0.3s, box-shadow 0.3s;letter-spacing:0.5px;">Go to Dashboard</a></div><hr style="border:none;border-top:1px solid #e0e7ff;margin:24px 0 16px 0;"><p style="font-size:0.95rem;color:#b0b0b0;text-align:center;margin:0;">© 2025 Shade Corporation Ltd. All rights reserved.</p></div></div>`
});

// 4. Notify Next Approver (Verifier or Publisher)
export const notifyNextApprover = ({ name, email, resourceName, stage, dashboardUrl }) => ({
  to: email,
  subject: `Request Ready for Your Review: ${resourceName}`,
  text: `Hello ${name}, a request for "${resourceName}" is now ready for your review as ${stage}. Please check your dashboard and approve or reject it.`,
  html: `<div style="background: linear-gradient(135deg, #e0e7ff 0%, #f9fafb 100%); min-height: 100vh; padding: 40px 0;"><div style="max-width: 480px; margin: 40px auto; padding: 32px 28px; border-radius: 24px; background: rgba(255, 255, 255, 0.25); box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18); backdrop-filter: blur(12px) saturate(180%); -webkit-backdrop-filter: blur(12px) saturate(180%); border: 1px solid rgba(255, 255, 255, 0.25); position: relative; overflow: hidden; animation: fadeInCard 1.2s cubic-bezier(.39,.575,.56,1) both;"><h2 style="text-align:center;color:#6366f1;font-size:2rem;font-weight:700;margin-bottom:12px;letter-spacing:0.5px;">Request Ready for Your Review</h2><p style="font-size:1.1rem;color:#444;text-align:center;margin-bottom:24px;">Hello <strong>${name}</strong>,</p><p style="font-size:1.05rem;color:#6366f1;text-align:center;margin-bottom:24px;font-weight:600;">A request for <span style='color:#f472b6;'>${resourceName}</span> is now ready for your review as <strong>${stage}</strong>.</p><p style="font-size:1.05rem;color:#555;text-align:center;margin-bottom:24px;">Please check your dashboard and approve or reject it.</p><div style="text-align:center;margin-bottom:24px;"><a href="${dashboardUrl}" style="display:inline-block;background: linear-gradient(90deg, #6366f1 0%, #f472b6 100%);color:#fff;padding: 14px 32px;font-size:1.08rem;font-weight:600;text-decoration:none;border-radius: 8px;box-shadow: 0 2px 8px 0 rgba(99,102,241,0.13);transition: background 0.3s, box-shadow 0.3s;letter-spacing:0.5px;">Go to Dashboard</a></div><hr style="border:none;border-top:1px solid #e0e7ff;margin:24px 0 16px 0;"><p style="font-size:0.95rem;color:#b0b0b0;text-align:center;margin:0;">© 2025 Shade Corporation Ltd. All rights reserved.</p></div></div>`
});

// 5. Notify Editor of Publication/Scheduling
export const notifyEditorPublished = ({ name, email, resourceName, publishedAt, scheduledAt, dashboardUrl }) => ({
  to: email,
  subject: publishedAt ? `Published: ${resourceName}` : `Scheduled: ${resourceName}`,
  text: publishedAt
    ? `Hello ${name}, your request for "${resourceName}" has been published and is now live.`
    : `Hello ${name}, your request for "${resourceName}" has been scheduled for publication on ${scheduledAt}.`,
  html: `<div style="background: linear-gradient(135deg, #e0e7ff 0%, #f9fafb 100%); min-height: 100vh; padding: 40px 0;"><div style="max-width: 480px; margin: 40px auto; padding: 32px 28px; border-radius: 24px; background: rgba(255, 255, 255, 0.25); box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18); backdrop-filter: blur(12px) saturate(180%); -webkit-backdrop-filter: blur(12px) saturate(180%); border: 1px solid rgba(255, 255, 255, 0.25); position: relative; overflow: hidden; animation: fadeInCard 1.2s cubic-bezier(.39,.575,.56,1) both;"><h2 style="text-align:center;color:#10b981;font-size:2rem;font-weight:700;margin-bottom:12px;letter-spacing:0.5px;">${publishedAt ? 'Published' : 'Scheduled'}</h2><p style="font-size:1.1rem;color:#444;text-align:center;margin-bottom:24px;">Hello <strong>${name}</strong>,</p><p style="font-size:1.05rem;color:#10b981;text-align:center;margin-bottom:24px;font-weight:600;">Your request for <span style='color:#6366f1;'>${resourceName}</span> has been ${publishedAt ? 'published and is now live' : `scheduled for publication on <strong>${scheduledAt}</strong>`}.</p><div style="text-align:center;margin-bottom:24px;"><a href="${dashboardUrl}" style="display:inline-block;background: linear-gradient(90deg, #6366f1 0%, #34d399 100%);color:#fff;padding: 14px 32px;font-size:1.08rem;font-weight:600;text-decoration:none;border-radius: 8px;box-shadow: 0 2px 8px 0 rgba(99,102,241,0.13);transition: background 0.3s, box-shadow 0.3s;letter-spacing:0.5px;">Go to Dashboard</a></div><hr style="border:none;border-top:1px solid #e0e7ff;margin:24px 0 16px 0;"><p style="font-size:0.95rem;color:#b0b0b0;text-align:center;margin:0;">© 2025 Shade Corporation Ltd. All rights reserved.</p></div></div>`
});

// Reminder Email
export const reminderPayload = ({ to, subject, message }) => ({
  to,
  subject,
  text: `Subject: ${subject}\nMessage: ${message}\n\nSent via Shade CMS Reminder`,
  html: `
    <div style="background: linear-gradient(135deg, #e0e7ff 0%, #f9fafb 100%); min-height: 100vh; padding: 40px 0;">
      <div style="
        max-width: 480px;
        margin: 40px auto;
        padding: 32px 28px;
        border-radius: 24px;
        background: rgba(255, 255, 255, 0.25);
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
        backdrop-filter: blur(12px) saturate(180%);
        -webkit-backdrop-filter: blur(12px) saturate(180%);
        border: 1px solid rgba(255, 255, 255, 0.25);
        position: relative;
        overflow: hidden;
        animation: fadeInCard 1.2s cubic-bezier(.39,.575,.56,1) both;">
        <svg width="100%" height="100" viewBox="0 0 480 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="position:absolute;top:0;left:0;z-index:0;pointer-events:none;">
          <defs>
            <linearGradient id="reminder_linear" x1="0" y1="0" x2="480" y2="100" gradientUnits="userSpaceOnUse">
              <stop stop-color="#a5b4fc"/>
              <stop offset="1" stop-color="#6366f1"/>
            </linearGradient>
          </defs>
          <ellipse cx="240" cy="50" rx="220" ry="40" fill="url(#reminder_linear)" fill-opacity="0.18"/>
        </svg>
        <div style="position:relative;z-index:1;">
          <h2 style="text-align:center;color:#6366f1;font-size:2rem;font-weight:700;margin-bottom:12px;letter-spacing:0.5px;">You have a new reminder!</h2>
          <div style="background: rgba(255,255,255,0.45);border-radius: 14px;box-shadow: 0 2px 12px 0 rgba(99,102,241,0.08);padding: 18px 20px;margin-bottom: 24px;border: 1px solid rgba(99,102,241,0.13);display: flex;flex-direction: column;align-items: center;animation: slideInUp 1.1s cubic-bezier(.39,.575,.56,1) 0.2s both;">
            <p style="font-size:1.08rem;margin:0 0 8px 0;color:#333;"><strong>Subject:</strong> <span style="color:#6366f1;">${subject}</span></p>
            <p style="font-size:1.08rem;margin:0;color:#444;"><strong>Message:</strong></p>
            <p style="font-size:1.05rem;margin:8px 0 0 0;color:#555;white-space:pre-line;">${message}</p>
          </div>
          <hr style="border:none;border-top:1px solid #e0e7ff;margin:24px 0 16px 0;">
          <p style="font-size:0.95rem;color:#b0b0b0;text-align:center;margin:0;">Sent via Shade CMS Reminder</p>
        </div>
      </div>
      <style>
        @keyframes fadeInCard {
          0% { opacity: 0; transform: translateY(40px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes slideInUp {
          0% { opacity: 0; transform: translateY(32px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      </style>
    </div>
  `
});

// Add more payload templates as needed and export them here
