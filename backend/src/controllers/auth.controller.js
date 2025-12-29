import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import { ENV } from "../lib/env.js";
import cloudinary from "../lib/cloudinary.js";
import crypto from "crypto";

export const updateProfile = async (req, res) => {
    try {
        const { 
            nickname, 
            tag, 
            profilePic, 
            currentPassword, 
            newPassword, 
            newEmail, 
            verificationCode, 
            securitySettings 
        } = req.body;
        const userId = req.user._id;
        let updateData = {};
        if (nickname !== undefined) {
            if (nickname.length < 3 || nickname.length > 20) {
                return res.status(400).json({ 
                    message: "Nickname must be 3-20 characters" 
                });
            }
            updateData.nickname = nickname;
        }
        if (tag !== undefined) {
            const formattedTag = tag.toLowerCase().replace(/\s/g, "");
            if (formattedTag.length < 1 || formattedTag.length > 12) {
                return res.status(400).json({ 
                    message: "Tag must be 1-12 characters (after removing spaces)" 
                });
            }
            const existingTag = await User.findOne({ 
                tag: formattedTag, 
                _id: { $ne: userId } 
            });
            if (existingTag) {
                return res.status(400).json({ 
                    message: "Tag is already taken" 
                });
            }
            updateData.tag = formattedTag;
        }
        if (profilePic !== undefined) {
            if (profilePic && profilePic.startsWith('data:image')) {
                try {
                    const uploadResponse = await cloudinary.uploader.upload(profilePic);
                    updateData.profilePic = uploadResponse.secure_url;
                } catch (uploadError) {
                    console.error("Cloudinary upload error:", uploadError);
                    return res.status(400).json({ 
                        message: "Failed to upload image" 
                    });
                }
            } else if (profilePic === "") {
                updateData.profilePic = "";
            }
        }
        if (currentPassword && newPassword) {
            const user = await User.findById(userId);
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ 
                    message: "Current password is incorrect" 
                });
            }
            if (newPassword.length < 8) {
                return res.status(400).json({ 
                    message: "New password must be at least 8 characters" 
                });
            }
            updateData.password = await bcrypt.hash(newPassword, 10);
        }
        if (newEmail && verificationCode) {
            const user = await User.findById(userId);  
            const isValidCode = await user.verifyEmailVerificationCode(verificationCode);
            if (!isValidCode) {
                return res.status(400).json({ 
                    message: "Invalid or expired verification code" 
                });
            }
            const existingEmail = await User.findOne({ 
                email: newEmail,
                _id: { $ne: userId } 
            });
            if (existingEmail) {
                return res.status(400).json({ 
                    message: "Email is already in use" 
                });
            }
            updateData.email = newEmail;
            await user.clearEmailVerificationCode();
        }
        if (securitySettings) {
            if (typeof securitySettings.twoFactor === 'boolean') {
                updateData.twoFactorEnabled = securitySettings.twoFactor;
            }
            if (typeof securitySettings.qrLogin === 'boolean') {
                updateData.qrLoginEnabled = securitySettings.qrLogin;
            }
        }
        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            updateData, 
            { new: true }
        ).select('-password');
        res.status(200).json(updatedUser);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        if (error.code === 11000 && error.keyPattern && error.keyPattern.tag) {
            return res.status(400).json({ message: "Tag is already taken" });
        }
        console.error("Update profile error:", error);
        res.status(500).json({ message: error.message });
    }
};
const generateRecoveryCode = () => {
    return crypto.randomBytes(6).toString('hex').toUpperCase();
};
const generateVerificationCode = () => {
    return crypto.randomInt(100000, 1000000).toString();
};
export const login = async (req,res) => {
    const {identifier, password} = req.body
    try {
        const user = await User.findOne({
            $or: [
                { email: identifier },
                { nickname: identifier }
            ]
        });
        if(!user) return res.status(400).json({message:"Invalid credentials"});
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect) return res.status(400).json({message:"Invalid credentials"});
        generateToken(user._id, res);
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            nickname: user.nickname,
            tag: user.tag,
            profilePic: user.profilePic,
            twoFactorEnabled: user.twoFactorEnabled,
            qrLoginEnabled: user.qrLoginEnabled
        });
    } catch (error) {
        console.error("Error in login controller:", error);
        res.status(500).json({message: "Internal server error"});
    }
};
export const logout = (req,res) => {
    res.cookie("jwt","",{maxAge:0});
    res.status(200).json({message: "Logged out successfully"});
};
export const signup = async (req, res) => {
    const {fullName, email, password, nickname, tag} = req.body;
    try {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const existingEmail = await User.findOne({email});
        if (existingEmail) return res.status(400).json({message: "Email already exists"});
        const formattedTag = tag.toLowerCase().replace(/\s/g, "");
        const existingTag = await User.findOne({tag: formattedTag});
        if (existingTag) return res.status(400).json({message: "Tag is already taken"});
        if (!fullName || !email || !password || !nickname || !tag) {
            return res.status(400).json({message: "All fields are required"});
        };
        if (nickname.length < 3 || nickname.length > 20) {
            return res.status(400).json({message: "Nickname must be 3-20 characters"});
        };
        if (tag.length < 1 || tag.length > 12) {
            return res.status(400).json({message: "Tag must be 1-12 characters"});
        };
        if (password.length < 8) {
            return res.status(400).json({message: "Password can't be less than 8 characters"});
        };
        if (!emailRegex.test(email)) {
            return res.status(400).json({message: "Invalid email format"});
        };
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const recoveryCode = generateRecoveryCode();
        const recoveryCodeHash = await bcrypt.hash(recoveryCode, 10);
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            nickname,
            tag: formattedTag,
            recoveryCodeHash,
            twoFactorEnabled: false,
            qrLoginEnabled: false
        });
        if (newUser) {
            const savedUser = await newUser.save();
            generateToken(savedUser._id, res);
            try {
                await sendWelcomeEmail(
                    savedUser.email, 
                    savedUser.fullName, 
                    ENV.CLIENT_URL,
                    recoveryCode
                );
            } catch (error) {
                console.error("Failed to send welcome email:", error);
            }
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                nickname: newUser.nickname,
                tag: newUser.tag,
                profilePic: newUser.profilePic,
                twoFactorEnabled: newUser.twoFactorEnabled,
                qrLoginEnabled: newUser.qrLoginEnabled
            });
        } else {
            res.status(400).json({message: "Invalid user data"});
        };
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({message: messages.join(', ')});
        }
        if (error.code === 11000) {
            if (error.keyPattern && error.keyPattern.tag) {
                return res.status(400).json({message: "Tag is already taken"});
            }
            if (error.keyPattern && error.keyPattern.email) {
                return res.status(400).json({message: "Email already exists"});
            }
        }
        console.log("Error in signup controller: ", error);
        res.status(500).json({message: "Internal server error"});
    }
};

export const sendRecoveryCode = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        const user = await User.findOne({ email });
        if (user) {
            const recoveryCode = generateRecoveryCode();
            await user.setRecoveryCode(recoveryCode);
            // TODO: Actually send email with recovery code and destroy the console.log below
            if (ENV.NODE_ENV === 'development') {
                console.log(`[DEV] Recovery code for ${email}: ${recoveryCode}`);
            }
        }
        return res.status(200).json({ 
            message: 'If an account exists with this email, a recovery code has been sent.'
        });
    } catch (error) {
        console.error("Send recovery code error:", error);
        res.status(500).json({ message: "Failed to send recovery code" });
    }
};
export const verifyRecoveryCode = async (req, res) => {
    try {
        const { email, recoveryCode } = req.body;
        
        if (!email || !recoveryCode) {
            return res.status(400).json({ 
                message: "Email and recovery code are required" 
            });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ 
                message: "Invalid recovery code"
            });
        }
        const isValid = await user.verifyRecoveryCode(recoveryCode.toUpperCase());  
        if (!isValid) { 
            return res.status(400).json({ 
                message: "Invalid recovery code" 
            });
        }
        res.status(200).json({ 
            message: "Recovery code verified successfully",
            canProceed: true
        });
    } catch (error) {
        console.error("Verify recovery code error:", error);
        res.status(500).json({ message: "Failed to verify recovery code" });
    }
};
export const sendNewEmailVerification = async (req, res) => {
    try {
        const { email, newEmail } = req.body;
        if (!email || !newEmail) {
            return res.status(400).json({
                message: "Both current and new email are required"
            });
        }
        const user = await User.findOne({ email });  
        if (!user) {  
            return res.status(200).json({  
                message: "If account exists, verification code sent to new email."  
            });  
        }
        const existingUser = await User.findOne({ email: newEmail });
        if (existingUser) {
            return res.status(400).json({
                message: "Email is already in use"
            });
        }
        const verificationCode = generateVerificationCode();
        await user.setEmailVerificationCode(verificationCode, newEmail);
        // TODO: Actually send email with verification code and destroy the console.log below
        if (ENV.NODE_ENV === 'development') {
            console.log(`[DEV] Verification code for ${newEmail}: ${verificationCode}`);
        }
        res.status(200).json({
            message: "Verification code sent to new email",
        });
    } catch (error) {
        console.error("Send new email verification error:", error);
        res.status(500).json({ message: "Failed to send verification code" });
    }
};
export const recoverEmail = async (req, res) => {
    try {
        const { email, verificationCode, recoveryCode } = req.body;
        if (!email || !verificationCode || !recoveryCode) {
            return res.status(400).json({ 
                message: "All fields are required" 
            });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ 
                message: "Invalid recovery code or verification code" 
            });
        }
        const isRecoveryCodeValid = await user.verifyRecoveryCode(recoveryCode);
        if (!isRecoveryCodeValid) {
            return res.status(400).json({ 
                message: "Invalid recovery code" 
            });
        }
        const isVerificationCodeValid = await user.verifyEmailVerificationCode(verificationCode);
        if (!isVerificationCodeValid) {
            return res.status(400).json({ 
                message: "Invalid or expired verification code" 
            });
        }
        const newEmail = user.emailVerificationCode.newEmail;
        if (!newEmail) {
            return res.status(400).json({ 
                message: "No new email associated with this verification code" 
            });
        }
        const existingUser = await User.findOne({ email: newEmail });
        if (existingUser) {
            return res.status(400).json({ 
                message: "Email is already in use" 
            });
        }
        user.email = newEmail;
        const newRecoveryCode = generateRecoveryCode();
        user.recoveryCodeHash = await bcrypt.hash(newRecoveryCode, 10);
        await user.clearEmailVerificationCode();
        await user.save();

        if (ENV.NODE_ENV === 'development') {  
            console.log(`[DEV] New recovery code for ${newEmail}: ${newRecoveryCode}`);  
        }
        res.status(200).json({ 
            message: "Email updated successfully. Check your new email for the updated recovery code."
        });
    } catch (error) {
        console.error("Recover email error:", error);
        res.status(500).json({ message: "Failed to recover email" });
    }
};

export const sendPasswordResetCode = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email || !validator.isEmail(email)) {
            return res.status(400).json({ message: 'Please provide a valid email address' });
        }
        const user = await User.findOne({ email: email.toLowerCase() });
        if (user) {
            const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
            const hashedCode = await bcrypt.hash(resetCode, 10);
            await ResetCode.findOneAndUpdate(
                { email: email.toLowerCase() },
                { 
                    code: hashedCode, 
                    expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
                },
                { upsert: true, new: true }
            );
            if (ENV.NODE_ENV === 'development') {
                console.log(`Password reset code for ${email}: ${resetCode}`); //TODO: send password reset code plz
            }
        }
        return res.status(200).json({
            message: 'If an account exists with this email, a password reset code has been sent.'
        });
    } catch (error) {
        console.error('Send password reset code error:', error);
        return res.status(500).json({ message: 'An error occurred. Please try again later.' });
    }
};
export const verifyPasswordResetCode = async (req, res) => {
    try {
        const { email, resetCode } = req.body;
        if (!email || !resetCode) {  
            return res.status(400).json({ 
                message: "Email and reset code are required" 
            });  
        }
        const user = await User.findOne({ email });
        if (user) {
            if (!user.passwordResetCode || !user.passwordResetCode.codeHash) {  
                    return res.status(400).json({ 
                        message: "Invalid reset code" 
                    });  
                }  
            if (user.passwordResetCode.expiresAt < new Date()) {  
                user.passwordResetCode = { codeHash: "", expiresAt: null };  
                await user.save();  
                return res.status(400).json({ 
                    message: "Reset code has expired" 
                });  
            }  
            const isCodeValid = await bcrypt.compare(resetCode, user.passwordResetCode.codeHash);  
            if (!isCodeValid) {  
                return res.status(400).json({ 
                    message: "Invalid reset code" 
                });  
            } 
        }
        res.status(200).json({ 
            message: "Reset code is valid."
        });
    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ message: "Failed to validate password reset code" });
    }
};
export const resetPassword = async (req, res) => {
    try {
        const { email, resetCode, newPassword } = req.body;
        const user = await User.findOne({ email });  
        if (!user) {  
            return res.status(400).json({ 
                message: "Invalid reset code"  
            });  
        }
        if (!user.passwordResetCode || !user.passwordResetCode.codeHash) {  
            return res.status(400).json({ 
                message: "Invalid reset code" 
            });  
        }  
        if (user.passwordResetCode.expiresAt < new Date()) {  
            user.passwordResetCode = { codeHash: "", expiresAt: null };  
            await user.save();  
            return res.status(400).json({ 
                message: "Reset code has expired" 
            });  
        }  
        const isCodeValid = await bcrypt.compare(resetCode, user.passwordResetCode.codeHash);  
        if (!isCodeValid) {  
            return res.status(400).json({ 
                message: "Invalid reset code" 
            });  
        }  
        
        const salt = await bcrypt.genSalt(10);  
        user.password = await bcrypt.hash(newPassword, salt);  
        user.passwordResetCode = { codeHash: "", expiresAt: null };  
        await user.save();  
        res.status(200).json({ 
            message: "Password reset successfully. You can now login with your new password."  
        });
    } catch (error) {
        console.error('Reset password error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
// Not sure in the Password recovery and email recovery logic. So here is the intended one:
//When you recover your password, you enter the email of yours and the new password, then, after the checks, you get sent the password reset code, which, if when entered is right, will change the password to the new one.
//When you recover your email, you enter your old email, then new email, then the recovery code. If everything is alright, you get sent the email verification code TO YOUR NEW EMAIL, and if when entered is right the email is changed to the new one.
//The problem is the connection between frontend and backend(for example handleVerificationSubmit function sends four variables and recoverEmail requires three), and sendRecoveryCode, sendNewEmailVerification and sendPasswordResetCode that do exist but are never used. 
//Also there is no email verification code verification, so it might break the program too.