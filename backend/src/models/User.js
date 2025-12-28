import mongoose from "mongoose";

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
                return /^[a-z0-9.,\/?\-=+_]*$/.test(v);
            },
            message: props => `${props.value} contains invalid characters`
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
    recoveryCode: {
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
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;