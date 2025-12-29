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
          <a href="https://github.com/MihanN1/MernChat/blob/master/README.md" style="color: #38bdf8; text-decoration: none; margin: 0 10px;">Code of Conduct</a>
          <a href="https://github.com/MihanN1/MernChat/blob/master/README.md" style="color: #38bdf8; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
          <a href="https://github.com/MihanN1/MernChat/blob/master/README.md" style="color: #38bdf8; text-decoration: none; margin: 0 10px;">Terms of Use</a>
          <a href="https://github.com/MihanN1/MernChat/blob/master/README.md" style="color: #38bdf8; text-decoration: none; margin: 0 10px;">Contacts</a>
        </p>
      </div>

    </div>
  </body>
  </html>
  `;
};
//TODO: make an email template for 2FA, NEW recovery code and email or password reset, make 2FA work, and PLEASE make it so if you have an auth cookie you wont need to send the email, but also add a button "remember me" and "log in with QR" to login page
//TODO: make it so if you log in with QR you dont get the 2FA email, make logging in with QR work.