export function createWelcomeEmailTemplate(name, recoveryCode, clientURL) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to MernChat</title>
  </head>
  <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a; color: #e2e8f0; margin: 0; padding: 0;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #1e293b; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 20px rgba(0,0,0,0.3);">

      <div style="padding: 32px; text-align: center; background-color: #1e293b;">
        <h1 style="color: #38bdf8; font-size: 28px; margin-bottom: 10px;">Welcome to MernChat</h1>
        <p style="color: #94a3b8; margin: 0;">Secure • Fast • Private</p>
      </div>

      <div style="background-color: #0f172a; padding: 32px;">
        <p style="font-size: 18px; color: #38bdf8; margin-top: 0;"><strong>Hello ${name},</strong></p>
        <p>Welcome to <strong>MernChat</strong> — your private, fast, and modern messaging platform where you can connect anytime, anywhere.</p>
        <p>This is your recovery code, save it for recovery reasons: ${recoveryCode}</p>

        <div style="background-color: #1e293b; padding: 20px; border-radius: 10px; border-left: 4px solid #38bdf8; margin: 24px 0;">
          <p style="margin: 0 0 12px 0;"><strong>Here's what you can do inside MernChat:</strong></p>
          <ul style="padding-left: 20px; margin: 0;">
            <li style="margin-bottom: 8px;">Customize your profile</li>
            <li style="margin-bottom: 8px;">Chat in real time with anyone</li>
            <li style="margin-bottom: 8px;">Share images and files securely</li>
            <li style="margin-bottom: 0;">Enjoy a clean and modern UI</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${clientURL}" style="background-color: #38bdf8; color: #0f172a; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; display: inline-block;">Open MernChat</a>
        </div>

        <p>If you ever need help, feel free to check our project resources below.</p>
        <p style="margin-top: 24px; margin-bottom: 0;">Best regards,<br />The MernChat Team</p>
      </div>

      <div style="text-align: center; padding: 20px; background-color: #1e293b; font-size: 12px; color: #94a3b8;">
        <p>© 2025 MernChat. All rights reserved.</p>
        <p>
          <a href="https://github.com/MihanN1/MernChat#2-terms-of-use-tou" style="color: #38bdf8; text-decoration: none; margin: 0 10px;">Terms of Use</a>
          <a href="https://github.com/MihanN1/MernChat#3-code-of-conduct-coc" style="color: #38bdf8; text-decoration: none; margin: 0 10px;">Code of Conduct</a>
          <a href="https://github.com/MihanN1/MernChat#mernchat-privacy-policy" style="color: #38bdf8; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
          <a href="https://github.com/MihanN1/MernChat#-contacts" style="color: #38bdf8; text-decoration: none; margin: 0 10px;">Contacts</a>
        </p>
      </div>

    </div>
  </body>
  </html>
  `;
};
export function createNewRecoveryEmailTemplate(name, recoveryCode, clientURL) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>New Recovery Code - MernChat</title>
  </head>
  <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a; color: #e2e8f0; margin: 0; padding: 0;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #1e293b; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 20px rgba(0,0,0,0.3);">

      <div style="padding: 32px; text-align: center; background-color: #1e293b;">
        <h1 style="color: #38bdf8; font-size: 28px; margin-bottom: 10px;">New Recovery Code</h1>
        <p style="color: #94a3b8; margin: 0;">Keep this code safe</p>
      </div>

      <div style="background-color: #0f172a; padding: 32px;">
        <p style="font-size: 18px; color: #38bdf8; margin-top: 0;"><strong>Hello ${name},</strong></p>
        <p>You have requested a new recovery code for your <strong>MernChat</strong> account. This code is required for account recovery operations.</p>
        
        <div style="background-color: #1e293b; padding: 20px; border-radius: 10px; text-align: center; margin: 24px 0; border: 1px solid #334155;">
          <p style="margin: 0 0 10px 0; color: #94a3b8; font-size: 14px;">Your new recovery code:</p>
          <div style="font-size: 24px; font-weight: bold; color: #38bdf8; letter-spacing: 2px; padding: 10px; background-color: #0f172a; border-radius: 6px; margin: 0 auto; display: inline-block;">
            ${recoveryCode}
          </div>
          <p style="color: #f87171; font-size: 14px; margin: 10px 0 0 0;">
            Keep this code secure and don't share it with anyone!!!!
          </p>
        </div>

        <div style="background-color: #1e293b; padding: 16px; border-radius: 8px; margin: 24px 0; border-left: 4px solid #10b981;">
          <p style="margin: 0 0 8px 0;"><strong>Important notes:</strong></p>
          <ul style="padding-left: 20px; margin: 0; font-size: 14px;">
            <li style="margin-bottom: 6px;">Store this code in a secure place</li>
            <li style="margin-bottom: 6px;">You will need this code to recover your account if you forget your password</li>
            <li>This code replaces any previous recovery codes</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${clientURL}" style="background-color: #38bdf8; color: #0f172a; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; display: inline-block;">Go to MernChat</a>
        </div>

        <p>If you didn't request this code, please secure your account immediately by changing your password.</p>
        <p style="margin-top: 24px; margin-bottom: 0;">Best regards,<br />The MernChat Security Team</p>
      </div>

      <div style="text-align: center; padding: 20px; background-color: #1e293b; font-size: 12px; color: #94a3b8;">
        <p>© 2025 MernChat. All rights reserved.</p>
        <p>
          <a href="https://github.com/MihanN1/MernChat#2-terms-of-use-tou" style="color: #38bdf8; text-decoration: none; margin: 0 10px;">Terms of Use</a>
          <a href="https://github.com/MihanN1/MernChat#3-code-of-conduct-coc" style="color: #38bdf8; text-decoration: none; margin: 0 10px;">Code of Conduct</a>
          <a href="https://github.com/MihanN1/MernChat#mernchat-privacy-policy" style="color: #38bdf8; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
          <a href="https://github.com/MihanN1/MernChat#-contacts" style="color: #38bdf8; text-decoration: none; margin: 0 10px;">Contacts</a>
        </p>
      </div>

    </div>
  </body>
  </html>
  `;
};

export function createPasswordResetEmailTemplate(name, resetCode, clientURL) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Password Reset - MernChat</title>
  </head>
  <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a; color: #e2e8f0; margin: 0; padding: 0;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #1e293b; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 20px rgba(0,0,0,0.3);">

      <div style="padding: 32px; text-align: center; background-color: #1e293b;">
        <h1 style="color: #38bdf8; font-size: 28px; margin-bottom: 10px;">Password Reset</h1>
        <p style="color: #94a3b8; margin: 0;">Secure your account</p>
      </div>

      <div style="background-color: #0f172a; padding: 32px;">
        <p style="font-size: 18px; color: #38bdf8; margin-top: 0;"><strong>Hello ${name},</strong></p>
        <p>You have requested to reset your password for your <strong>MernChat</strong> account. Use the code below to complete the process.</p>
        
        <div style="background-color: #1e293b; padding: 20px; border-radius: 10px; text-align: center; margin: 24px 0; border: 1px solid #334155;">
          <p style="margin: 0 0 10px 0; color: #94a3b8; font-size: 14px;">Your password reset code:</p>
          <div style="font-size: 28px; font-weight: bold; color: #38bdf8; letter-spacing: 4px; padding: 12px; background-color: #0f172a; border-radius: 8px; margin: 0 auto; display: inline-block;">
            ${resetCode}
          </div>
          <p style="color: #f87171; font-size: 14px; margin: 15px 0 0 0;">
            This code will expire in 15 minutes!!!!
          </p>
        </div>

        <div style="background-color: #1e293b; padding: 16px; border-radius: 8px; margin: 24px 0; border-left: 4px solid #f59e0b;">
          <p style="margin: 0 0 8px 0;"><strong>Instructions:</strong></p>
          <ul style="padding-left: 20px; margin: 0; font-size: 14px;">
            <li style="margin-bottom: 6px;">Enter this code on the password reset page</li>
            <li style="margin-bottom: 6px;">Create a strong, unique password</li>
            <li>Consider enabling two-factor authentication for extra security</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${clientURL}/forgot-password" style="background-color: #38bdf8; color: #0f172a; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; display: inline-block;">Reset Password</a>
        </div>

        <p>If you didn't request a password reset, please ignore this email or contact our support team if you're concerned about your account's security.</p>
        <p style="margin-top: 24px; margin-bottom: 0;">Stay secure,<br />The MernChat Security Team</p>
      </div>

      <div style="text-align: center; padding: 20px; background-color: #1e293b; font-size: 12px; color: #94a3b8;">
        <p>© 2025 MernChat. All rights reserved.</p>
        <p>
          <a href="https://github.com/MihanN1/MernChat#2-terms-of-use-tou" style="color: #38bdf8; text-decoration: none; margin: 0 10px;">Terms of Use</a>
          <a href="https://github.com/MihanN1/MernChat#3-code-of-conduct-coc" style="color: #38bdf8; text-decoration: none; margin: 0 10px;">Code of Conduct</a>
          <a href="https://github.com/MihanN1/MernChat#mernchat-privacy-policy" style="color: #38bdf8; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
          <a href="https://github.com/MihanN1/MernChat#-contacts" style="color: #38bdf8; text-decoration: none; margin: 0 10px;">Contacts</a>
        </p>
      </div>

    </div>
  </body>
  </html>
  `;
};

export function createEmailVerificationTemplate(name, verificationCode, clientURL) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify Your New Email - MernChat</title>
  </head>
  <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a; color: #e2e8f0; margin: 0; padding: 0;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #1e293b; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 20px rgba(0,0,0,0.3);">

      <div style="padding: 32px; text-align: center; background-color: #1e293b;">
        <h1 style="color: #38bdf8; font-size: 28px; margin-bottom: 10px;">Email Verification</h1>
        <p style="color: #94a3b8; margin: 0;">Confirm your new email address</p>
      </div>

      <div style="background-color: #0f172a; padding: 32px;">
        <p style="font-size: 18px; color: #38bdf8; margin-top: 0;"><strong>Hello ${name},</strong></p>
        <p>You have requested to change your email address for your <strong>MernChat</strong> account. Please verify this new email by entering the code below.</p>
        
        <div style="background-color: #1e293b; padding: 20px; border-radius: 10px; text-align: center; margin: 24px 0; border: 1px solid #334155;">
          <p style="margin: 0 0 10px 0; color: #94a3b8; font-size: 14px;">Your email verification code:</p>
          <div style="font-size: 28px; font-weight: bold; color: #38bdf8; letter-spacing: 4px; padding: 12px; background-color: #0f172a; border-radius: 8px; margin: 0 auto; display: inline-block;">
            ${verificationCode}
          </div>
          <p style="color: #f87171; font-size: 14px; margin: 15px 0 0 0;">
            This code will expire in 15 minutes!!!!
          </p>
        </div>

        <div style="background-color: #1e293b; padding: 16px; border-radius: 8px; margin: 24px 0; border-left: 4px solid #8b5cf6;">
          <p style="margin: 0 0 8px 0;"><strong>What happens next?</strong></p>
          <ul style="padding-left: 20px; margin: 0; font-size: 14px;">
            <li style="margin-bottom: 6px;">Enter this code in the email verification form</li>
            <li style="margin-bottom: 6px;">Your account email will be updated to this address</li>
            <li>All future communications will be sent to this email</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${clientURL}/verify-email" style="background-color: #38bdf8; color: #0f172a; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; display: inline-block;">Verify Email</a>
        </div>

        <p>If you didn't request to change your email address, please secure your account immediately and contact our support team.</p>
        <p style="margin-top: 24px; margin-bottom: 0;">Best regards,<br />The MernChat Team</p>
      </div>

      <div style="text-align: center; padding: 20px; background-color: #1e293b; font-size: 12px; color: #94a3b8;">
        <p>© 2025 MernChat. All rights reserved.</p>
        <p>
          <a href="https://github.com/MihanN1/MernChat#2-terms-of-use-tou" style="color: #38bdf8; text-decoration: none; margin: 0 10px;">Terms of Use</a>
          <a href="https://github.com/MihanN1/MernChat#3-code-of-conduct-coc" style="color: #38bdf8; text-decoration: none; margin: 0 10px;">Code of Conduct</a>
          <a href="https://github.com/MihanN1/MernChat#mernchat-privacy-policy" style="color: #38bdf8; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
          <a href="https://github.com/MihanN1/MernChat#-contacts" style="color: #38bdf8; text-decoration: none; margin: 0 10px;">Contacts</a>
        </p>
      </div>

    </div>
  </body>
  </html>
  `;
};

export function createTwoFactorAuthTemplate(name, authCode, clientURL) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Two-Factor Authentication Code - MernChat</title>
  </head>
  <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a; color: #e2e8f0; margin: 0; padding: 0;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #1e293b; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 20px rgba(0,0,0,0.3);">

      <div style="padding: 32px; text-align: center; background-color: #1e293b;">
        <h1 style="color: #38bdf8; font-size: 28px; margin-bottom: 10px;">Two-Factor Authentication</h1>
        <p style="color: #94a3b8; margin: 0;">Secure login verification</p>
      </div>

      <div style="background-color: #0f172a; padding: 32px;">
        <p style="font-size: 18px; color: #38bdf8; margin-top: 0;"><strong>Hello ${name},</strong></p>
        <p>A login attempt was made to your <strong>MernChat</strong> account. Use the code below to complete the two-factor authentication.</p>
        
        <div style="background-color: #1e293b; padding: 20px; border-radius: 10px; text-align: center; margin: 24px 0; border: 1px solid #334155;">
          <p style="margin: 0 0 10px 0; color: #94a3b8; font-size: 14px;">Your 2FA code:</p>
          <div style="font-size: 28px; font-weight: bold; color: #38bdf8; letter-spacing: 4px; padding: 12px; background-color: #0f172a; border-radius: 8px; margin: 0 auto; display: inline-block;">
            ${authCode}
          </div>
          <p style="color: #f87171; font-size: 14px; margin: 15px 0 0 0;">
            This code will expire in 5 minutes!!!!
          </p>
        </div>

        <div style="background-color: #1e293b; padding: 16px; border-radius: 8px; margin: 24px 0; border-left: 4px solid #10b981;">
          <p style="margin: 0 0 8px 0;"><strong>Security information:</strong></p>
          <ul style="padding-left: 20px; margin: 0; font-size: 14px;">
            <li style="margin-bottom: 6px;">Enter this code in the 2FA verification field</li>
            <li style="margin-bottom: 6px;">If you didn't attempt to login, secure your account immediately</li>
            <li>Never share this code with anyone, including MernChat support</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${clientURL}" style="background-color: #38bdf8; color: #0f172a; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; display: inline-block;">Go to MernChat</a>
        </div>

        <p>This is an automated security message. If you have any concerns about your account security, please contact our support team.</p>
        <p style="margin-top: 24px; margin-bottom: 0;">Stay secure,<br />The MernChat Security Team</p>
      </div>

      <div style="text-align: center; padding: 20px; background-color: #1e293b; font-size: 12px; color: #94a3b8;">
        <p>© 2025 MernChat. All rights reserved.</p>
        <p>
          <a href="https://github.com/MihanN1/MernChat#2-terms-of-use-tou" style="color: #38bdf8; text-decoration: none; margin: 0 10px;">Terms of Use</a>
          <a href="https://github.com/MihanN1/MernChat#3-code-of-conduct-coc" style="color: #38bdf8; text-decoration: none; margin: 0 10px;">Code of Conduct</a>
          <a href="https://github.com/MihanN1/MernChat#mernchat-privacy-policy" style="color: #38bdf8; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
          <a href="https://github.com/MihanN1/MernChat#-contacts" style="color: #38bdf8; text-decoration: none; margin: 0 10px;">Contacts</a>
        </p>
      </div>

    </div>
  </body>
  </html>
  `;
};