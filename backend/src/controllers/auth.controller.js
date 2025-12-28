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
            const tagRegex = /^[a-z0-9.,\/?\-=+_]*$/;
            
            if (formattedTag.length < 1 || formattedTag.length > 12) {
                return res.status(400).json({ 
                    message: "Tag must be 1-12 characters" 
                });
            }
            if (!tagRegex.test(formattedTag)) {
                return res.status(400).json({ 
                    message: "Tag contains invalid characters" 
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
            const isValidCode = verifyEmailCode(newEmail, verificationCode);
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
            emailVerificationCodes.delete(newEmail);
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
        console.error("Update profile error:", error);
        res.status(500).json({ message: error.message });
    }
};
const emailVerificationCodes = new Map();  
  
const verifyEmailCode = (email, code) => {  
    const stored = emailVerificationCodes.get(email);  
    if (!stored) return false;  
    if (stored.expiresAt < Date.now()) {  
        emailVerificationCodes.delete(email);  
        return false;  
    }  
    return stored.code === code;  
};  
const generateRecoveryCode = () => {
    return crypto.randomBytes(6).toString('hex').toUpperCase();
};
emailVerificationCodes.set(newEmail, {  
    code: verificationCode,  
    expiresAt: Date.now() + 10 * 60 * 1000
});  
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
export const signup = async (req,res) => {
    const {fullName, email, password, nickname, tag} = req.body
    try {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!fullName || !email || !password || !nickname || !tag) {
            return res.status(400).json({message: "All fields are required"})
        };
        const existingEmail = await User.findOne({email});
        if (existingEmail) return res.status(400).json({message: "Email already exists"});
        const formattedTag = tag.toLowerCase().replace(/\s/g, "");
        const existingTag = await User.findOne({tag: formattedTag});
        if (existingTag) return res.status(400).json({message: "Tag is already taken"});
        if (nickname.length < 3 || nickname.length > 20) {
            return res.status(400).json({message: "Nickname must be 3-20 characters"})
        };
        if (tag.length < 1 || tag.length > 12) {
            return res.status(400).json({message: "Tag must be 1-12 characters"})
        };
        const tagRegex = /^[a-z0-9.,\/?\-=+_]*$/;
        if (!tagRegex.test(formattedTag)) {
            return res.status(400).json({message: "Tag contains invalid characters"})
        };
        if (password.length < 8) {
            return res.status(400).json({message: "Password can't be less than 8 characters"})
        };
        if (!emailRegex.test(email)) {
            return res.status(400).json({message: "Invalid email format"})
        };
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const recoveryCode = generateRecoveryCode();
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            nickname,
            tag: formattedTag,
            recoveryCode,
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
        if (!user) {
            return res.status(404).json({ message: "No account found with this email" });
        }
        if (!user.recoveryCode) {
            user.recoveryCode = generateRecoveryCode();
            await user.save();
        }
        // TODO: Actually send email with recovery code and destroy the console.log below
        console.log(`Recovery code for ${email}: ${user.recoveryCode}`);
        
        res.status(200).json({ 
            message: "Recovery code sent to your email",
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
            return res.status(404).json({ 
                message: "No account found with this email" 
            });
        }
        if (user.recoveryCode !== recoveryCode.toUpperCase()) {
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
        const existingUser = await User.findOne({ email: newEmail });
        if (existingUser) {
            return res.status(400).json({ 
                message: "Email is already in use" 
            });
        }
        const verificationCode = generateVerificationCode();
        // TODO: Actually send email with verification code and destroy the console.log below
        console.log(`Verification code for ${newEmail}: ${verificationCode}`);
        // TODO: STORE THIS WITH TIMER AS NOW ITS NOT F-ING SAFE YOU IDIOT! YES, IM SPEAKING TO MYSELF!
        res.status(200).json({ 
            message: "Verification code sent to new email",
            code: verificationCode
        });
    } catch (error) {
        console.error("Send new email verification error:", error);
        res.status(500).json({ message: "Failed to send verification code" });
    }
};
export const recoverEmail = async (req, res) => {
    try {
        const { email, newEmail, verificationCode, recoveryCode } = req.body;
        if (!email || !newEmail || !verificationCode || !recoveryCode) {
            return res.status(400).json({ 
                message: "All fields are required" 
            });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ 
                message: "User not found" 
            });
        }
        if (user.recoveryCode !== recoveryCode.toUpperCase()) {
            return res.status(400).json({ 
                message: "Invalid recovery code" 
            });
        }
        const existingUser = await User.findOne({ email: newEmail });
        if (existingUser) {
            return res.status(400).json({ 
                message: "Email is already in use" 
            });
        }
        // TODO: Verify the verification code (this would come from your email service)
        user.email = newEmail;
        const newRecoveryCode = generateRecoveryCode();
        user.recoveryCode = newRecoveryCode;
        await user.save();
        // TODO: Send new recovery code to the new email
        console.log(`New recovery code for ${newEmail}: ${newRecoveryCode}`);
        res.status(200).json({ 
            message: "Email updated successfully. A new recovery code has been sent to your new email.",
        });
    } catch (error) {
        console.error("Recover email error:", error);
        res.status(500).json({ message: "Failed to recover email" });
    }
};

export const sendPasswordResetCode = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "No account found with this email" });
        }
        const resetCode = generateVerificationCode();
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
        user.passwordResetCode = {
            code: resetCode,
            expiresAt: expiresAt
        };
        
        await user.save();
        // TODO: Send email with reset code
        console.log(`Password reset code for ${email}: ${resetCode}`);
        
        res.status(200).json({ 
            message: "Password reset code sent to your email"
        });
    } catch (error) {
        console.error("Send password reset code error:", error);
        res.status(500).json({ message: "Failed to send reset code" });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email, resetCode, newPassword } = req.body;
        
        if (!email || !resetCode || !newPassword) {
            return res.status(400).json({ 
                message: "All fields are required" 
            });
        }
        if (newPassword.length < 8) {
            return res.status(400).json({ 
                message: "Password must be at least 8 characters" 
            });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ 
                message: "User not found" 
            });
        }
        if (!user.passwordResetCode || !user.passwordResetCode.code) {
            return res.status(400).json({ 
                message: "No reset code found for this email" 
            });
        }
        if (user.passwordResetCode.expiresAt < new Date()) {
            user.passwordResetCode = { code: "", expiresAt: null };
            await user.save();
            return res.status(400).json({ 
                message: "Reset code has expired" 
            });
        }
        if (user.passwordResetCode.code !== resetCode) {
            return res.status(400).json({ 
                message: "Invalid reset code" 
            });
        }
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.passwordResetCode = { code: "", expiresAt: null };
        await user.save();
        res.status(200).json({ 
            message: "Password reset successfully. You can now login with your new password."
        });
    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ message: "Failed to reset password" });
    }
};