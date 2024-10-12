import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'user name required'],
        minLength: [1, 'too short user name']
    },
    email:{
        type: String,
        trim: true,
        required: [true, 'email required'],
        minLength: 1,
        unique: [true, 'email must be unique']
    },
    password: {
        type: String,
        required: true,
        minLength: [6, 'minLength 6 characters'],
    },
    phone: {
        type: String,
        required: [true, 'phone number required'],
    },
    profilePic: String,
    changePasswordAt: Date,
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: "user"
    },
    isActive: {
        type: Boolean,
        default: true
    },
    wishList: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref:'product'
    }],
    address: [{
        city: String,
        street: String,
        phone: String
    }],
    verifyToken: {
        type: String,
        default: null
    },
    verifyChangeEmailToken:{
        type:String,
        default:null
    },
    verified: {
        type: Boolean,
        default: false
    },
    resetToken:{
        type:String,
        default:null
    },
    resetTokenExpiration:{
        type:Date,
        default:null
    }
}, { timestamps: true });

    

export const userModel = mongoose.model('user', userSchema);
