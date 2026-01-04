import { resendClient, sender } from "../lib/resend.js";
import { 
  createWelcomeEmailTemplate, 
  createNewRecoveryEmailTemplate, 
  createPasswordResetEmailTemplate, 
  createEmailVerificationTemplate,
  createTwoFactorAuthTemplate
} from "../emails/emailTemplates.js";
const EMAIL_CONFIGS = {
  WELCOME: {
    subject: "ATTENTION! READ THIS BEFORE STARTING TO USE MERNCHAT!",
    template: createWelcomeEmailTemplate,
    errorMessage: "Failed to send welcome email",
    successMessage: "Welcome Email sent successfully"
  },
  NEW_RECOVERY: {
    subject: "New recovery code!",
    template: createNewRecoveryEmailTemplate,
    errorMessage: "Failed to send email with new recovery code",
    successMessage: "New recovery code sent successfully"
  },
  PASSWORD_RESET: {
    subject: "Reset your password!",
    template: createPasswordResetEmailTemplate,
    errorMessage: "Failed to send password reset email",
    successMessage: "Password reset code sent successfully"
  },
  EMAIL_VERIFICATION: {
    subject: "Verify your new email!",
    template: createEmailVerificationTemplate,
    errorMessage: "Failed to send email verification code",
    successMessage: "Email verification code sent successfully"
  },
  TWO_FACTOR_AUTH: {
    subject: "Verify login!",
    template: createTwoFactorAuthTemplate,
    errorMessage: "Failed to send two factor authorization code",
    successMessage: "Two factor authorization code sent successfully"
  }
};
const sendEmail = async (emailType, email, name, clientURL, code) => {
  const config = EMAIL_CONFIGS[emailType];
  if (!config) {
    console.error("Invalid email type:", emailType);
    throw new Error("Invalid email type");
  }
  const { data, error } = await resendClient.emails.send({
    from: `${sender.name} <${sender.email}>`,
    to: email,
    subject: config.subject,
    html: config.template(name, code, clientURL),
  });
  if (error) {
    console.error(`Error sending ${emailType.toLowerCase()} email:`, error);
    throw new Error(config.errorMessage);
  }
  console.log(config.successMessage, data);
  return data;
};
export const sendWelcomeEmail = async (email, name, clientURL, recoveryCode) => {
  return sendEmail('WELCOME', email, name, clientURL, recoveryCode);
};
export const sendNewRecoveryEmail = async (email, name, clientURL, recoveryCode) => {
  return sendEmail('NEW_RECOVERY', email, name, clientURL, recoveryCode);
};
export const sendPasswordResetEmail = async (email, name, clientURL, resetCode) => {
  return sendEmail('PASSWORD_RESET', email, name, clientURL, resetCode);
};
export const sendEmailVerificationEmail = async (email, name, clientURL, verificationCode) => {
  return sendEmail('EMAIL_VERIFICATION', email, name, clientURL, verificationCode);
};
export const sendTwoFactorAuthEmail = async (email, name, clientURL, authCode) => {
  return sendEmail('TWO_FACTOR_AUTH', email, name, clientURL, authCode);
};