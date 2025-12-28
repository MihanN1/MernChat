import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20
    },
    tag: {
        type: String,
        required: true,
        unique: true,
        minlength: 1,
        maxlength: 12,
        lowercase: true,
        validate: {
            validator: function(v) {
                return !/\s/.test(v) && /^[^\s]{1,12}$/.test(v);
            },
            message: props => `${props.value} contains spaces or is too long. Tag must be 1-12 characters with no spaces.`
        }
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
        default: ""
    },
    twoFactorEnabled: {
        type: Boolean,
        default: false
    },
    qrLoginEnabled: {
        type: Boolean,
        default: false
    },
    recoveryCodeHash: {
        type: String,
        default: ""
    },
    passwordResetCode: {
        hashedCode: {
            type: String,
            default: ""
        },
        expiresAt: {
            type: Date,
            default: null
        }
    },
    emailVerificationCode: {
        codeHash: {
            type: String,
            default: ""
        },
        expiresAt: {
            type: Date,
            default: null
        },
        newEmail: {
            type: String,
            default: ""
        }
    }
}, { timestamps: true });

userSchema.methods.verifyRecoveryCode = async function(recoveryCode) {
    return await bcrypt.compare(recoveryCode, this.recoveryCodeHash);
};

userSchema.methods.setRecoveryCode = async function(recoveryCode) {
    this.recoveryCodeHash = await bcrypt.hash(recoveryCode, 10);
    return this.save();
};

userSchema.methods.setEmailVerificationCode = async function(verificationCode, newEmail) {
    const codeHash = await bcrypt.hash(verificationCode, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    
    this.emailVerificationCode = {
        codeHash,
        expiresAt,
        newEmail
    };
    
    return this.save();
};

userSchema.methods.verifyEmailVerificationCode = async function(verificationCode) {
    if (!this.emailVerificationCode || !this.emailVerificationCode.codeHash) {
        return false;
    }
    if (this.emailVerificationCode.expiresAt < new Date()) {
        this.emailVerificationCode = { codeHash: "", expiresAt: null, newEmail: "" };
        await this.save();
        return false;
    }
    return await bcrypt.compare(verificationCode, this.emailVerificationCode.codeHash);
};

userSchema.methods.clearEmailVerificationCode = function() {
    this.emailVerificationCode = { codeHash: "", expiresAt: null, newEmail: "" };
    return this.save();
};

const User = mongoose.model("User", userSchema);
export default User;