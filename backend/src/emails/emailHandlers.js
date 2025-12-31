import { resendClient, sender } from "../lib/resend.js";
import { createWelcomeEmailTemplate, createNewRecoveryEmailTemplate, createPasswordResetEmailTemplate, createEmailVerificationTemplate } from "../emails/emailTemplates.js";

export const sendWelcomeEmail = async (email, name, clientURL, recoveryCode) => {
  const { data, error } = await resendClient.emails.send({
    from: `${sender.name} <${sender.email}>`,
    to: email,
    subject: "ATTENTION! READ THIS BEFORE STARTING TO USE MERNCHAT!",
    html: createWelcomeEmailTemplate(name, recoveryCode, clientURL),
  });
  if (error) {
    console.error("Error sending welcome email:", error);
    throw new Error("Failed to send welcome email");
  }
  console.log("Welcome Email sent successfully", data);
};
export const sendNewRecoveryEmail = async (email, name, clientURL, recoveryCode) => {
  const { data, error } = await resendClient.emails.send({
    from: `${sender.name} <${sender.email}>`,
    to: email,
    subject: "New recovery code!",
    html: createNewRecoveryEmailTemplate(name, recoveryCode, clientURL)
  });
  if (error) {
    console.error("Error sending email with new recovery code:", error);
    throw new Error("Failed to send email with new recovery code");
  }
  console.log("New recovery code sent successfully", data)
};
export const sendPasswordResetEmail = async (email, name, clientURL, resetCode) => {
  const { data, error } = await resendClient.emails.send({
    from: `${sender.name} <${sender.email}>`,
    to: email,
    subject: "Reset your password!",
    html: createPasswordResetEmailTemplate(name, resetCode, clientURL)
  });
  if (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
  console.log("Password reset code sent successfully", data)
};
export const sendEmailVerificationEmail = async (email, name, clientURL, verificationCode) => {
  const { data, error } = await resendClient.emails.send({
    from: `${sender.name} <${sender.email}>`,
    to: email,
    subject: "Verify your new email!",
    html: createEmailVerificationTemplate(name, verificationCode, clientURL)
  });
  if (error) {
    console.error("Error sending email verification code:", error);
    throw new Error("Failed to send email verification code");
  }
  console.log("Email verification code sent successfully", data)
};